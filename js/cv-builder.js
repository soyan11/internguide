/* ============================================================
   InternGuide - Smart AI CV Assistant
   Gemini API Backend
   ============================================================ */

const SMART_AI_URL =
  "https://internguide-k9zc.onrender.com/api/cv/generate";


/* ============================================================
   HELPERS
   ============================================================ */

function getAIKeywords() {

  const element = document.getElementById("aiKeywords");

  return element
    ? element.value.trim()
    : "";
}


function getAIElement(id) {
  return document.getElementById(id);
}


function getAIInput(id) {

  const element = getAIElement(id);

  return element
    ? element.value.trim()
    : "";
}


function setAIInput(id, value) {

  const element = getAIElement(id);

  if (element) {
    element.value = value || "";
  }
}


function showSmartAIMessage(message) {

  const element =
    getAIElement("aiMessage");

  if (element) {
    element.textContent = message;
  }
}


function showSmartAIResult(text) {

  const box =
    getAIElement("aiResultBox");

  const result =
    getAIElement("aiResult");

  if (!box || !result) return;

  result.textContent = text || "";

  box.classList.remove("hidden");
}


function setSmartAIButtonsDisabled(disabled) {

  document
    .querySelectorAll(".ai-button")
    .forEach(button => {

      button.disabled = disabled;

      button.classList.toggle(
        "opacity-60",
        disabled
      );

      button.classList.toggle(
        "cursor-not-allowed",
        disabled
      );

    });
}


/* ============================================================
   CALL GEMINI THROUGH YOUR BACKEND
   ============================================================ */

async function generateWithSmartAI(type) {

  const keywords =
    getAIKeywords();


  if (!keywords) {

    showSmartAIMessage(
      "Please enter a few keywords or notes first."
    );

    getAIElement("aiKeywords")?.focus();

    return null;
  }


  setSmartAIButtonsDisabled(true);

  showSmartAIMessage(
    "✨ Smart AI is writing your CV..."
  );


  try {

    const response = await fetch(
      SMART_AI_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          type: type,

          keywords: keywords,

          role:
            getAIInput("cvTitle"),

          education:
            getAIInput("cvEducation"),

          skills:
            getAIInput("cvSkills")

        })
      }
    );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        `Smart AI request failed (${response.status})`
      );

    }


    if (!data.text) {

      throw new Error(
        "Smart AI returned an empty result."
      );

    }


    showSmartAIResult(
      data.text
    );


    showSmartAIMessage(
      "✨ Smart AI generated the content. Please review it before using it on your CV."
    );


    return data.text;


  } catch (error) {

    console.error(
      "Smart AI error:",
      error
    );


    showSmartAIMessage(
      "Smart AI could not generate the content. Make sure your Gemini server is running."
    );


    showSmartAIResult(
      "Error: " + error.message
    );


    return null;


  } finally {

    setSmartAIButtonsDisabled(false);

  }

}


/* ============================================================
   WRITE SUMMARY
   ============================================================ */

async function aiWriteSummaryFromKeywords() {

  const result =
    await generateWithSmartAI(
      "professional summary"
    );


  if (!result) return;


  setAIInput(
    "cvSummary",
    result
  );


  if (typeof updatePreview === "function") {
    updatePreview();
  }


  showSmartAIMessage(
    "✨ Professional summary generated. Review it before using it."
  );

}


/* ============================================================
   WRITE EXPERIENCE
   ============================================================ */

async function aiWriteExperienceFromKeywords() {

  const result =
    await generateWithSmartAI(
      "professional experience"
    );


  if (!result) return;


  setAIInput(
    "cvExperience",
    result
  );


  if (typeof updatePreview === "function") {
    updatePreview();
  }


  showSmartAIMessage(
    "✨ Experience section generated. Review it before using it."
  );

}


/* ============================================================
   SUGGEST SKILLS
   ============================================================ */

async function aiSuggestSkills() {

  const result =
    await generateWithSmartAI(
      "relevant CV skills as a concise comma-separated list"
    );


  if (!result) return;


  let skills =
    result
      .replace(/^skills\s*:/i, "")
      .replace(/[•\n]+/g, ",")
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean)
      .slice(0, 12)
      .join(", ");


  setAIInput(
    "cvSkills",
    skills
  );


  showSmartAIResult(
    skills
  );


  if (typeof updatePreview === "function") {
    updatePreview();
  }


  showSmartAIMessage(
    "✨ Skills suggested by Smart AI. Keep only skills you genuinely have."
  );

}


/* ============================================================
   BUILD MY CV
   ============================================================ */

async function aiBuildFromKeywords() {

  const keywords =
    getAIKeywords();


  if (!keywords) {

    showSmartAIMessage(
      "Start by entering a few keywords about your project, experience, or skills."
    );

    getAIElement("aiKeywords")?.focus();

    return;

  }


  setSmartAIButtonsDisabled(true);

  showSmartAIMessage(
    "✨ Smart AI is building your CV..."
  );


  try {

    /*
     * We make 3 requests:
     *
     * 1. Summary
     * 2. Experience
     * 3. Skills
     */

    const summary =
      await requestSmartAI(
        "professional summary"
      );


    const experience =
      await requestSmartAI(
        "professional experience"
      );


    const skills =
      await requestSmartAI(
        "relevant CV skills as a concise comma-separated list"
      );


    /* -----------------------------
       Insert Summary
    ----------------------------- */

    if (summary) {

      setAIInput(
        "cvSummary",
        summary
      );

    }


    /* -----------------------------
       Insert Experience
    ----------------------------- */

    if (experience) {

      setAIInput(
        "cvExperience",
        experience
      );

    }


    /* -----------------------------
       Insert Skills
    ----------------------------- */

    if (skills) {

      const cleanSkills =
        skills
          .replace(/^skills\s*:/i, "")
          .replace(/[•\n]+/g, ",")
          .split(",")
          .map(skill => skill.trim())
          .filter(Boolean)
          .slice(0, 12)
          .join(", ");


      setAIInput(
        "cvSkills",
        cleanSkills
      );

    }


    /* -----------------------------
       Keep profile languages
    ----------------------------- */

    if (
      !getAIInput("cvLanguages") &&
      typeof currentProfile !== "undefined" &&
      currentProfile?.languages
    ) {

      setAIInput(
        "cvLanguages",
        currentProfile.languages
      );

    }


    if (typeof updatePreview === "function") {
      updatePreview();
    }


    /* -----------------------------
       Show result
    ----------------------------- */

    showSmartAIResult(

      `SUMMARY\n\n${summary || "Not generated"}\n\n` +

      `EXPERIENCE\n\n${experience || "Not generated"}\n\n` +

      `SKILLS\n\n${skills || "Not generated"}`

    );


    showSmartAIMessage(
      "✨ Smart AI built your main CV sections. Please review everything before downloading."
    );


  } catch (error) {

    console.error(
      "Smart AI Build Error:",
      error
    );


    showSmartAIMessage(
      "Smart AI could not complete your CV. Please try again."
    );


  } finally {

    setSmartAIButtonsDisabled(false);

  }

}


/* ============================================================
   REQUEST SMART AI
   ============================================================ */

async function requestSmartAI(type) {

  const keywords =
    getAIKeywords();


  const response =
    await fetch(
      SMART_AI_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          type: type,

          keywords: keywords,

          role:
            getAIInput("cvTitle"),

          education:
            getAIInput("cvEducation"),

          skills:
            getAIInput("cvSkills")

        })
      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data.error ||
      `Smart AI request failed (${response.status})`
    );

  }


  return data.text || "";

}


/* ============================================================
   COPY AI RESULT
   ============================================================ */

async function copyAIResult() {

  const result =
    getAIElement("aiResult");


  const text =
    result?.textContent || "";


  if (!text) return;


  try {

    await navigator.clipboard.writeText(
      text
    );


    showSmartAIMessage(
      "Copied Smart AI result to your clipboard."
    );


  } catch (error) {

    showSmartAIMessage(
      "Please select and copy the generated content manually."
    );

  }

}


/* ============================================================
   OLD FUNCTION COMPATIBILITY
   ============================================================ */

function aiGenerateSummary() {

  aiWriteSummaryFromKeywords();

}


function aiGenerateExperience() {

  aiWriteExperienceFromKeywords();

}


function aiGenerateAll() {

  aiBuildFromKeywords();

}