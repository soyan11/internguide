(() => {
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("forgotPasswordForm");
        const formView = document.getElementById("forgotFormView");
        const successView = document.getElementById("forgotSuccessView");
        const emailInput = document.getElementById("resetEmail");
        const message = document.getElementById("resetEmailMessage");
        const submitButton = document.getElementById("sendResetButton");
        const submitLabel = document.getElementById("sendResetLabel");
        let requestPending = false;

        if (!form || !emailInput || !message || !submitButton || !submitLabel) return;

        const setMessage = (key) => {
            message.dataset.i18n = key;
            message.classList.remove("hidden", "bg-green-50", "text-green-700");
            message.classList.add("bg-red-50", "text-red-700");
            message.textContent = window.InternGuideI18n?.t(key) || key;
        };

        const clearMessage = () => {
            message.textContent = "";
            message.classList.add("hidden");
            message.classList.remove("bg-red-50", "text-red-700");
            delete message.dataset.i18n;
        };

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (requestPending) return;

            clearMessage();
            const email = emailInput.value.trim();
            if (!email) {
                setMessage("auth.emailRequired");
                emailInput.focus();
                return;
            }

            emailInput.value = email;
            if (!emailInput.checkValidity()) {
                setMessage("auth.emailInvalid");
                emailInput.focus();
                return;
            }

            const client = window.supabaseClient;
            if (!client?.auth?.resetPasswordForEmail) {
                console.error("Supabase password reset is unavailable.");
                setMessage("auth.resetEmailError");
                return;
            }

            requestPending = true;
            submitButton.disabled = true;
            submitLabel.dataset.i18n = "auth.sendingResetLink";
            submitLabel.textContent = window.InternGuideI18n?.t("auth.sendingResetLink") || "Sending...";

            try {
                const redirectTo = `${window.location.origin}/pages/auth/reset-password.html`;
                const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
                if (error) {
                    console.error("Password reset email error:", error);
                    setMessage("auth.resetEmailError");
                    return;
                }

                formView.hidden = true;
                formView.classList.add("hidden");
                successView.hidden = false;
                successView.classList.remove("hidden");
            } catch (error) {
                console.error("Password reset email request failed:", error);
                setMessage("auth.resetEmailError");
            } finally {
                requestPending = false;
                submitButton.disabled = false;
                submitLabel.dataset.i18n = "auth.sendResetLink";
                submitLabel.textContent = window.InternGuideI18n?.t("auth.sendResetLink") || "Send Reset Link";
            }
        });
    });
})();
