(() => {
    document.addEventListener("DOMContentLoaded", async () => {
        const client = window.supabaseClient;
        const loadingView = document.getElementById("resetLoadingView");
        const invalidView = document.getElementById("resetInvalidView");
        const form = document.getElementById("resetPasswordForm");
        const successView = document.getElementById("resetSuccessView");
        const message = document.getElementById("resetPasswordMessage");
        const newPasswordInput = document.getElementById("newPassword");
        const confirmInput = document.getElementById("confirmNewPassword");
        const submitButton = document.getElementById("updatePasswordButton");
        const submitLabel = document.getElementById("updatePasswordLabel");
        let requestPending = false;

        const showView = (view) => {
            const setVisible = (element, visible) => {
                if (!element) return;
                element.hidden = !visible;
                element.classList.toggle("hidden", !visible);
            };

            setVisible(loadingView, view === "loading");
            setVisible(invalidView, view === "invalid");
            setVisible(form, view === "form");
            setVisible(successView, view === "success");
        };

        const setMessage = (key) => {
            if (!message) return;
            message.dataset.i18n = key;
            message.classList.remove("hidden", "bg-green-50", "text-green-700");
            message.classList.add("bg-red-50", "text-red-700");
            message.textContent = window.InternGuideI18n?.t(key) || key;
        };

        const clearMessage = () => {
            if (!message) return;
            message.textContent = "";
            message.classList.add("hidden");
            message.classList.remove("bg-red-50", "text-red-700");
            delete message.dataset.i18n;
        };

        if (!client?.auth?.getSession || !form || !newPasswordInput || !confirmInput || !submitButton || !submitLabel) {
            console.error("Supabase password reset is unavailable.");
            showView("invalid");
            return;
        }

        try {
            const { data, error } = await client.auth.getSession();
            if (error) {
                console.error("Could not validate the password reset session:", error);
                showView("invalid");
                return;
            }
            showView(data.session ? "form" : "invalid");
        } catch (error) {
            console.error("Could not validate the password reset session:", error);
            showView("invalid");
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (requestPending) return;
            clearMessage();

            const newPassword = newPasswordInput.value;
            const confirmation = confirmInput.value;
            if (!newPassword) {
                setMessage("auth.passwordRequired");
                newPasswordInput.focus();
                return;
            }
            if (newPassword.length < 8) {
                setMessage("auth.passwordTooShort");
                newPasswordInput.focus();
                return;
            }
            if (!confirmation) {
                setMessage("auth.confirmPasswordRequired");
                confirmInput.focus();
                return;
            }
            if (newPassword !== confirmation) {
                setMessage("auth.passwordsDoNotMatch");
                confirmInput.focus();
                return;
            }

            requestPending = true;
            submitButton.disabled = true;
            submitLabel.dataset.i18n = "auth.updatingPassword";
            submitLabel.textContent = window.InternGuideI18n?.t("auth.updatingPassword") || "Updating...";

            try {
                const { error } = await client.auth.updateUser({ password: newPassword });
                if (error) {
                    console.error("Password update error:", error);
                    const expiredSession = error.status === 401 || /session|token/i.test(error.code || "");
                    if (expiredSession) {
                        showView("invalid");
                    } else {
                        setMessage("auth.passwordUpdateError");
                    }
                    return;
                }

                showView("success");
            } catch (error) {
                console.error("Password update failed:", error);
                setMessage("auth.passwordUpdateError");
            } finally {
                requestPending = false;
                submitButton.disabled = false;
                submitLabel.dataset.i18n = "auth.updatePassword";
                submitLabel.textContent = window.InternGuideI18n?.t("auth.updatePassword") || "Update Password";
            }
        });
    });
})();
