// ============================================================
// InternGuide - Profile Page
// Supabase Profile Management
// ============================================================

let currentProfile = null;


// ============================================================
// Helper
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = getElement(id);

    if (!element) return;

    const translationKey = element.dataset.i18n;
    if (translationKey) {
        const englishFallback = translationKey
            .split(".")
            .reduce((branch, key) => branch?.[key], window.InternGuideI18n?.translations?.en);

        if (value === englishFallback || value === element.textContent.trim()) {
            value = window.InternGuideI18n?.t(translationKey) || value;
        }

        element.removeAttribute("data-i18n");
    }

    element.setAttribute("data-user-content", "");
    element.textContent = value;
}

function getInputValue(id) {
    const input = getElement(id);

    return input ? input.value.trim() : "";
}


// ============================================================
// Load Profile
// ============================================================

async function loadProfile() {

    try {

        // Check Supabase
        if (typeof supabaseClient === "undefined") {
            console.error("Supabase client not found.");
            showProfileMessage(
                "Supabase is not connected.",
                "error"
            );
            return;
        }

        // Get logged-in user
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {

            console.error(
                "User authentication error:",
                userError
            );

            window.location.href =
                "../auth/login.html";

            return;
        }

        // ----------------------------------------------------
        // Get profile
        // ----------------------------------------------------

        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {

            console.error(
                "Error loading profile:",
                profileError
            );

            showProfileMessage(
                "Unable to load your profile.",
                "error"
            );

            return;
        }


        // ----------------------------------------------------
        // Create profile if it doesn't exist
        // ----------------------------------------------------

        if (!profile) {

            const newProfile = {

                id: user.id,

                full_name:
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    "",

                phone: "",
                university: "",
                major: "",
                year_of_study: "",
                expected_graduation: "",
                location: "",

                career_roles: "",
                preferred_industry: "",
                preferred_location: "",
                internship_type: "",

                skills: "",
                languages: "",
                bio: "",

                avatar_url: "",

                created_at:
                    new Date().toISOString(),

                updated_at:
                    new Date().toISOString()
            };


            const {
                data: createdProfile,
                error: createError
            } = await supabaseClient
                .from("profiles")
                .insert(newProfile)
                .select()
                .single();


            if (createError) {

                console.error(
                    "Error creating profile:",
                    createError
                );

                showProfileMessage(
                    "Unable to create your profile.",
                    "error"
                );

                return;
            }


            currentProfile = createdProfile;

        } else {

            currentProfile = profile;
        }


        // ----------------------------------------------------
        // Safety check
        // ----------------------------------------------------

        if (!currentProfile) {

            console.error(
                "Profile is still null."
            );

            showProfileMessage(
                "Profile data is unavailable.",
                "error"
            );

            return;
        }


        // ----------------------------------------------------
        // Render profile
        // ----------------------------------------------------

        renderProfile(
            currentProfile,
            user
        );


        // ----------------------------------------------------
        // Load avatar
        // ----------------------------------------------------

        await displayAvatar(
    currentProfile.avatar_url
);

await updateNavbarAvatar(
    currentProfile.avatar_url,
    currentProfile
);


    } catch (error) {

        console.error(
            "Unexpected profile error:",
            error
        );

        showProfileMessage(
            "Something went wrong while loading your profile.",
            "error"
        );
    }
}


// ============================================================
// Render Profile
// ============================================================

function renderProfile(profile, user) {

    // --------------------------------------------------------
    // Basic information
    // --------------------------------------------------------

    setText(
        "profileName",
        profile.full_name || "Your Name"
    );

    setText(
        "profileMajor",
        profile.major || "Major not added"
    );

    setText(
        "profileUniversity",
        profile.university || "University not added"
    );

    setText(
        "fullName",
        profile.full_name || "Not added"
    );

    setText(
        "email",
        user?.email || "Not available"
    );

    setText(
        "phone",
        profile.phone || "Not added"
    );

    setText(
        "location",
        profile.location || "Not added"
    );


    // --------------------------------------------------------
    // Education
    // --------------------------------------------------------

    setText(
        "university",
        profile.university || "Not added"
    );

    setText(
        "major",
        profile.major || "Not added"
    );

    setText(
        "yearOfStudy",
        profile.year_of_study || "Not added"
    );

    setText(
        "graduationYear",
        profile.expected_graduation || "Not added"
    );


    // --------------------------------------------------------
    // Career Interests
    // --------------------------------------------------------

    setText(
        "careerRoles",
        profile.career_roles || "Not added"
    );

    setText(
        "preferredIndustry",
        profile.preferred_industry || "Not added"
    );

    setText(
        "preferredLocation",
        profile.preferred_location || "Not added"
    );

    setText(
        "internshipType",
        profile.internship_type || "Not added"
    );


    // --------------------------------------------------------
    // Bio
    // --------------------------------------------------------

    setText(
        "profileBio",
        profile.bio || "No bio added yet."
    );


    // --------------------------------------------------------
    // Skills
    // --------------------------------------------------------

    renderSkills(
        profile.skills
    );


    // --------------------------------------------------------
    // Languages
    // --------------------------------------------------------

    renderLanguages(
        profile.languages
    );


    // --------------------------------------------------------
    // Avatar
    // --------------------------------------------------------

    renderAvatarInitial(
        profile
    );


    // --------------------------------------------------------
    // Profile completion
    // --------------------------------------------------------

    updateProfileCompletion(
        profile
    );
}


// ============================================================
// Avatar Initial
// ============================================================

function renderAvatarInitial(profile) {

    const initial =
        getElement("avatarInitial") ||
        getElement("profileAvatarInitials");

    const avatar =
        getElement("profileAvatar") ||
        getElement("profileAvatarImage");

    if (!initial) {
        return;
    }

    const name =
        profile?.full_name || "U";

    initial.textContent =
        name.trim().charAt(0).toUpperCase() || "U";

    if (avatar && !profile?.avatar_url) {

        avatar.classList.add("hidden");

        initial.classList.remove(
            "hidden"
        );
    }
}


// ============================================================
// Display Avatar
// ============================================================

async function displayAvatar(filePath) {

    const image =
        getElement("profileAvatarImage") ||
        getElement("profileAvatar");

    const initial =
        getElement("profileAvatarInitials") ||
        getElement("avatarInitial");


    if (!image || !initial) {
        return;
    }


    // No image
    if (!filePath) {

        image.classList.add("hidden");

        initial.classList.remove(
            "hidden"
        );

        return;
    }


    // If stored value is already a complete URL
    if (
        typeof filePath === "string" &&
        filePath.startsWith("http")
    ) {

        image.src = filePath;

        image.classList.remove(
            "hidden"
        );

        initial.classList.add(
            "hidden"
        );

        return;
    }


    // Stored value is a Supabase Storage path
    try {

        const {
            data,
            error
        } = await supabaseClient.storage
            .from("avatars")
            .createSignedUrl(
                filePath,
                60 * 60
            );


        if (
            error ||
            !data?.signedUrl
        ) {

            console.error(
                "Avatar URL error:",
                error
            );

            image.classList.add(
                "hidden"
            );

            initial.classList.remove(
                "hidden"
            );

            return;
        }


        image.src =
            data.signedUrl;


        image.onload = () => {

            image.classList.remove(
                "hidden"
            );

            initial.classList.add(
                "hidden"
            );
        };


    } catch (error) {

        console.error(
            "Avatar display error:",
            error
        );
    }
}

// ============================================================
// Navbar Avatar
// ============================================================

async function updateNavbarAvatar(filePath, profile) {

    const navbarAvatar = document.getElementById("navbarAvatar");
    const navbarImage = document.getElementById("navbarAvatarImage");
    const navbarInitials = document.getElementById("navbarAvatarInitials");

    if (!navbarAvatar || !navbarImage || !navbarInitials) {
        return;
    }

    // --------------------------------------------------------
    // No profile picture
    // --------------------------------------------------------

    if (!filePath) {

        navbarImage.src = "";

        navbarImage.classList.add("hidden");

        navbarInitials.textContent =
            profile?.full_name?.trim()?.charAt(0)?.toUpperCase() || "IG";

        navbarInitials.classList.remove("hidden");

        return;
    }


    // --------------------------------------------------------
    // If stored value is already a complete URL
    // --------------------------------------------------------

    if (
        typeof filePath === "string" &&
        filePath.startsWith("http")
    ) {

        navbarImage.src = filePath;

        navbarImage.classList.remove("hidden");

        navbarInitials.classList.add("hidden");

        return;
    }


    // --------------------------------------------------------
    // Supabase Storage path
    // --------------------------------------------------------

    try {

        const {
            data,
            error
        } = await supabaseClient.storage
            .from("avatars")
            .createSignedUrl(
                filePath,
                60 * 60
            );


        if (
            error ||
            !data?.signedUrl
        ) {

            console.error(
                "Navbar avatar URL error:",
                error
            );

            return;
        }


        navbarImage.src =
            data.signedUrl;

        navbarImage.classList.remove(
            "hidden"
        );

        navbarInitials.classList.add(
            "hidden"
        );

    } catch (error) {

        console.error(
            "Navbar avatar display error:",
            error
        );
    }
}


// ============================================================
// Profile Picture Upload
// ============================================================

async function uploadProfilePicture(file) {

    try {

        if (!file) {
            return;
        }


        // ----------------------------------------------------
        // Validate file type
        // ----------------------------------------------------

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showProfileMessage(
                "Please choose a JPG, PNG, or WebP image.",
                "error"
            );

            return;
        }


        // ----------------------------------------------------
        // 2 MB maximum
        // ----------------------------------------------------

        if (
            file.size >
            2 * 1024 * 1024
        ) {

            showProfileMessage(
                "Image must be smaller than 2 MB.",
                "error"
            );

            return;
        }


        // ----------------------------------------------------
        // Get user
        // ----------------------------------------------------

        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();


        if (
            userError ||
            !user
        ) {

            showProfileMessage(
                "Please log in again.",
                "error"
            );

            return;
        }


        showProfileMessage(
            "Uploading profile picture...",
            "success"
        );


        // ----------------------------------------------------
        // File extension
        // ----------------------------------------------------

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        const filePath =
            `${user.id}/avatar.${extension}`;


        // ----------------------------------------------------
        // Find old avatar files
        // ----------------------------------------------------

        const {
            data: oldFiles
        } = await supabaseClient.storage
            .from("avatars")
            .list(user.id);


        if (
            oldFiles &&
            oldFiles.length > 0
        ) {

            const oldPaths =
                oldFiles.map(
                    file =>
                        `${user.id}/${file.name}`
                );


            await supabaseClient.storage
                .from("avatars")
                .remove(oldPaths);
        }


        // ----------------------------------------------------
        // Upload
        // ----------------------------------------------------

        const {
            error: uploadError
        } = await supabaseClient.storage
            .from("avatars")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: true,
                    contentType: file.type
                }
            );


        if (uploadError) {

            console.error(
                "Avatar upload error:",
                uploadError
            );

            showProfileMessage(
                "Unable to upload your profile picture.",
                "error"
            );

            return;
        }


        // ----------------------------------------------------
        // Save file path to profile
        // ----------------------------------------------------

        const {
            data: savedProfile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .upsert(
                {
                    id: user.id,
                    avatar_url: filePath,
                    updated_at:
                        new Date().toISOString()
                },
                {
                    onConflict: "id"
                }
            )
            .select()
            .single();


        if (profileError) {

            console.error(
                "Avatar profile update error:",
                profileError
            );

            showProfileMessage(
                "Photo uploaded, but profile could not be updated.",
                "error"
            );

            return;
        }


        currentProfile =
            savedProfile;


        // ----------------------------------------------------
        // Display image
        // ----------------------------------------------------

        await displayAvatar(
            filePath
        );


        showProfileMessage(
            "Profile picture updated successfully!",
            "success"
        );


    } catch (error) {

        console.error(
            "Unexpected avatar upload error:",
            error
        );

        showProfileMessage(
            "Something went wrong while uploading your picture.",
            "error"
        );
    }
}


// ============================================================
// Skills
// ============================================================

function renderSkills(skills) {

    const skillsList =
        getElement("skillsList");

    if (!skillsList) {
        return;
    }

    skillsList.innerHTML = "";


    if (
        !skills ||
        !skills.trim()
    ) {

        const empty =
            document.createElement("span");

        empty.className =
            "text-sm text-slate-500";

        empty.textContent =
            "No skills added yet.";

        skillsList.appendChild(
            empty
        );

        return;
    }


    const skillArray =
        skills
            .split(",")
            .map(
                skill =>
                    skill.trim()
            )
            .filter(
                skill =>
                    skill.length > 0
            );


    skillArray.forEach(
        skill => {

            const tag =
                document.createElement(
                    "span"
                );

            tag.className =
                "inline-flex items-center px-3 py-1.5 rounded-full bg-[#EDF2FF] text-[#3B5BDB] text-sm font-medium";

            tag.textContent =
                skill;

            skillsList.appendChild(
                tag
            );
        }
    );
}


// ============================================================
// Languages
// ============================================================

function renderLanguages(languages) {

    const languagesList =
        getElement("languagesList");

    if (!languagesList) {
        return;
    }

    languagesList.innerHTML = "";


    if (
        !languages ||
        !languages.trim()
    ) {

        const empty =
            document.createElement(
                "span"
            );

        empty.className =
            "text-sm text-slate-500";

        empty.textContent =
            "No languages added yet.";

        languagesList.appendChild(
            empty
        );

        return;
    }


    const languageArray =
        languages
            .split(",")
            .map(
                language =>
                    language.trim()
            )
            .filter(
                language =>
                    language.length > 0
            );


    languageArray.forEach(
        language => {

            const tag =
                document.createElement(
                    "span"
                );

            tag.className =
                "inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium";

            tag.textContent =
                language;

            languagesList.appendChild(
                tag
            );
        }
    );
}


// ============================================================
// Profile Completion
// ============================================================

function updateProfileCompletion(profile) {

    const fields = [

        profile.full_name,

        profile.phone,

        profile.university,

        profile.major,

        profile.year_of_study,

        profile.expected_graduation,

        profile.location,

        profile.career_roles,

        profile.preferred_industry,

        profile.preferred_location,

        profile.internship_type,

        profile.skills,

        profile.languages,

        profile.bio
    ];


    const completed =
        fields.filter(
            field =>
                field !== null &&
                field !== undefined &&
                String(field).trim() !== ""
        ).length;


    const total =
        fields.length;


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    setText(
        "completionText",
        `${percentage}%`
    );


    const progressBar =
        getElement("completionBar");


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;
    }
}


// ============================================================
// Open Edit Profile Modal
// ============================================================

function editPersonal() {

    if (!currentProfile) {

        console.warn(
            "Profile has not loaded yet."
        );

        showProfileMessage(
            "Please wait for your profile to finish loading.",
            "error"
        );

        return;
    }


    // Basic
    setInputValue(
        "editFullName",
        currentProfile.full_name
    );

    setInputValue(
        "editPhone",
        currentProfile.phone
    );

    setInputValue(
        "editUniversity",
        currentProfile.university
    );

    setInputValue(
        "editMajor",
        currentProfile.major
    );

    setInputValue(
        "editYear",
        currentProfile.year_of_study
    );

    setInputValue(
        "editGraduation",
        currentProfile.expected_graduation
    );

    setInputValue(
        "editLocation",
        currentProfile.location
    );


    // Career
    setInputValue(
        "editCareerRoles",
        currentProfile.career_roles
    );

    setInputValue(
        "editIndustry",
        currentProfile.preferred_industry
    );

    setInputValue(
        "editPreferredLocation",
        currentProfile.preferred_location
    );

    setInputValue(
        "editInternshipType",
        currentProfile.internship_type
    );


    // Skills
    setInputValue(
        "editSkills",
        currentProfile.skills
    );


    // Languages
    setInputValue(
        "editLanguages",
        currentProfile.languages
    );


    // Bio
    setInputValue(
        "editBio",
        currentProfile.bio
    );


    // Open modal
    const modal =
        getElement("editProfileModal");


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

        document.body.classList.add(
            "overflow-hidden"
        );
    }
}


// ============================================================
// Input Helper
// ============================================================

function setInputValue(
    id,
    value
) {

    const input =
        getElement(id);

    if (input) {
        input.value =
            value || "";
    }
}


// ============================================================
// Close Edit Modal
// ============================================================

function closeEditModal() {

    const modal =
        getElement("editProfileModal");


    if (modal) {

        modal.classList.add(
            "hidden"
        );

        document.body.classList.remove(
            "overflow-hidden"
        );
    }
}


// Keep compatibility with existing HTML
function closeEditProfile() {
    closeEditModal();
}


// ============================================================
// Save Profile
// ============================================================

async function saveProfile(event) {

    if (event) {
        event.preventDefault();
    }


    try {

        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();


        if (
            userError ||
            !user
        ) {

            window.location.href =
                "../auth/login.html";

            return;
        }


        // ----------------------------------------------------
        // Get form values
        // ----------------------------------------------------

        const updates = {

            id: user.id,

            full_name:
                getInputValue(
                    "editFullName"
                ),

            phone:
                getInputValue(
                    "editPhone"
                ),

            university:
                getInputValue(
                    "editUniversity"
                ),

            major:
                getInputValue(
                    "editMajor"
                ),

            year_of_study:
                getInputValue(
                    "editYear"
                ),

            expected_graduation:
                getInputValue(
                    "editGraduation"
                ),

            location:
                getInputValue(
                    "editLocation"
                ),

            career_roles:
                getInputValue(
                    "editCareerRoles"
                ),

            preferred_industry:
                getInputValue(
                    "editIndustry"
                ),

            preferred_location:
                getInputValue(
                    "editPreferredLocation"
                ),

            internship_type:
                getInputValue(
                    "editInternshipType"
                ),

            skills:
                getInputValue(
                    "editSkills"
                ),

            languages:
                getInputValue(
                    "editLanguages"
                ),

            bio:
                getInputValue(
                    "editBio"
                ),

            avatar_url:
                currentProfile?.avatar_url || "",

            updated_at:
                new Date().toISOString()
        };


        // ----------------------------------------------------
        // Save to Supabase
        // ----------------------------------------------------

        const {
            data: savedProfile,
            error
        } = await supabaseClient
            .from("profiles")
            .upsert(
                updates,
                {
                    onConflict: "id"
                }
            )
            .select()
            .single();


        if (error) {

            console.error(
                "Profile update error:",
                error
            );

            showProfileMessage(
                "Unable to save your profile.",
                "error"
            );

            return;
        }


        // ----------------------------------------------------
        // Update current profile
        // ----------------------------------------------------

        currentProfile =
            savedProfile;


        // ----------------------------------------------------
        // Update Auth metadata
        // ----------------------------------------------------

        await supabaseClient.auth.updateUser({
            data: {
                full_name:
                    savedProfile.full_name || ""
            }
        });


        // ----------------------------------------------------
        // Render
        // ----------------------------------------------------

        const {
            data: { user: updatedUser }
        } = await supabaseClient.auth.getUser();


        renderProfile(
            savedProfile,
            updatedUser
        );


        // ----------------------------------------------------
        // Close modal
        // ----------------------------------------------------

        closeEditModal();


        // ----------------------------------------------------
        // Success
        // ----------------------------------------------------

        showProfileMessage(
            "Profile updated successfully!",
            "success"
        );


    } catch (error) {

        console.error(
            "Unexpected save error:",
            error
        );

        showProfileMessage(
            "Something went wrong while saving.",
            "error"
        );
    }
}


// ============================================================
// Message
// ============================================================

function showProfileMessage(
    message,
    type = "success"
) {

    const container =
        getElement("profileMessage");


    if (!container) {

        alert(message);

        return;
    }


    container.textContent =
        message;


    container.className =
        "fixed top-5 right-5 z-[100] px-5 py-3 rounded-lg shadow-lg text-sm font-medium";


    if (type === "error") {

        container.classList.add(
            "bg-red-50",
            "text-red-700",
            "border",
            "border-red-200"
        );

    } else {

        container.classList.add(
            "bg-green-50",
            "text-green-700",
            "border",
            "border-green-200"
        );
    }


    container.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {
            container.classList.add(
                "hidden"
            );
        },
        3500
    );
}


// ============================================================
// Logout
// ============================================================

async function logout() {
    if (window.logoutCurrentUser) {
        await window.logoutCurrentUser();
        return;
    }

    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
        }
    } catch (error) {
        console.error("Unexpected logout error:", error);
    } finally {
        clearSupabaseSessionStorage?.();
        window.location.replace("../auth/login.html");
    }
}


// ============================================================
// Profile Picture Input
// ============================================================

function setupAvatarUpload() {

    const input =
        getElement("avatarInput");


    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        async (event) => {

            const file =
                event.target.files?.[0];


            if (!file) {
                return;
            }


            await uploadProfilePicture(
                file
            );


            // Allow selecting same file again
            input.value = "";
        }
    );
}


// ============================================================
// Event Listeners
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // ----------------------------------------------------
        // Edit form
        // ----------------------------------------------------

        const form =
            getElement(
                "editProfileForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                saveProfile
            );
        }


        // ----------------------------------------------------
        // Logout
        // ----------------------------------------------------

        const logoutBtn =
            getElement(
                "logoutBtn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                logout
            );
        }


        // ----------------------------------------------------
        // Close modal
        // ----------------------------------------------------

        const closeBtn =
            getElement(
                "closeEditModal"
            );


        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                closeEditModal
            );
        }


        // ----------------------------------------------------
        // Cancel
        // ----------------------------------------------------

        const cancelBtn =
            getElement(
                "cancelEdit"
            );


        if (cancelBtn) {

            cancelBtn.addEventListener(
                "click",
                closeEditModal
            );
        }


        // ----------------------------------------------------
        // Click outside modal
        // ----------------------------------------------------

        const modal =
            getElement(
                "editProfileModal"
            );


        if (modal) {

            modal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target === modal
                    ) {

                        closeEditModal();
                    }
                }
            );
        }

        // ============================================================
// Navbar Avatar
// ============================================================

async function updateNavbarAvatar(filePath, profile) {
    const navbarAvatar = document.getElementById("navbarAvatar");
    const navbarImage = document.getElementById("navbarAvatarImage");
    const navbarInitials = document.getElementById("navbarAvatarInitials");

    if (!navbarAvatar || !navbarImage || !navbarInitials) {
        return;
    }

    // No profile picture → show initials
    if (!filePath) {
        navbarImage.src = "";
        navbarImage.classList.add("hidden");
        navbarInitials.textContent =
            profile?.full_name?.trim()?.charAt(0)?.toUpperCase() || "IG";
        navbarInitials.classList.remove("hidden");
        return;
    }

    // Direct URL
    if (filePath.startsWith("http")) {
        navbarImage.src = filePath;
        navbarImage.classList.remove("hidden");
        navbarInitials.classList.add("hidden");
        return;
    }

    // Supabase Storage path
    try {
        const { data, error } = await supabaseClient.storage
            .from("avatars")
            .createSignedUrl(filePath, 60 * 60);

        if (error || !data?.signedUrl) {
            console.error("Navbar avatar error:", error);
            return;
        }

        navbarImage.src = data.signedUrl;
        navbarImage.classList.remove("hidden");
        navbarInitials.classList.add("hidden");

    } catch (error) {
        console.error("Navbar avatar display error:", error);
    }
}


        // ----------------------------------------------------
        // Profile picture
        // ----------------------------------------------------

        setupAvatarUpload();


        // ----------------------------------------------------
        // Load profile
        // ----------------------------------------------------

        loadProfile();
    }
);