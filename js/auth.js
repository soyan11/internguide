// ==========================================
// InternGuide Authentication
// Supabase + Email + Google + Phone OTP
// ==========================================


// ==========================================
// Supabase Configuration
// ==========================================

const SUPABASE_URL =
    "https://wqrztnlvgouexjidkxfu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_28Gb9hCl8aHqktFZ_BM1iw_XQXpjsKp";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.supabaseClient = supabaseClient;


// ==========================================
// Application URLs
// ==========================================

const PROFILE_URL =
    "/pages/profile/profile.html";

const LOGIN_URL =
    "/pages/auth/login.html";

const PROTECTED_PATH_PATTERNS = [
    /\/profile\//i,
    /\/admin\//i
];

function isProtectedPage() {
    const pathname = window.location.pathname || "";
    return PROTECTED_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

function clearSupabaseSessionStorage() {
    try {
        const storageTargets = [window.localStorage, window.sessionStorage];

        storageTargets.forEach((storage) => {
            if (!storage) return;

            const keysToRemove = [];
            for (let i = 0; i < storage.length; i += 1) {
                const key = storage.key(i);
                if (key && /^sb-/.test(key)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach((key) => storage.removeItem(key));
        });
    } catch (error) {
        console.warn("Could not clear Supabase storage keys:", error);
    }

    try {
        document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            const trimmedName = (name || "").trim();
            if (!trimmedName || !trimmedName.startsWith("sb-")) return;
            document.cookie = `${trimmedName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
        });
    } catch (error) {
        console.warn("Could not clear Supabase cookies:", error);
    }
}

function getPostLoginUrl() {
    const requested = new URLSearchParams(window.location.search).get("returnTo");
    if (!requested) return PROFILE_URL;

    try {
        const destination = new URL(requested, window.location.origin);
        if (destination.origin !== window.location.origin || !destination.pathname.startsWith("/pages/")) {
            return PROFILE_URL;
        }
        return `${destination.pathname}${destination.search}${destination.hash}`;
    } catch {
        return PROFILE_URL;
    }
}


// ==========================================
// Email Login
// ==========================================

async function loginWithEmail(email, password) {

    if (!email || !password) {
        return {
            success: false,
            message: "Please enter your email and password."
        };
    }

    try {
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });

        if (error) {
            console.error("Email login error:", error);
            return {
                success: false,
                message: error.message
            };
        }

        console.log("Logged in:", data.user);

        return {
            success: true,
            user: data.user,
            session: data.session
        };
    } catch (error) {
        console.error("Email login error:", error);
        return {
            success: false,
            message: error.message || "Login failed. Please try again."
        };
    }
}


// ==========================================
// Google Login
// ==========================================

async function loginWithGoogle() {

    try {

        const { error } =
            await supabaseClient.auth.signInWithOAuth({
                provider: "google",

                options: {
                    redirectTo:
                        window.location.origin +
                        getPostLoginUrl()
                }
            });

        if (error) {

            console.error(
                "Google login error:",
                error
            );

            showMessage(
                error.message,
                "error"
            );
        }

    } catch (error) {

        console.error(
            "Google login error:",
            error
        );

        showMessage(
            "Google login failed.",
            "error"
        );
    }
}


// ==========================================
// Email Signup
// ==========================================

async function signUpWithEmail(
    name,
    email,
    password
) {

    if (!name || !email || !password) {

        return {
            success: false,
            message: "Please fill in all fields."
        };
    }

    if (password.length < 8) {

        return {
            success: false,
            message:
                "Password must be at least 8 characters."
        };
    }

    try {
        const { data, error } =
            await supabaseClient.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: {
                        full_name: name.trim()
                    }
                }
            });

        if (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                message: error.message
            };
        }

        return {
            success: true,
            user: data.user,
            session: data.session
        };
    } catch (error) {
        console.error("Signup error:", error);
        return {
            success: false,
            message: error.message || "Sign up failed. Please try again."
        };
    }
}


// ==========================================
// Google Signup
// ==========================================

async function signUpWithGoogle() {

    await loginWithGoogle();

}


// ==========================================
// Logout
// ==========================================

async function logout() {
    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
        }
    } catch (error) {
        console.error("Unexpected logout error:", error);
    } finally {
        clearSupabaseSessionStorage();
        if (window.location.pathname !== LOGIN_URL) {
            window.location.replace(LOGIN_URL);
        }
    }

    return true;
}

window.logoutCurrentUser = logout;


// ==========================================
// Get Current User
// ==========================================

async function getCurrentUser() {

    const {
        data: { user },
        error
    } =
        await supabaseClient.auth.getUser();

    if (error) {

        console.error(
            "Get user error:",
            error
        );

        return null;
    }

    return user;
}


// ==========================================
// Protect Private Pages
// ==========================================

async function requireAuth() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();

        if (error || !session?.user) {
            clearSupabaseSessionStorage();
            window.location.replace(LOGIN_URL);
            return null;
        }

        return session.user;
    } catch (error) {
        console.error("Auth validation failed:", error);
        clearSupabaseSessionStorage();
        window.location.replace(LOGIN_URL);
        return null;
    }
}

const authGuardState = { initialized: false };

function setupAuthGuard() {
    if (authGuardState.initialized) return;
    authGuardState.initialized = true;

    if (!isProtectedPage()) return;

    window.addEventListener("pageshow", async (event) => {
        if (event.persisted) {
            await requireAuth();
        }
    });

    document.addEventListener("visibilitychange", async () => {
        if (!document.hidden && isProtectedPage()) {
            await requireAuth();
        }
    });

    window.addEventListener("focus", async () => {
        if (isProtectedPage()) {
            await requireAuth();
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    setupAuthGuard();

    if (isProtectedPage()) {
        await requireAuth();
    }
});


// ==========================================
// Show Form Message
// ==========================================

function showMessage(
    message,
    type = "error"
) {

    const messageElement =
        document.getElementById(
            "formMessage"
        );

    if (!messageElement) {

        alert(message);

        return;
    }

    messageElement.textContent =
        message;

    messageElement.classList.remove(
        "hidden",
        "bg-red-50",
        "text-red-700",
        "bg-green-50",
        "text-green-700"
    );

    if (type === "success") {

        messageElement.classList.add(
            "bg-green-50",
            "text-green-700"
        );

    } else {

        messageElement.classList.add(
            "bg-red-50",
            "text-red-700"
        );
    }
}


// ==========================================
// Password Visibility
// ==========================================

function setupPasswordToggles() {

    const buttons =
        document.querySelectorAll(
            "[data-toggle-password]"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const inputId =
                    button.dataset
                        .togglePassword;

                const input =
                    document.getElementById(
                        inputId
                    );

                if (!input) return;

                const icon =
                    button.querySelector(
                        ".material-symbols-outlined"
                    );

                if (input.type === "password") {

                    input.type = "text";

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                    if (icon) {
                        icon.textContent =
                            "visibility_off";
                    }

                } else {

                    input.type = "password";

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                    if (icon) {
                        icon.textContent =
                            "visibility";
                    }
                }
            }
        );
    });
}


// ==========================================
// Login Page
// ==========================================

function setupLoginPage() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    if (!loginForm) return;


    // --------------------------------------
    // Email Login
    // --------------------------------------

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                document
                    .getElementById(
                        "email"
                    )
                    ?.value.trim();

            const password =
                document
                    .getElementById(
                        "password"
                    )
                    ?.value;

            const submitButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Signing in...";
            }

            const result =
                await loginWithEmail(
                    email,
                    password
                );

            if (!result.success) {

                showMessage(
                    result.message,
                    "error"
                );

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML = `
                        Log In to InternGuide
                        <span class="material-symbols-outlined">
                            arrow_forward
                        </span>
                    `;
                }

                return;
            }

            showMessage(
                "Login successful! Redirecting...",
                "success"
            );

            setTimeout(() => {

                window.location.href =
                    getPostLoginUrl();

            }, 500);
        }
    );


    // --------------------------------------
    // Google
    // --------------------------------------

    const googleButton =
        document.getElementById(
            "googleLogin"
        );

    if (googleButton) {

        googleButton.addEventListener(
            "click",
            loginWithGoogle
        );
    }


}


// ==========================================
// Signup Page
// ==========================================

function setupSignupPage() {

    const signupForm =
        document.getElementById(
            "signupForm"
        );

    if (!signupForm) return;


    // --------------------------------------
    // Email Signup
    // --------------------------------------

    signupForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const name =
                document
                    .getElementById(
                        "fullName"
                    )
                    ?.value.trim();

            const email =
                document
                    .getElementById(
                        "email"
                    )
                    ?.value.trim();

            const password =
                document
                    .getElementById(
                        "password"
                    )
                    ?.value;

            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    ?.value;

            const terms =
                document
                    .getElementById(
                        "terms"
                    )
                    ?.checked;


            // --------------------------------
            // Validation
            // --------------------------------

            if (!name) {

                showMessage(
                    "Please enter your full name.",
                    "error"
                );

                return;
            }

            if (!email) {

                showMessage(
                    "Please enter your email.",
                    "error"
                );

                return;
            }

            if (password.length < 8) {

                showMessage(
                    "Password must be at least 8 characters.",
                    "error"
                );

                return;
            }

            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }

            if (!terms) {

                showMessage(
                    "Please agree to the Terms of Service and Privacy Policy.",
                    "error"
                );

                return;
            }


            const submitButton =
                signupForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.innerHTML =
                    "Creating account...";
            }


            const result =
                await signUpWithEmail(
                    name,
                    email,
                    password
                );


            if (!result.success) {

                showMessage(
                    result.message,
                    "error"
                );

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML = `
                        Create My InternGuide Account
                        <span class="material-symbols-outlined">
                            arrow_forward
                        </span>
                    `;
                }

                return;
            }


            // --------------------------------
            // Account created
            // --------------------------------

            if (result.session) {

                showMessage(
                    "Account created successfully! Redirecting...",
                    "success"
                );

                setTimeout(() => {

                    window.location.href =
                        PROFILE_URL;

                }, 700);

            } else {

                showMessage(
                    "Account created! Please check your email to confirm your account.",
                    "success"
                );

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML = `
                        Create My InternGuide Account
                        <span class="material-symbols-outlined">
                            arrow_forward
                        </span>
                    `;
                }
            }
        }
    );


    // --------------------------------------
    // Google Signup
    // --------------------------------------

    const googleSignup =
        document.getElementById(
            "googleSignup"
        );

    if (googleSignup) {

        googleSignup.addEventListener(
            "click",
            signUpWithGoogle
        );
    }


}


// ==========================================
// Homepage Authentication UI
// ==========================================

async function setupHomepageAuth() {

    const guestActions =
        document.getElementById(
            "authGuestActions"
        );

    const userActions =
        document.getElementById(
            "authUserActions"
        );

    const avatarImage =
        document.getElementById(
            "homeNavbarAvatarImage"
        );

    const avatarInitials =
        document.getElementById(
            "homeNavbarAvatarInitials"
        );

    const logoutButton =
        document.getElementById(
            "homeLogoutBtn"
        );

    const mobileActions = document.querySelector(
        "#mobile-menu .site-mobile-auth"
    );


    // If homepage auth elements don't exist,
    // simply stop.
    if (
        !guestActions &&
        !userActions
    ) {
        return;
    }


    const {
        data: {
            session
        },
        error
    } =
        await supabaseClient.auth.getSession();

    const user = session?.user || null;

    const profileHref =
        userActions?.querySelector("a[href]")?.getAttribute("href") || PROFILE_URL;
    const loginHref =
        guestActions?.querySelector("a[href]")?.getAttribute("href") || LOGIN_URL;
    const signupHref =
        guestActions?.querySelectorAll("a[href]")[1]?.getAttribute("href") || "/pages/auth/signup.html";
    const navLabel = (key, fallback) =>
        window.InternGuideI18n?.t(key) || fallback;


    if (error) {

        console.error(
            "Homepage auth error:",
            error
        );

        return;
    }


    // --------------------------------------
    // Logged In
    // --------------------------------------

    if (user) {

        guestActions
            ?.classList.add("hidden");

        userActions
            ?.classList.remove("hidden");

        userActions
            ?.classList.add("flex");

        if (mobileActions) {
            mobileActions.innerHTML = `
                <a href="${profileHref}" class="border border-slate-200 text-slate-700">
                    ${navLabel("nav.profile", "My Profile")}
                </a>
                <button type="button" data-mobile-logout class="border border-red-200 bg-white text-red-600">
                    ${navLabel("nav.logout", "Logout")}
                </button>
            `;
        }


        // Get profile
        const {
            data: profile,
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "full_name, avatar_url"
                )
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();


        if (profileError) {

            console.warn(
                "Homepage profile error:",
                profileError
            );
        }


        const fullName =
            profile?.full_name ||
            user.user_metadata
                ?.full_name ||
            user.email ||
            "InternGuide User";


        // ----------------------------------
        // No Avatar
        // ----------------------------------

        if (
            !profile?.avatar_url ||
            !avatarImage
        ) {

            if (avatarInitials) {

                avatarInitials.textContent =
                    getInitials(
                        fullName
                    );

                avatarInitials.classList
                    .remove("hidden");
            }

            avatarImage
                ?.classList.add("hidden");

        } else {

            const avatarPath =
                profile.avatar_url;


            // Full URL
            if (
                avatarPath.startsWith(
                    "http"
                )
            ) {

                if (avatarImage) {

                    avatarImage.src =
                        avatarPath;

                    avatarImage.classList
                        .remove("hidden");
                }

                avatarInitials
                    ?.classList.add(
                        "hidden"
                    );

            } else {

                // Supabase Storage path
                const {
                    data,
                    error:
                        storageError
                } =
                    await supabaseClient
                        .storage
                        .from("avatars")
                        .createSignedUrl(
                            avatarPath,
                            3600
                        );


                if (
                    !storageError &&
                    data?.signedUrl
                ) {

                    if (avatarImage) {

                        avatarImage.src =
                            data.signedUrl;

                        avatarImage.classList
                            .remove(
                                "hidden"
                            );
                    }

                    avatarInitials
                        ?.classList.add(
                            "hidden"
                        );
                }
            }
        }


        // ----------------------------------
        // Logout
        // ----------------------------------

        logoutButton
            ?.addEventListener(
                "click",
                async () => {

                    await logout();

                }
            );

        mobileActions
            ?.querySelector("[data-mobile-logout]")
            ?.addEventListener("click", async () => {
                await logout();
            });

    } else {

        // ----------------------------------
        // Logged Out
        // ----------------------------------

        guestActions
            ?.classList.remove(
                "hidden"
            );

        userActions
            ?.classList.add(
                "hidden"
            );

        userActions
            ?.classList.remove(
                "flex"
            );

        if (mobileActions) {
            mobileActions.innerHTML = `
                <a href="${loginHref}" class="border border-slate-200 text-slate-700">
                    ${navLabel("nav.login", "Log In")}
                </a>
                <a href="${signupHref}" class="bg-blue-600 text-white">
                    ${navLabel("nav.signup", "Sign Up")}
                </a>
            `;
        }
    }
}


// ==========================================
// Get Initials
// ==========================================

function getInitials(name) {

    if (!name) {
        return "IG";
    }

    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


// ==========================================
// Auth State Listener
// ==========================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth event:",
            event
        );

        if (event === "SIGNED_IN") {

            console.log(
                "User signed in:",
                session?.user?.email ||
                session?.user?.phone
            );
        }

        if (event === "SIGNED_OUT") {

            console.log(
                "User signed out"
            );
        }
    }
);


// ==========================================
// Initialize
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupPasswordToggles();

        setupLoginPage();

        setupSignupPage();

        setupHomepageAuth();

    }
);