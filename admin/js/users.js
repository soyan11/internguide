document.addEventListener("DOMContentLoaded", async () => {

    if (window.lucide) {
        lucide.createIcons();
    }

    const adminSession = await requireAdmin();

    if (!adminSession) {
        return;
    }

    let users = [];

    const tableBody =
        document.getElementById("usersTableBody");

    const searchInput =
        document.getElementById("userSearch");

    const roleFilter =
        document.getElementById("roleFilter");

    const sortFilter =
        document.getElementById("sortFilter");


    /* =========================================
       LOAD USERS
    ========================================= */

    async function loadUsers() {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="loading-users">
                        Loading users...
                    </div>
                </td>
            </tr>
        `;


        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .select(`
                id,
                full_name,
                role,
                phone,
                university,
                major,
                year_of_study,
                location,
                career_roles,
                preferred_industry,
                internship_type,
                skills,
                languages,
                bio,
                avatar_url,
                created_at
            `)
            .order("created_at", {
                ascending: false
            });


        if (error) {

            console.error(
                "Could not load users:",
                error
            );

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-users">
                            Unable to load users.
                        </div>
                    </td>
                </tr>
            `;

            return;
        }


        users = data || [];

        // Resolve profile photos once so the table and profile modal can
        // both display the same image. avatar_url may be either a full URL
        // or a path inside the Supabase "avatars" storage bucket.
        await Promise.all(users.map(async user => {
            user._avatarUrl = await resolveAvatarUrl(user.avatar_url, user.id);
        }));

        updateStatistics();

        renderUsers();

    }


    /* =========================================
       STATISTICS
    ========================================= */

    function updateStatistics() {

        const total =
            users.length;

        const students =
            users.filter(
                user => user.role === "student"
            ).length;

        const admins =
            users.filter(
                user => user.role === "admin"
            ).length;


        document.getElementById(
            "totalUsers"
        ).textContent =
            total.toLocaleString();


        document.getElementById(
            "studentCount"
        ).textContent =
            students.toLocaleString();


        document.getElementById(
            "adminCount"
        ).textContent =
            admins.toLocaleString();

    }


    /* =========================================
       RENDER USERS
    ========================================= */

    function renderUsers() {

        let filtered =
            [...users];


        /* Search */

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        if (search) {

            filtered =
                filtered.filter(user => {

                    const name =
                        user.full_name ||
                        "";

                    const university =
                        user.university ||
                        "";

                    const major =
                        user.major ||
                        "";

                    return (
                        name.toLowerCase().includes(search) ||
                        university.toLowerCase().includes(search) ||
                        major.toLowerCase().includes(search)
                    );

                });

        }


        /* Role */

        const role =
            roleFilter.value;


        if (role !== "all") {

            filtered =
                filtered.filter(
                    user => user.role === role
                );

        }


        /* Sort */

        if (sortFilter.value === "newest") {

            filtered.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );

        }


        if (sortFilter.value === "oldest") {

            filtered.sort(
                (a, b) =>
                    new Date(a.created_at) -
                    new Date(b.created_at)
            );

        }


        if (sortFilter.value === "name") {

            filtered.sort(
                (a, b) =>
                    (a.full_name || "")
                        .localeCompare(
                            b.full_name || ""
                        )
            );

        }


        document.getElementById(
            "displayedCount"
        ).textContent =
            filtered.length.toLocaleString();


        if (!filtered.length) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">

                        <div class="empty-users">
                            No users found.
                        </div>

                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML =
            filtered.map(user => {

                const name =
                    user.full_name ||
                    "Unnamed User";

                const initial =
                    name
                        .charAt(0)
                        .toUpperCase();

                const role =
                    user.role === "admin"
                        ? "Admin"
                        : "Student";

                const roleClass =
                    user.role === "admin"
                        ? "admin"
                        : "student";

                const university =
                    user.university ||
                    "—";

                const major =
                    user.major ||
                    "—";

                const joined =
                    formatDate(
                        user.created_at
                    );


                return `
                    <tr>

                        <td>

                            <div class="user-cell">

                                <div class="table-avatar${user._avatarUrl ? " has-image" : ""}" aria-hidden="true">
                                    ${user._avatarUrl
                                        ? `<img src="${escapeHtml(user._avatarUrl)}" alt="" loading="eager" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.parentElement.classList.remove('has-image'); this.parentElement.textContent='${escapeHtml(initial)}';">`
                                        : escapeHtml(initial)}
                                </div>

                                <div>
                                    <div class="user-name">
                                        ${escapeHtml(name)}
                                    </div>
                                </div>

                            </div>

                        </td>


                        <td>

                            <span class="user-role ${roleClass}">
                                ${role}
                            </span>

                        </td>


                        <td>
                            ${escapeHtml(university)}
                        </td>


                        <td>
                            ${escapeHtml(major)}
                        </td>


                        <td>
                            ${joined}
                        </td>


                        <td>

                            <span class="status-active">
                                Active
                            </span>

                        </td>


                        <td>

                            <button
                                class="action-btn"
                                title="View user"
                                data-user-id="${user.id}"
                            >

                                <i data-lucide="eye"></i>

                            </button>

                        </td>

                    </tr>
                `;

            }).join("");


        if (window.lucide) {
            lucide.createIcons();
        }


        document
            .querySelectorAll(".action-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const userId =
                            button.dataset.userId;

                        viewUser(userId);

                    }
                );

            });

    }


    /* =========================================
       FILTER EVENTS
    ========================================= */

    searchInput.addEventListener(
        "input",
        renderUsers
    );

    roleFilter.addEventListener(
        "change",
        renderUsers
    );

    sortFilter.addEventListener(
        "change",
        renderUsers
    );


    /* =========================================
       VIEW USER
    ========================================= */

    async function viewUser(userId) {

        const user =
            users.find(
                item => item.id === userId
            );

        if (!user) return;


        const name = user.full_name || "Unnamed User";
        const role = user.role === "admin" ? "Administrator" : "Student";
        const setValue = (id, value, fallback = "Not provided") => {
            const element = document.getElementById(id);
            if (element) element.textContent = value || fallback;
        };

        setValue("userProfileName", name);
        setValue("userProfileRole", role);
        setValue("userProfileEmail", "Managed in Auth");
        setValue("userProfilePhone", user.phone);
        setValue("userProfileUniversity", user.university);
        setValue("userProfileMajor", user.major);
        setValue("userProfileYear", user.year_of_study);
        setValue("userProfileLocation", user.location);
        setValue("userProfileRoles", user.career_roles);
        setValue("userProfileIndustry", user.preferred_industry);
        setValue("userProfileInternshipType", user.internship_type);
        setValue("userProfileSkills", user.skills);
        setValue("userProfileLanguages", user.languages);
        setValue("userProfileBio", user.bio, "No bio provided.");

        const avatar = document.getElementById("userProfileAvatar");
        if (avatar) {
            avatar.textContent = name.charAt(0).toUpperCase();
            avatar.style.backgroundImage = "";
            avatar.classList.remove("has-image");

            const avatarUrl = user._avatarUrl || await resolveAvatarUrl(user.avatar_url, user.id);
            if (avatarUrl) {
                avatar.style.backgroundImage = `url("${avatarUrl}")`;
                avatar.classList.add("has-image");
            }
        }

        const modal = document.getElementById("userProfileModal");
        modal?.classList.add("show");
        document.body.classList.add("overflow-hidden");
    }

    function closeUserProfile() {
        document.getElementById("userProfileModal")?.classList.remove("show");
        document.body.classList.remove("overflow-hidden");
    }

    document.getElementById("closeUserProfile")?.addEventListener("click", closeUserProfile);
    document.getElementById("closeUserProfileFooter")?.addEventListener("click", closeUserProfile);
    document.getElementById("userProfileModal")?.addEventListener("click", event => {
        if (event.target === event.currentTarget) closeUserProfile();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeUserProfile();
    });


    /* =========================================
       MOBILE MENU
    ========================================= */

    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    mobileMenuBtn?.addEventListener(
        "click",
        () => {

            sidebar?.classList.toggle(
                "mobile-open"
            );

        }
    );


    /* =========================================
       LOGOUT
    ========================================= */

    document
        .getElementById("logoutBtn")
        ?.addEventListener(
            "click",
            async () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );

                if (!confirmed) return;


                const { error } =
                    await supabaseClient
                        .auth
                        .signOut();


                if (error) {

                    console.error(error);

                    alert(
                        "Unable to logout."
                    );

                    return;
                }


                window.location.href =
                    "../pages/auth/login.html";

            }
        );


    /* =========================================
       HELPERS
    ========================================= */

    async function resolveAvatarUrl(avatarPath, userId = "") {
        const value = typeof avatarPath === "string" ? avatarPath.trim() : "";
        const id = String(userId || "").trim();

        // Some accounts may have the image stored in another profile-related
        // field/path format. Try the value first, then common per-user paths.
        const buckets = ["avatars", "profile-images", "profile-pictures", "user-avatars"];
        const candidates = [];
        const addCandidate = (candidate) => {
            if (candidate && !candidates.includes(candidate)) candidates.push(candidate);
        };

        if (value) {
            if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
                return value;
            }

            const normalized = value.replace(/^\/+/, "");
            addCandidate(normalized);
            addCandidate(normalized.replace(/^public\//i, ""));
            addCandidate(normalized.replace(/^avatars\//i, ""));
            addCandidate(normalized.replace(/^profile-images\//i, ""));
            addCandidate(normalized.replace(/^profile-pictures\//i, ""));

            // If only a filename was saved, the upload may have placed it in
            // the user's folder. Try those common layouts as well.
            if (id && !normalized.includes("/")) {
                addCandidate(`${id}/${normalized}`);
                addCandidate(`profiles/${id}/${normalized}`);
                addCandidate(`users/${id}/${normalized}`);
            }

            try {
                const decoded = decodeURIComponent(normalized);
                addCandidate(decoded);
                addCandidate(decoded.replace(/^avatars\//i, ""));
                if (id && !decoded.includes("/")) addCandidate(`${id}/${decoded}`);
            } catch (_) {}
        }

        // If avatar_url is empty, look for an image in the user's folder.
        // This supports profiles created by older versions of the app that
        // stored the photo in Storage but did not persist avatar_url.
        if (!value && id) {
            for (const bucket of buckets) {
                for (const folder of [id, `profiles/${id}`, `users/${id}`]) {
                    try {
                        const { data, error } = await supabaseClient.storage
                            .from(bucket)
                            .list(folder, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
                        if (error || !Array.isArray(data)) continue;

                        const image = data.find(file =>
                            file?.name && /\.(png|jpe?g|gif|webp|avif|heic)$/i.test(file.name)
                        );
                        if (image?.name) {
                            addCandidate(`${folder}/${image.name}`);
                        }
                    } catch (_) {}
                }
            }
        }

        // First try signed URLs. This supports private buckets when the admin
        // has Storage read/list permission.
        for (const bucket of buckets) {
            for (const path of candidates) {
                try {
                    const { data, error } = await supabaseClient.storage
                        .from(bucket)
                        .createSignedUrl(path, 60 * 60 * 24);
                    if (!error && data?.signedUrl) return data.signedUrl;
                } catch (_) {}
            }
        }

        // Then try public URLs for public Storage buckets.
        for (const bucket of buckets) {
            for (const path of candidates) {
                try {
                    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
                    if (data?.publicUrl) return data.publicUrl;
                } catch (_) {}
            }
        }

        if (value) console.warn("Could not resolve avatar image:", value, "for user:", id);
        return "";
    }

    function formatDate(dateString) {

        if (!dateString) {
            return "—";
        }

        return new Date(
            dateString
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================
       START
    ========================================= */

    await loadUsers();

});