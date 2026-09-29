const SUPABASE_URL = "https://wqrztnlvgouexjidkxfu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_28Gb9hCl8aHqktFZ_BM1iw_XQXpjsKp";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// REQUIRE ADMIN
// ==========================================

async function requireAdmin() {

    // Check logged-in user
    const {
        data: {
            user
        },
        error: userError
    } = await supabaseClient.auth.getUser();


    if (userError || !user) {

        console.error(
            "Authentication error:",
            userError
        );

        window.location.href =
            "../pages/auth/login.html";

        return null;
    }


    // Get profile
    const {
        data: profile,
        error: profileError
    } = await supabaseClient

        .from("profiles")

        .select(`
            id,
            full_name,
            role,
            avatar_url
        `)

        .eq(
            "id",
            user.id
        )

        .single();


    if (profileError || !profile) {

        console.error(
            "Profile error:",
            profileError
        );

        alert(
            "Your profile could not be found."
        );

        window.location.href =
            "../index.html";

        return null;
    }


    // Check admin role
    if (profile.role !== "admin") {

        alert(
            "You do not have permission to access the Admin Dashboard."
        );

        window.location.href =
            "../pages/profile/profile.html";

        return null;
    }


    return {
        user,
        profile
    };
}