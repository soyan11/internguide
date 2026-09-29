// ============================================================
// InternGuide - Profile Picture Upload
// ============================================================

const AVATAR_BUCKET = "avatars";

async function uploadProfileAvatar(file) {
    try {
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            showAvatarMessage(
                "Please choose a JPG, PNG, or WebP image.",
                "error"
            );
            return;
        }

        // 2 MB limit
        if (file.size > 2 * 1024 * 1024) {
            showAvatarMessage(
                "Image must be smaller than 2 MB.",
                "error"
            );
            return;
        }

        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            showAvatarMessage(
                "Please log in again.",
                "error"
            );
            return;
        }

        showAvatarMessage("Uploading photo...", "loading");

        // File extension
        const extension =
            file.name.split(".").pop().toLowerCase();

        // Each user gets their own folder
        const filePath =
            `${user.id}/avatar.${extension}`;

        // Remove old avatar files first
        const { data: oldFiles } =
            await supabaseClient.storage
                .from(AVATAR_BUCKET)
                .list(user.id);

        if (oldFiles && oldFiles.length > 0) {
            const oldPaths = oldFiles.map(
                file => `${user.id}/${file.name}`
            );

            await supabaseClient.storage
                .from(AVATAR_BUCKET)
                .remove(oldPaths);
        }

        // Upload new image
        const { error: uploadError } =
            await supabaseClient.storage
                .from(AVATAR_BUCKET)
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: true,
                    contentType: file.type
                });

        if (uploadError) {
            console.error(
                "Avatar upload error:",
                uploadError
            );

            showAvatarMessage(
                "Unable to upload your photo.",
                "error"
            );

            return;
        }

        // Save ONLY the file path in profiles
        const { error: profileError } =
            await supabaseClient
                .from("profiles")
                .update({
                    avatar_url: filePath,
                    updated_at: new Date().toISOString()
                })
                .eq("id", user.id);

        if (profileError) {
            console.error(
                "Avatar profile update error:",
                profileError
            );

            showAvatarMessage(
                "Photo uploaded, but profile could not be updated.",
                "error"
            );

            return;
        }

        // Display the image
        await displayProfileAvatar(filePath);

        showAvatarMessage(
            "Profile picture updated!",
            "success"
        );

    } catch (error) {
        console.error(
            "Unexpected avatar error:",
            error
        );

        showAvatarMessage(
            "Something went wrong.",
            "error"
        );
    }
}


// ============================================================
// Display Avatar
// ============================================================

async function displayProfileAvatar(filePath) {

    const image =
        document.getElementById("profileAvatarImage");

    const initials =
        document.getElementById("profileAvatarInitials");

    if (!image || !initials) return;

    if (!filePath) {
        image.classList.add("hidden");
        initials.classList.remove("hidden");
        return;
    }

    const { data, error } =
        await supabaseClient.storage
            .from(AVATAR_BUCKET)
            .createSignedUrl(
                filePath,
                60 * 60
            );

    if (error || !data?.signedUrl) {
        console.error(
            "Avatar display error:",
            error
        );

        image.classList.add("hidden");
        initials.classList.remove("hidden");

        return;
    }

    image.src = data.signedUrl;

    image.onload = () => {
        image.classList.remove("hidden");
        initials.classList.add("hidden");
    };
}


// ============================================================
// Load Existing Avatar
// ============================================================

async function loadProfileAvatar() {

    try {

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        if (!user) return;

        const { data: profile } =
            await supabaseClient
                .from("profiles")
                .select("avatar_url")
                .eq("id", user.id)
                .maybeSingle();

        if (profile?.avatar_url) {
            await displayProfileAvatar(
                profile.avatar_url
            );
        }

    } catch (error) {

        console.error(
            "Unable to load avatar:",
            error
        );
    }
}


// ============================================================
// Message
// ============================================================

function showAvatarMessage(
    message,
    type = "loading"
) {

    const element =
        document.getElementById("avatarMessage");

    if (!element) return;

    element.textContent = message;

    element.className =
        "text-xs mt-2";

    if (type === "error") {
        element.classList.add("text-red-600");
    } else if (type === "success") {
        element.classList.add("text-green-600");
    } else {
        element.classList.add("text-slate-500");
    }
}


// ============================================================
// Events
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const input =
            document.getElementById("avatarInput");

        if (input) {

            input.addEventListener(
                "change",
                async (event) => {

                    const file =
                        event.target.files?.[0];

                    if (!file) return;

                    await uploadProfileAvatar(file);

                    // Allow selecting the same file again
                    input.value = "";
                }
            );
        }

        loadProfileAvatar();
    }
);