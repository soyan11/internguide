document.addEventListener("DOMContentLoaded", () => {
    initNavigationAuth();
});

async function initNavigationAuth() {
    try {
        await waitForSupabase();

        const { data, error } =
            await window.supabaseClient.auth.getSession();

        if (error) {
            console.error("Could not get auth session:", error);
            return;
        }

        updateAuthNavigation(data?.session || null);

        window.supabaseClient.auth.onAuthStateChange((_event, session) => {
            updateAuthNavigation(session);
        });
    } catch (error) {
        console.error("Navigation authentication error:", error);
    }
}

function waitForSupabase(timeout = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
            if (window.supabaseClient) {
                resolve();
                return;
            }

            if (Date.now() - start >= timeout) {
                reject(new Error("Supabase client is not available."));
                return;
            }

            setTimeout(check, 100);
        };

        check();
    });
}

async function updateAuthNavigation(session) {
    updateDesktopAuthButtons(session);
    updateMobileAuthButtons(session);

    if (session?.user) {
        loadNavigationProfile(session.user.id, session.user);
    }
}

function updateDesktopAuthButtons(session) {
    document.querySelectorAll(".header-actions").forEach(container => {
        if (session) {
            const fullName = session.user.user_metadata?.full_name ||
                session.user.email ||
                "InternGuide User";

            container.innerHTML = `
                <a href="${getPath("profile")}" class="text-gray-600 hover:text-gray-800">
                    My Profile
                </a>
                <a href="${getPath("profile")}" class="w-11 h-11 rounded-full bg-[#EDF2FF] flex items-center justify-center overflow-hidden">
                    <span data-nav-avatar-initials class="text-[#3B5BDB] font-semibold">
                        ${getInitials(fullName)}
                    </span>
                    <img data-nav-avatar-image src="" alt="Profile" class="hidden w-full h-full object-cover">
                </a>
                <button type="button" data-auth-logout
                    class="border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-5 py-3">
                    Logout
                </button>
            `;

        } else {
            container.innerHTML = `
                <a href="${getPath("login")}" class="btn btn-login bg-white border rounded-xl p-3 px-4 hover:bg-gray-50">
                    Log In
                </a>
                <a href="${getPath("signup")}" class="btn btn-primary bg-blue-600 text-white p-3 px-4 rounded-xl hover:bg-blue-700">
                    Sign Up
                </a>
            `;
        }
    });

    setupLogoutButtons();
}

async function loadNavigationProfile(userId, user) {
    const { data, error } = await window.supabaseClient
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();

    if (error) {
        console.warn("Navigation profile error:", error);
        return;
    }

    const fullName = data?.full_name ||
        user.user_metadata?.full_name ||
        user.email ||
        "InternGuide User";

    document.querySelectorAll("[data-nav-avatar-initials]").forEach(initials => {
        initials.textContent = getInitials(fullName);
    });

    if (data?.avatar_url) {
        document.querySelectorAll(".header-actions").forEach(container => {
            loadNavigationAvatar(container, data.avatar_url);
        });
    }
}

function updateMobileAuthButtons(session) {
    document.querySelectorAll("#mobile-menu").forEach(menu => {
        menu.querySelector("[data-mobile-auth]")?.remove();

        const placeholder = Array.from(menu.children).find(child =>
            child.tagName === "A" && /Register or Login/i.test(child.textContent)
        );
        placeholder?.remove();

        const authContainer = document.createElement("div");
        authContainer.dataset.mobileAuth = "true";
        authContainer.className = "flex flex-col border-t border-gray-200 mt-1 pt-1";

        authContainer.innerHTML = session
            ? `
                <a href="${getPath("profile")}" class="flex h-11 items-center justify-center gap-2 border-b border-gray-200 text-sm font-semibold text-[#3f5ddd] hover:bg-gray-100">
                    My Profile <span class="text-lg">→</span>
                </a>
                <button type="button" data-auth-logout class="flex h-11 w-full items-center justify-center gap-2 rounded-b-xl bg-[#3f5ddd] text-sm font-semibold text-white hover:bg-[#304fc8]">
                    Logout <span class="text-lg">→</span>
                </button>
            `
            : `
                <a href="${getPath("login")}" class="flex h-11 items-center justify-center gap-2 border-b border-gray-200 text-sm font-semibold text-[#3f5ddd] hover:bg-gray-100">
                    Log In <span class="text-lg">→</span>
                </a>
                <a href="${getPath("signup")}" class="flex h-11 items-center justify-center gap-2 rounded-b-xl bg-[#3f5ddd] text-sm font-semibold text-white hover:bg-[#304fc8]">
                    Sign Up <span class="text-lg">→</span>
                </a>
            `;

        menu.appendChild(authContainer);
    });

    setupLogoutButtons();
}

function loadNavigationAvatar(container, filePath) {
    if (!filePath) return;

    if (filePath.startsWith("http")) {
        setNavigationAvatar(container, filePath);
        return;
    }

    window.supabaseClient.storage
        .from("avatars")
        .createSignedUrl(filePath, 3600)
        .then(({ data, error }) => {
            if (!error && data?.signedUrl) {
                setNavigationAvatar(container, data.signedUrl);
            }
        });
}

function setNavigationAvatar(container, src) {
    const image = container.querySelector("[data-nav-avatar-image]");
    const initials = container.querySelector("[data-nav-avatar-initials]");

    if (!image || !initials) return;

    image.src = src;
    image.classList.remove("hidden");
    initials.classList.add("hidden");
}

function setupLogoutButtons() {
    document.querySelectorAll("[data-auth-logout]").forEach(button => {
        if (button.dataset.logoutReady === "true") return;

        button.dataset.logoutReady = "true";
        button.addEventListener("click", async () => {
            button.disabled = true;
            await window.logoutCurrentUser?.();
            button.disabled = false;
        });
    });
}

function getInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return "IG";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getPath(type) {
    const insidePages = window.location.pathname.includes("/pages/");

    switch (type) {
        case "home":
            return insidePages ? "../index.html" : "./index.html";
        case "login":
            return insidePages ? "auth/login.html" : "pages/auth/login.html";
        case "signup":
            return insidePages ? "auth/signup.html" : "pages/auth/signup.html";
        case "profile":
            return insidePages ? "profile/profile.html" : "pages/profile/profile.html";
        default:
            return "../index.html";
    }
}