// ============================================================
// InternGuide - Shared Navigation + Authentication
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigationAuth();
});

async function initNavigationAuth() {
    try {
        // Wait a moment in case the existing auth.js is initializing Supabase
        await waitForSupabase();

        if (!window.supabaseClient) {
            console.error("InternGuide: supabaseClient was not found.");
            return;
        }

        // Update navigation with current session
        await updateAuthNavigation();

        // Listen for login/logout changes
        window.supabaseClient.auth.onAuthStateChange(() => {
            updateAuthNavigation();
        });

    } catch (error) {
        console.error("Navigation authentication error:", error);
    }
}


// ============================================================
// Wait for existing Supabase client
// ============================================================

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


// ============================================================
// Update Header / Mobile Menu
// ============================================================

async function updateAuthNavigation() {
    const { data, error } =
        await window.supabaseClient.auth.getSession();

    if (error) {
        console.error("Could not get auth session:", error);
        return;
    }

    const session = data?.session || null;

    updateDesktopAuthButtons(session);
    updateMobileAuthButtons(session);
}


// ============================================================
// Desktop Authentication Buttons
// ============================================================

function updateDesktopAuthButtons(session) {
    const containers = document.querySelectorAll(".header-actions");

    containers.forEach(container => {
        if (!container) return;

        if (session) {
            container.innerHTML = `
                <a
                    href="${getPath("profile")}"
                    class="btn btn-profile bg-white border rounded-xl p-3 px-4 hover:bg-gray-50"
                >
                    My Profile
                </a>

                <button
                    type="button"
                    class="btn btn-logout bg-blue-600 text-white p-3 px-4 rounded-xl hover:bg-blue-700"
                    data-auth-logout
                >
                    Logout
                </button>
            `;
        } else {
            container.innerHTML = `
                <a
                    href="${getPath("login")}"
                    class="btn btn-login bg-white border rounded-xl p-3 px-4 hover:bg-gray-50"
                >
                    Log In
                </a>

                <a
                    href="${getPath("signup")}"
                    class="btn btn-primary bg-blue-600 text-white p-3 px-4 rounded-xl hover:bg-blue-700"
                >
                    Sign Up
                </a>
            `;
        }
    });

    setupLogoutButtons();
}


// ============================================================
// Mobile Authentication Buttons
// ============================================================

function updateMobileAuthButtons(session) {
    const mobileMenus = document.querySelectorAll("#mobile-menu");

    mobileMenus.forEach(menu => {
        if (!menu) return;

        // Remove previous authentication section
        const oldAuth = menu.querySelector("[data-mobile-auth]");
        if (oldAuth) {
            oldAuth.remove();
        }

        const authContainer = document.createElement("div");

        authContainer.setAttribute("data-mobile-auth", "true");

        authContainer.className =
            "flex flex-col border-t border-gray-200 mt-1 pt-1";

        if (session) {
            authContainer.innerHTML = `
                <a
                    href="${getPath("profile")}"
                    class="flex h-11 items-center justify-center gap-2 border-b border-gray-200 text-sm font-semibold text-[#3f5ddd] hover:bg-gray-100"
                >
                    My Profile
                    <span class="text-lg">→</span>
                </a>

                <button
                    type="button"
                    data-auth-logout
                    class="flex h-11 w-full items-center justify-center gap-2 rounded-b-xl bg-[#3f5ddd] text-sm font-semibold text-white hover:bg-[#304fc8]"
                >
                    Logout
                    <span class="text-lg">→</span>
                </button>
            `;
        } else {
            authContainer.innerHTML = `
                <a
                    href="${getPath("login")}"
                    class="flex h-11 items-center justify-center gap-2 border-b border-gray-200 text-sm font-semibold text-[#3f5ddd] hover:bg-gray-100"
                >
                    Log In
                    <span class="text-lg">→</span>
                </a>

                <a
                    href="${getPath("signup")}"
                    class="flex h-11 items-center justify-center gap-2 rounded-b-xl bg-[#3f5ddd] text-sm font-semibold text-white hover:bg-[#304fc8]"
                >
                    Sign Up
                    <span class="text-lg">→</span>
                </a>
            `;
        }

        menu.appendChild(authContainer);
    });

    setupLogoutButtons();
}


// ============================================================
// Logout
// ============================================================

function setupLogoutButtons() {
    const logoutButtons =
        document.querySelectorAll("[data-auth-logout]");

    logoutButtons.forEach(button => {
        // Prevent duplicate event listeners
        if (button.dataset.logoutReady === "true") return;

        button.dataset.logoutReady = "true";

        button.addEventListener("click", async () => {
            button.disabled = true;

            try {
                const { error } =
                    await window.supabaseClient.auth.signOut();

                if (error) {
                    console.error("Logout failed:", error);
                    alert("Logout failed. Please try again.");
                    button.disabled = false;
                    return;
                }

                // Return to homepage after logout
                window.location.href = getPath("home");

            } catch (error) {
                console.error("Logout error:", error);
                alert("Something went wrong while logging out.");
                button.disabled = false;
            }
        });
    });
}


// ============================================================
// Correct Paths Depending on Current Page
// ============================================================

function getPath(type) {
    const currentPath = window.location.pathname;

    // We are inside /pages/...
    const insidePages =
        currentPath.includes("/pages/");

    switch (type) {

        case "home":
            return insidePages
                ? "../index.html"
                : "./index.html";

        case "login":
            return insidePages
                ? "./auth/login.html"
                : "./pages/auth/login.html";

        case "signup":
            return insidePages
                ? "./auth/signup.html"
                : "./pages/auth/signup.html";

        case "profile":
            return insidePages
                ? "./profile/profile.html"
                : "./pages/profile/profile.html";

        default:
            return "./index.html";
    }
}