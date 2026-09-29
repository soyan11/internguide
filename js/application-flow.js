(() => {
    let activeInternship = null;
    let currentUser = null;
    let availableCvs = [];
    let currentCardButton = null;

    document.addEventListener("DOMContentLoaded", initializeApplicationFlow);

    function t(key) {
        return window.InternGuideI18n?.t(`applications.${key}`) || key;
    }

    function initializeApplicationFlow() {
        const dialog = document.getElementById("applicationDialog");
        if (!dialog) return;

        document.addEventListener("click", (event) => {
            const button = event.target.closest("[data-apply-internship-id]");
            if (button) openApplication(button);
        });
        document.getElementById("closeApplicationDialog")?.addEventListener("click", closeApplicationDialog);
        document.getElementById("cancelApplication")?.addEventListener("click", closeApplicationDialog);
        document.getElementById("closeApplicationSuccess")?.addEventListener("click", closeApplicationDialog);
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) closeApplicationDialog();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !dialog.classList.contains("hidden")) closeApplicationDialog();
        });
        document.getElementById("applicationForm")?.addEventListener("submit", submitApplication);
        document.getElementById("applicationCoverLetter")?.addEventListener("input", updateCoverLetterCount);
        document.getElementById("applicationCv")?.addEventListener("change", updateCvPreview);
        window.addEventListener("internGuideLanguageChange", updateApplicationActionLabels);
        updateApplicationActionLabels();
        resumeApplyAfterLogin();
    }

    async function openApplication(button) {
        const rawInternshipId = String(button.dataset.applyInternshipId ?? "").trim();
        if (!rawInternshipId || !/^\d+$/.test(rawInternshipId)) {
            console.error("Invalid internship ID for application:", button.dataset.applyInternshipId);
            return;
        }

        activeInternship = {
            id: rawInternshipId,
            title: button.dataset.applyTitle || "",
            company: button.dataset.applyCompany || "",
            location: button.dataset.applyLocation || "",
            workType: button.dataset.applyWorkType || "",
            duration: button.dataset.applyDuration || ""
        };
        currentCardButton = button;
        resetApplicationDialog();
        showApplicationView("loading");
        openDialog();

        if (!window.supabaseClient) {
            console.error("Application flow: Supabase client is unavailable.");
            showApplicationMessage("unableToLoad", "error");
            showApplicationView("form");
            return;
        }

        try {
            const { data, error } = await window.supabaseClient.auth.getUser();
            if (error && error.name !== "AuthSessionMissingError") throw error;
            currentUser = data?.user || null;
            if (!currentUser) {
                showApplicationView("login");
                document.getElementById("applicationLoginLink").href = getLoginReturnUrl(activeInternship.id);
                return;
            }

            const [profileResult, cvsResult, duplicateResult] = await Promise.all([
                window.supabaseClient
                    .from("profiles")
                    .select("full_name, phone, university, major")
                    .eq("id", currentUser.id)
                    .maybeSingle(),
                window.supabaseClient
                    .from("profile_cvs")
                    .select("*")
                    .eq("user_id", currentUser.id)
                    .order("created_at", { ascending: false }),
                window.supabaseClient
                    .from("applications")
                    .select("id, status")
                    .eq("user_id", currentUser.id)
                    .eq("internship_id", activeInternship.id)
                    .maybeSingle()
            ]);

            if (profileResult.error) throw profileResult.error;
            if (cvsResult.error) throw cvsResult.error;
            if (duplicateResult.error) throw duplicateResult.error;

            const profile = profileResult.data || {};
            setText("applicationInternshipTitle", activeInternship.title);
            setText("applicationCompany", activeInternship.company);
            setText("applicationLocation", activeInternship.location);
            setText("applicationWorkType", activeInternship.workType);
            setText("applicationDuration", activeInternship.duration);
            setText("applicationApplicantName", profile.full_name || currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || t("notAvailable"));
            setText("applicationApplicantEmail", currentUser.email || t("notAvailable"));
            setText("applicationApplicantPhone", profile.phone || t("notAvailable"));
            setText("applicationApplicantUniversity", profile.university || t("notAvailable"));
            setText("applicationApplicantMajor", profile.major || t("notAvailable"));

            availableCvs = cvsResult.data || [];
            renderCvOptions();
            showApplicationView("form");
            if (duplicateResult.data) {
                showApplicationMessage("alreadyApplied", "warning", true);
                document.getElementById("submitApplication").disabled = true;
            }
            window.InternGuideI18n?.applyTranslations?.();
        } catch (error) {
            console.error("Load application form failed:", error);
            showApplicationView("form");
            showApplicationMessage("unableToLoad", "error", true);
        }
    }

    function renderCvOptions() {
        const select = document.getElementById("applicationCv");
        const noCv = document.getElementById("applicationNoCv");
        const submit = document.getElementById("submitApplication");
        select.innerHTML = `<option value="">${escapeHtml(t("chooseCv"))}</option>`;
        availableCvs.forEach((cv) => {
            const option = document.createElement("option");
            option.value = String(cv.id);
            option.textContent = `${cv.file_name || cv.name || cv.title || t("cv")}${cv.created_at ? ` · ${formatDate(cv.created_at)}` : ""}`;
            select.append(option);
        });
        noCv.classList.toggle("hidden", availableCvs.length > 0);
        submit.disabled = availableCvs.length === 0;
        if (!availableCvs.length) showApplicationMessage("noCvRequired", "warning", true);
    }

    async function updateCvPreview() {
        const link = document.getElementById("applicationCvPreview");
        link.classList.add("hidden");
        link.removeAttribute("href");
        const cv = availableCvs.find((item) => String(item.id) === document.getElementById("applicationCv").value);
        if (!cv?.storage_path || !window.supabaseClient) return;

        try {
            const { data, error } = await window.supabaseClient.storage
                .from("cv-files")
                .createSignedUrl(cv.storage_path, 900);
            if (error) throw error;
            if (data?.signedUrl) {
                link.href = data.signedUrl;
                link.classList.remove("hidden");
            }
        } catch (error) {
            console.error("Create CV preview link failed:", error);
        }
    }

    async function submitApplication(event) {
        event.preventDefault();
        const submitButton = document.getElementById("submitApplication");
        const cvId = document.getElementById("applicationCv").value;
        const coverLetter = document.getElementById("applicationCoverLetter").value.trim();
        if (!activeInternship || !currentUser) return;
        clearApplicationMessage();

        if (!cvId) {
            showApplicationMessage("chooseCv", "error", true);
            document.getElementById("applicationCv").focus();
            return;
        }
        if (!coverLetter) {
            showApplicationMessage("coverLetterRequired", "error", true);
            document.getElementById("applicationCoverLetter").focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = t("submitting");
        let keepSubmitDisabled = false;
        try {
            const { data: existing, error: duplicateError } = await window.supabaseClient
                .from("applications")
                .select("id")
                .eq("user_id", currentUser.id)
                .eq("internship_id", activeInternship.id)
                .maybeSingle();
            if (duplicateError) throw duplicateError;
            if (existing) {
                keepSubmitDisabled = true;
                showApplicationMessage("alreadyApplied", "warning", true);
                return;
            }

            const { error } = await window.supabaseClient
                .from("applications")
                .insert({
                    user_id: currentUser.id,
                    internship_id: activeInternship.id,
                    cv_id: cvId,
                    cover_letter: coverLetter
                });
            if (error) {
                if (error.code === "23505") {
                    keepSubmitDisabled = true;
                    showApplicationMessage("alreadyApplied", "warning", true);
                    return;
                }
                throw error;
            }

            currentCardButton?.setAttribute("data-application-submitted", "true");
            currentCardButton?.setAttribute("aria-disabled", "true");
            currentCardButton.disabled = true;
            currentCardButton?.classList.remove("bg-blue-600", "hover:bg-blue-700");
            currentCardButton?.classList.add("bg-emerald-600", "hover:bg-emerald-700");
            currentCardButton?.querySelector("[data-i18n]")?.setAttribute("data-i18n", "applications.applied");
            if (currentCardButton?.querySelector("[data-i18n]")) currentCardButton.querySelector("[data-i18n]").textContent = t("applied");

            document.getElementById("applicationSuccessTitle").textContent = activeInternship.title;
            document.getElementById("applicationCoverLetter").value = "";
            document.getElementById("applicationCoverLetterCount").textContent = "0";
            showApplicationView("success");
            window.InternGuideI18n?.applyTranslations?.();
        } catch (error) {
            console.error("Application submission failed:", error);
            showApplicationMessage("submitError", "error", true);
        } finally {
            submitButton.disabled = keepSubmitDisabled || availableCvs.length === 0;
            submitButton.textContent = t("submit");
        }
    }

    function resumeApplyAfterLogin() {
        const requestedId = new URLSearchParams(window.location.search).get("apply");
        if (!requestedId) return;
        const observer = new MutationObserver(() => {
            const button = [...document.querySelectorAll("[data-apply-internship-id]")]
                .find((item) => item.dataset.applyInternshipId === requestedId);
            if (!button) return;
            observer.disconnect();
            const url = new URL(window.location.href);
            url.searchParams.delete("apply");
            window.history.replaceState({}, "", url);
            button.click();
        });
        observer.observe(document.getElementById("internshipResults") || document.body, { childList: true, subtree: true });
        const existingButton = [...document.querySelectorAll("[data-apply-internship-id]")]
            .find((item) => item.dataset.applyInternshipId === requestedId);
        if (existingButton) {
            observer.disconnect();
            const url = new URL(window.location.href);
            url.searchParams.delete("apply");
            window.history.replaceState({}, "", url);
            existingButton.click();
        }
    }

    function getLoginReturnUrl(internshipId) {
        const returnTo = `${window.location.pathname}?apply=${encodeURIComponent(internshipId)}${window.location.hash}`;
        return `auth/login.html?returnTo=${encodeURIComponent(returnTo)}`;
    }

    function openDialog() {
        const dialog = document.getElementById("applicationDialog");
        dialog.classList.remove("hidden");
        dialog.setAttribute("aria-hidden", "false");
        document.body.classList.add("overflow-hidden");
        document.getElementById("closeApplicationDialog").focus();
    }

    function closeApplicationDialog() {
        const dialog = document.getElementById("applicationDialog");
        dialog.classList.add("hidden");
        dialog.setAttribute("aria-hidden", "true");
        document.body.classList.remove("overflow-hidden");
        clearApplicationMessage();
        activeInternship = null;
        currentUser = null;
        availableCvs = [];
    }

    function resetApplicationDialog() {
        document.getElementById("applicationForm").reset();
        document.getElementById("submitApplication").disabled = false;
        document.getElementById("submitApplication").textContent = t("submit");
        document.getElementById("applicationCoverLetterCount").textContent = "0";
        document.getElementById("applicationCvPreview").classList.add("hidden");
        document.getElementById("applicationCv").innerHTML = `<option value="">${escapeHtml(t("loadingCvs"))}</option>`;
        clearApplicationMessage();
        showApplicationView("loading");
    }

    function showApplicationView(view) {
        document.getElementById("applicationLoginNotice").classList.toggle("hidden", view !== "login");
        document.getElementById("applicationLoading").classList.toggle("hidden", view !== "loading");
        document.getElementById("applicationForm").classList.toggle("hidden", view !== "form");
        document.getElementById("applicationSuccess").classList.toggle("hidden", view !== "success");
    }

    function showApplicationMessage(key, kind, replace = false) {
        const message = document.getElementById("applicationFormMessage");
        if (replace) message.replaceChildren();
        message.textContent = t(key);
        message.className = `rounded-lg p-3 text-sm ${kind === "error" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`;
        message.dataset.i18n = `applications.${key}`;
        window.InternGuideI18n?.applyTranslations?.();
    }

    function clearApplicationMessage() {
        const message = document.getElementById("applicationFormMessage");
        message.className = "hidden";
        message.textContent = "";
        message.removeAttribute("data-i18n");
    }

    function updateCoverLetterCount() {
        const value = document.getElementById("applicationCoverLetter").value;
        document.getElementById("applicationCoverLetterCount").textContent = String(value.length);
    }

    function updateApplicationActionLabels() {
        document.querySelectorAll("[data-apply-internship-id]").forEach((button) => {
            const key = button.dataset.applicationSubmitted === "true" ? "applied" : "applyNow";
            button.querySelector("[data-i18n]")?.setAttribute("data-i18n", `applications.${key}`);
        });
        window.InternGuideI18n?.applyTranslations?.();
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value || t("notAvailable");
    }

    function formatDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const language = window.InternGuideI18n?.getLanguage() === "km" ? "km-KH" : "en";
        return new Intl.DateTimeFormat(language, { year: "numeric", month: "short", day: "numeric" }).format(date);
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[character]);
    }
})();
