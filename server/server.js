// server/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";


/* =========================================================
   PATH / ENVIRONMENT
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env regardless of where the command is executed from
dotenv.config({
    path: path.join(__dirname, ".env")
});


/* =========================================================
   GEMINI API KEY
========================================================= */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {

    console.error("");
    console.error("❌ GEMINI_API_KEY was not found!");
    console.error("");
    console.error("Make sure this file exists:");
    console.error("server/.env");
    console.error("");
    console.error("And contains:");
    console.error("GEMINI_API_KEY=your_api_key");
    console.error("");

    process.exit(1);
}

console.log("✅ Gemini API key loaded successfully.");


/* =========================================================
   GEMINI CONFIGURATION
========================================================= */

const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY
});


/* =========================================================
   SERVER CONFIGURATION
========================================================= */

const app = express();

const PORT = 3000;

// Keep this model consistent with your current setup
const MODEL = "gemini-3.8-flash";

const MODELS = [
    "gemini-3.8-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite"
];

// Retry temporary errors
const MAX_RETRIES = 3;


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(express.json({
    limit: "20mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}));


/* =========================================================
   HELPERS
========================================================= */

function sleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/* ---------------------------------------------------------
   Get HTTP/API status from Gemini error
--------------------------------------------------------- */

function getStatus(error) {

    return Number(
        error?.status ||
        error?.code ||
        error?.response?.status ||
        0
    );

}


/* ---------------------------------------------------------
   Check if Gemini error can be retried
--------------------------------------------------------- */

function isRetryable(error) {

    const status = getStatus(error);

    return (
        status === 408 ||
        status === 429 ||
        status >= 500
    );

}


/* ---------------------------------------------------------
   Gemini request with automatic retry
--------------------------------------------------------- */

async function generateAI(options) {

    let lastError;

    for (const model of MODELS) {

        console.log("");
        console.log(`🤖 Trying model: ${model}`);

        for (
            let attempt = 1;
            attempt <= MAX_RETRIES;
            attempt++
        ) {

            try {

                console.log(
                    `   Attempt ${attempt}/${MAX_RETRIES}`
                );

                const response =
                    await ai.models.generateContent({
                        ...options,
                        model: model
                    });

                console.log(
                    `✅ Success with ${model}`
                );

                return response;

            } catch (error) {

                lastError = error;

                const status = getStatus(error);

                console.error(
                    `❌ ${model} failed:`,
                    status,
                    error?.message || error
                );


                /*
                 * If it's a temporary capacity/rate-limit
                 * problem, retry.
                 */
                if (
                    isRetryable(error) &&
                    attempt < MAX_RETRIES
                ) {

                    const delay =
                        (2000 * Math.pow(2, attempt - 1)) +
                        Math.floor(Math.random() * 500);

                    console.log(
                        `⏳ Waiting ${delay}ms before retry...`
                    );

                    await sleep(delay);

                    continue;
                }


                /*
                 * Move to the next model.
                 */
                break;
            }
        }
    }


    throw lastError;
}


/* ---------------------------------------------------------
   Clean / limit text
--------------------------------------------------------- */

function cleanText(value, max = 3000) {

    return String(value || "")
        .trim()
        .slice(0, max);

}


/* ---------------------------------------------------------
   Clean Gemini JSON response
--------------------------------------------------------- */

function cleanJSON(text) {

    return String(text || "")
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

}


/* ---------------------------------------------------------
   Friendly API error messages
--------------------------------------------------------- */

function formatError(error) {

    const status = getStatus(error);


    if (status === 503) {

        return (
            "Smart AI is temporarily busy. " +
            "Please try again in a few seconds."
        );

    }


    if (status === 429) {

        return (
            "Smart AI is temporarily busy or rate-limited. " +
            "Please wait a moment and try again."
        );

    }


    if (status === 400) {

        return (
            error?.message ||
            "Smart AI received an invalid request."
        );

    }


    return (
        error?.message ||
        "Smart AI request failed."
    );

}


/* =========================================================
   SERVER HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "InternGuide Smart AI Server is running!",

        model: MODEL

    });

});


/* =========================================================
   TEST GEMINI
========================================================= */

app.get("/test-ai", async (req, res) => {

    try {

        const response = await generateAI({

            model: MODEL,

            contents:
                "Write one short professional CV summary for a university Information Technology student. Maximum 40 words.",

            config: {

                // Lower thinking = faster response
                thinkingConfig: {
                    thinkingLevel: "minimal"
                },

                maxOutputTokens: 100

            }

        });


        res.json({

            success: true,

            text:
                response.text || ""

        });


    } catch (error) {

        console.error(
            "❌ Test AI error:",
            error
        );


        res.status(
            getStatus(error) || 500
        ).json({

            success: false,

            error:
                formatError(error)

        });

    }

});


/* =========================================================
   SINGLE CV SECTION GENERATION
========================================================= */

app.post("/api/cv/generate", async (req, res) => {

    try {

        const {
            type,
            keywords,
            role,
            education,
            skills
        } = req.body;


        /* -------------------------------------------------
           Validate input
        ------------------------------------------------- */

        if (
            !keywords ||
            !String(keywords).trim()
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Please provide some information first."

            });

        }


        /* -------------------------------------------------
           Prompt
        ------------------------------------------------- */

        const prompt = `
You are InternGuide Smart AI.

Create a professional ${type || "CV section"} for a university student.

Student notes:
${cleanText(keywords, 3000)}

Career role:
${cleanText(role, 500) || "Not provided"}

Education:
${cleanText(education, 700) || "Not provided"}

Skills:
${cleanText(skills, 700) || "Not provided"}

Rules:
- Only use information provided.
- Never invent achievements.
- Never invent companies.
- Never invent numbers.
- Never invent experience.
- Improve grammar and professional tone.
- Keep the answer concise.
- Make it suitable for internship applications.
- Return only the requested content.
`;


        /* -------------------------------------------------
           Gemini
        ------------------------------------------------- */

        const response = await generateAI({

            model: MODEL,

            contents: prompt,

            config: {

                thinkingConfig: {
                    thinkingLevel: "low"
                },

                maxOutputTokens: 300

            }

        });


        /* -------------------------------------------------
           Response
        ------------------------------------------------- */

        res.json({

            success: true,

            text:
                (response.text || "").trim()

        });


    } catch (error) {

        console.error(
            "❌ CV generation error:",
            error
        );


        res.status(
            getStatus(error) || 500
        ).json({

            success: false,

            error:
                formatError(error)

        });

    }

});


/* =========================================================
   FULL CV BUILDER — STRONG VERSION
========================================================= */

app.post("/api/cv/build", async (req, res) => {

    try {

        console.log("");
        console.log("========================================");
        console.log("📄 SMART AI — FULL CV BUILDER");
        console.log("========================================");


        /* =================================================
           GET USER INPUT
        ================================================= */

        const paragraph =
            String(
                req.body.summaryParagraph ||
                req.body.paragraph ||
                ""
            ).trim();


        const profile =
            req.body.profile ||
            req.body.userProfile ||
            {};


        const existingCertificates =
            String(
                req.body.existingCertificates ||
                ""
            ).trim();


        const certificateFiles =
            Array.isArray(req.body.certificateFiles)
                ? req.body.certificateFiles
                : [];


        if (!paragraph) {

            return res.status(400).json({

                success: false,

                error:
                    "Please tell Smart AI about yourself first."

            });

        }


        /* =================================================
           PROFILE DATA
        ================================================= */

        const profileText = [

            `Full name: ${cleanText(
                profile.fullName,
                200
            )}`,

            `Email: ${cleanText(
                profile.email,
                200
            )}`,

            `Phone: ${cleanText(
                profile.phone,
                100
            )}`,

            `Location: ${cleanText(
                profile.location,
                200
            )}`,

            `University: ${cleanText(
                profile.university,
                300
            )}`,

            `Major: ${cleanText(
                profile.major,
                300
            )}`,

            `Year of study: ${cleanText(
                profile.yearOfStudy,
                100
            )}`,

            `Expected graduation: ${cleanText(
                profile.graduation,
                100
            )}`,

            `Career interests: ${cleanText(
                profile.careerRoles,
                700
            )}`,

            `Preferred industry: ${cleanText(
                profile.preferredIndustry,
                300
            )}`,

            `Preferred location: ${cleanText(
                profile.preferredLocation,
                300
            )}`,

            `Internship type: ${cleanText(
                profile.internshipType,
                200
            )}`,

            `Skills: ${cleanText(
                profile.skills,
                1000
            )}`,

            `Languages: ${cleanText(
                profile.languages,
                700
            )}`,

            `Bio: ${cleanText(
                profile.bio,
                1200
            )}`

        ]
            .filter(line => !line.endsWith(": "))
            .join("\n");


        /* =================================================
           CERTIFICATES
        ================================================= */

        const uploadedCertificates =
            certificateFiles

                .map(file =>
                    cleanText(
                        file?.name,
                        200
                    )
                )

                .filter(Boolean)

                .join(", ");


        const certificateText = [

            existingCertificates
                ? `Certificates provided by student: ${existingCertificates}`
                : "",

            uploadedCertificates
                ? `Certificate files uploaded: ${uploadedCertificates}`
                : ""

        ]
            .filter(Boolean)
            .join("\n");


        /* =================================================
           STRONG FULL-CV PROMPT
        ================================================= */

        const prompt = `
You are InternGuide Smart AI.

Your job is to transform the student's information into a
COMPLETE, PROFESSIONAL INTERNSHIP CV.

Do NOT return a partial CV.

The final result MUST contain every section requested
below.

==================================================
STUDENT DESCRIPTION
==================================================

${cleanText(paragraph, 6000)}


==================================================
PROFILE INFORMATION
==================================================

${profileText || "No additional profile information provided."}


==================================================
CERTIFICATES
==================================================

${certificateText || "No certificate information provided."}


==================================================
YOUR TASK
==================================================

Create a complete internship-ready CV containing:

1. PERSONAL INFORMATION

2. PROFESSIONAL TITLE

3. PROFESSIONAL PROFILE / SUMMARY

4. EDUCATION

5. CAREER INTERESTS

6. TECHNICAL SKILLS

7. SOFT SKILLS

8. EXPERIENCE

9. PROJECTS

10. CERTIFICATES

11. LANGUAGES


==================================================
IMPORTANT WRITING RULES
==================================================

PERSONAL INFORMATION
--------------------
Use the student's actual information.

Do not invent:
- email
- phone
- address
- university
- degree
- dates


PROFESSIONAL TITLE
------------------
Create a concise professional title based on the
student's major, skills and career interests.

Examples:

"Information Technology Student"

"Computer Science Student & Aspiring Software Developer"

"Web Development Student"

"Marketing Student"

Do NOT claim a professional job position the student
has not actually held.


PROFILE SUMMARY
---------------
Write a strong professional summary.

Length:
50–80 words.

The summary should mention:
- current academic background
- strongest relevant skills
- career interests
- what the student is looking for

Make it sound professional and confident.


EDUCATION
---------
Use the university, major, year and graduation information
provided by the student.

Format each education entry clearly.

If only one education record exists, return one entry.

Never invent a school or degree.


CAREER INTERESTS
----------------
Create 3–6 relevant career interests based on:
- major
- skills
- preferred industry
- preferred roles
- student's description

Examples:
- Web Development
- Software Engineering
- UI/UX Design
- Data Analysis

These are career interests, NOT claims of experience.


TECHNICAL SKILLS
----------------
Extract and organize the student's technical skills.

Maximum 12.

Examples:
- HTML
- CSS
- JavaScript
- Python
- SQL
- Git
- Figma

Only include skills supported by the student's information.


SOFT SKILLS
-----------
Extract reasonable soft skills from the student's
description and profile.

Maximum 6.

Examples:
- Problem Solving
- Communication
- Teamwork
- Time Management
- Adaptability

Do NOT claim leadership or achievements unless supported.


EXPERIENCE
----------
If the student has real work/internship experience,
organize it professionally.

Maximum 3 entries.

Each entry should contain:
- position
- organization
- dates
- 2–4 concise bullet points

IMPORTANT:
Never invent an employer.

If there is no real work experience,
return an empty experience array.


PROJECTS
--------
This is especially important for university students.

Extract projects mentioned in the student's description.

Academic, university, personal or portfolio projects
may be included.

For each project provide:
- project name
- short description
- technologies
- 2–4 contribution bullets

If the student describes skills but does not mention
a project, DO NOT invent a project.


CERTIFICATES
------------
Use only certificates supplied by the student.

Never invent certificates.

If none are supplied, return an empty array.


LANGUAGES
---------
Preserve the student's languages.

Include proficiency when provided.

Examples:

"Khmer — Native"

"English — Intermediate"

"Chinese — Beginner"

Never invent a language.


==================================================
CRITICAL RULE
==================================================

DO NOT OMIT SECTIONS.

Always return these fields:

personalInformation
professionalTitle
summary
education
careerInterests
technicalSkills
softSkills
experience
projects
certificates
languages


If information is unavailable:

Return an empty array for that section.

Do NOT make up facts.

==================================================
QUALITY
==================================================

The CV should feel like it was professionally written
for a university student applying for internships.

Use:
- concise wording
- strong action verbs
- professional English
- clean descriptions
- ATS-friendly language
- no unnecessary explanations

Return ONLY valid JSON.
`;


        /* =================================================
           GEMINI REQUEST
        ================================================= */

        console.log(
            "🤖 Generating complete CV..."
        );


        const response = await generateAI({

            model: MODEL,

            contents: prompt,

            config: {

                thinkingConfig: {

                    thinkingLevel: "low"

                },

                responseMimeType:
                    "application/json",

                responseSchema: {

                    type: "object",

                    properties: {

                        personalInformation: {

                            type: "object",

                            properties: {

                                fullName: {
                                    type: "string"
                                },

                                email: {
                                    type: "string"
                                },

                                phone: {
                                    type: "string"
                                },

                                location: {
                                    type: "string"
                                }

                            },

                            required: [
                                "fullName",
                                "email",
                                "phone",
                                "location"
                            ]

                        },


                        professionalTitle: {

                            type: "string"

                        },


                        summary: {

                            type: "string"

                        },


                        education: {

                            type: "array",

                            items: {

                                type: "object",

                                properties: {

                                    institution: {
                                        type: "string"
                                    },

                                    degree: {
                                        type: "string"
                                    },

                                    year: {
                                        type: "string"
                                    },

                                    graduation: {
                                        type: "string"
                                    }

                                },

                                required: [
                                    "institution",
                                    "degree",
                                    "year",
                                    "graduation"
                                ]

                            }

                        },


                        careerInterests: {

                            type: "array",

                            items: {
                                type: "string"
                            }

                        },


                        technicalSkills: {

                            type: "array",

                            items: {
                                type: "string"
                            }

                        },


                        softSkills: {

                            type: "array",

                            items: {
                                type: "string"
                            }

                        },


                        experience: {

                            type: "array",

                            items: {

                                type: "object",

                                properties: {

                                    position: {
                                        type: "string"
                                    },

                                    organization: {
                                        type: "string"
                                    },

                                    dates: {
                                        type: "string"
                                    },

                                    bullets: {

                                        type: "array",

                                        items: {
                                            type: "string"
                                        }

                                    }

                                },

                                required: [
                                    "position",
                                    "organization",
                                    "dates",
                                    "bullets"
                                ]

                            }

                        },


                        projects: {

                            type: "array",

                            items: {

                                type: "object",

                                properties: {

                                    name: {
                                        type: "string"
                                    },

                                    description: {
                                        type: "string"
                                    },

                                    technologies: {

                                        type: "array",

                                        items: {
                                            type: "string"
                                        }

                                    },

                                    bullets: {

                                        type: "array",

                                        items: {
                                            type: "string"
                                        }

                                    }

                                },

                                required: [
                                    "name",
                                    "description",
                                    "technologies",
                                    "bullets"
                                ]

                            }

                        },


                        certificates: {

                            type: "array",

                            items: {

                                type: "object",

                                properties: {

                                    name: {
                                        type: "string"
                                    },

                                    issuer: {
                                        type: "string"
                                    },

                                    date: {
                                        type: "string"
                                    }

                                },

                                required: [
                                    "name",
                                    "issuer",
                                    "date"
                                ]

                            }

                        },


                        languages: {

                            type: "array",

                            items: {
                                type: "string"
                            }

                        }

                    },

                    required: [

                        "personalInformation",

                        "professionalTitle",

                        "summary",

                        "education",

                        "careerInterests",

                        "technicalSkills",

                        "softSkills",

                        "experience",

                        "projects",

                        "certificates",

                        "languages"

                    ]

                },

                maxOutputTokens: 2500

            }

        });


        /* =================================================
           PARSE RESPONSE
        ================================================= */

        const raw =
            cleanJSON(
                response.text
            );


        let cv;


        try {

            cv = JSON.parse(raw);

        } catch (error) {

            console.error(
                "❌ Invalid CV JSON:"
            );

            console.error(raw);


            return res.status(502).json({

                success: false,

                error:
                    "Smart AI returned an invalid CV. Please try again."

            });

        }


        /* =================================================
           NORMALIZE
        ================================================= */

        cv.personalInformation =
            cv.personalInformation || {};


        cv.professionalTitle =
            cleanText(
                cv.professionalTitle,
                150
            );


        cv.summary =
            cleanText(
                cv.summary,
                1500
            );


        cv.education =
            Array.isArray(cv.education)
                ? cv.education.slice(0, 3)
                : [];


        cv.careerInterests =
            Array.isArray(cv.careerInterests)
                ? cv.careerInterests
                    .filter(Boolean)
                    .slice(0, 6)
                : [];


        cv.technicalSkills =
            Array.isArray(cv.technicalSkills)
                ? cv.technicalSkills
                    .filter(Boolean)
                    .slice(0, 12)
                : [];


        cv.softSkills =
            Array.isArray(cv.softSkills)
                ? cv.softSkills
                    .filter(Boolean)
                    .slice(0, 6)
                : [];


        cv.experience =
            Array.isArray(cv.experience)
                ? cv.experience
                    .slice(0, 3)
                    .map(item => ({

                        position:
                            cleanText(
                                item.position,
                                200
                            ),

                        organization:
                            cleanText(
                                item.organization,
                                200
                            ),

                        dates:
                            cleanText(
                                item.dates,
                                100
                            ),

                        bullets:
                            Array.isArray(
                                item.bullets
                            )
                                ? item.bullets
                                    .filter(Boolean)
                                    .slice(0, 4)
                                    .map(
                                        bullet =>
                                            cleanText(
                                                bullet,
                                                400
                                            )
                                    )
                                : []

                    }))
                : [];


        cv.projects =
            Array.isArray(cv.projects)
                ? cv.projects
                    .slice(0, 4)
                    .map(project => ({

                        name:
                            cleanText(
                                project.name,
                                200
                            ),

                        description:
                            cleanText(
                                project.description,
                                500
                            ),

                        technologies:
                            Array.isArray(
                                project.technologies
                            )
                                ? project.technologies
                                    .filter(Boolean)
                                    .slice(0, 8)
                                : [],

                        bullets:
                            Array.isArray(
                                project.bullets
                            )
                                ? project.bullets
                                    .filter(Boolean)
                                    .slice(0, 4)
                                    .map(
                                        bullet =>
                                            cleanText(
                                                bullet,
                                                400
                                            )
                                    )
                                : []

                    }))
                : [];


        cv.certificates =
            Array.isArray(cv.certificates)
                ? cv.certificates.slice(0, 8)
                : [];


        cv.languages =
            Array.isArray(cv.languages)
                ? cv.languages
                    .filter(Boolean)
                    .slice(0, 8)
                : [];


        /* =================================================
           SEND COMPLETE CV
        ================================================= */

        console.log("");
        console.log("✅ COMPLETE CV GENERATED");
        console.log(
            `Education: ${cv.education.length}`
        );
        console.log(
            `Career interests: ${cv.careerInterests.length}`
        );
        console.log(
            `Technical skills: ${cv.technicalSkills.length}`
        );
        console.log(
            `Soft skills: ${cv.softSkills.length}`
        );
        console.log(
            `Experience: ${cv.experience.length}`
        );
        console.log(
            `Projects: ${cv.projects.length}`
        );
        console.log(
            `Certificates: ${cv.certificates.length}`
        );
        console.log(
            `Languages: ${cv.languages.length}`
        );
        console.log("");


        res.json({

            success: true,

            cv: cv

        });


    } catch (error) {

        console.error(
            "❌ Smart AI Full CV Error:",
            error
        );


        res.status(
            getStatus(error) || 500
        ).json({

            success: false,

            error:
                formatError(error)

        });

    }

});


/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {

    console.log("");
    console.log("========================================");
    console.log(" InternGuide Smart AI Server");
    console.log("========================================");
    console.log(
        ` Server: http://localhost:${PORT}`
    );
    console.log(
        ` Models: ${MODELS.join(" → ")}`
    );
    console.log(
        " Thinking: LOW"
    );
    console.log(
        " Retry: 3 attempts"
    );
    console.log("========================================");
    console.log("");

});