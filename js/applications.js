(() => {
    const statusValues = ["submitted", "reviewing", "shortlisted", "interview", "accepted", "rejected", "withdrawn"];
    let currentUser = null;
    let applicationRows = [];
    let internshipsById = new Map();
    let companiesById = new Map();
    let cvsById = new Map();

    document.addEventListener("DOMContentLoaded", initializeMyApplications);

    function t(key) {
        return window.InternGuideI18n?.t(`applications.${key}`) || key;
    }

    async function initializeMyApplications() {
        const status = document.getElementById("myApplicationsStatus");
        const list = document.getElementById("myApplicationsList");
        if (!status || !list) return;

        document.querySelectorAll("[data-applications-logout]").forEach((button) => {
            button.addEventListener("click", async () => {
                await window.supabaseClient?.auth.signOut();
                window.location.href = "../auth/login.html";
            });
        });
        document.getElementById("closeStudentApplicationDetails")?.addEventListener("click", closeDetails);
        document.getElementById("closeStudentApplicationDetailsFooter")?.addEventListener("click", closeDetails);
        document.getElementById("studentApplicationDetails")?.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) closeDetails();
        });
        list.addEventListener("click", (event) => {
            const retry = event.target.closest("[data-retry-applications]");
            if (retry) loadApplications();
            const deleteButton = event.target.closest("[data-delete-application]");
            if (deleteButton) {
                deleteApplication(deleteButton.dataset.deleteApplication, deleteButton);
                return;
            }
            const button = event.target.closest("[data-application-details]");
            if (button) showDetails(button.dataset.applicationDetails);
        });
        window.addEventListener("internGuideLanguageChange", renderApplications);
        if (window.lucide) window.lucide.createIcons();
        await loadApplications();
    }

    async function loadApplications() {
        const status = document.getElementById("myApplicationsStatus");
        const list = document.getElementById("myApplicationsList");
        status.textContent = t("loadingApplications");
        status.dataset.i18n = "applications.loadingApplications";
        list.replaceChildren();

        if (!window.supabaseClient) {
            console.error("My applications: Supabase client is unavailable.");
            showLoadError(status);
            return;
        }

        try {
            const { data: authData, error: authError } = await window.supabaseClient.auth.getUser();
            if (authError && authError.name !== "AuthSessionMissingError") throw authError;
            currentUser = authData?.user || null;
            if (!currentUser) {
                const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
                window.location.href = `../auth/login.html?returnTo=${encodeURIComponent(returnTo)}`;
                return;
            }

            const { data, error } = await window.supabaseClient
                .from("applications")
                .select("id, user_id, internship_id, cv_id, cover_letter, status, applied_at, updated_at")
                .eq("user_id", currentUser.id)
                .order("applied_at", { ascending: false });
            if (error) throw error;
            applicationRows = data || [];
            await loadRelatedData();
            status.textContent = "";
            status.removeAttribute("data-i18n");
            renderApplications();
        } catch (error) {
            console.error("Load student applications failed:", error);
            showLoadError(status);
        }
    }

    async function loadRelatedData() {
        internshipsById = new Map();
        companiesById = new Map();
        cvsById = new Map();
        const internshipIds = [...new Set(applicationRows.map((item) => String(item.internship_id || "")).filter(Boolean))];
        const cvIds = [...new Set(applicationRows.map((item) => item.cv_id).filter(Boolean).map(String))];

        const [internshipResult, cvResult] = await Promise.all([
            internshipIds.length
                ? window.supabaseClient.from("internships").select("id, title, company_id, company_name, location, work_type, duration").in("id", internshipIds)
                : Promise.resolve({ data: [], error: null }),
            cvIds.length
                ? window.supabaseClient.from("profile_cvs").select("*").in("id", cvIds).eq("user_id", currentUser.id)
                : Promise.resolve({ data: [], error: null })
        ]);

        if (internshipResult.error) throw internshipResult.error;
        if (cvResult.error) console.error("Load selected application CV metadata failed:", cvResult.error);
        (internshipResult.data || []).forEach((row) => internshipsById.set(String(row.id), row));
        (cvResult.data || []).forEach((row) => cvsById.set(String(row.id), row));

        const companyIds = [...new Set((internshipResult.data || []).map((row) => row.company_id).filter((id) => id !== null && id !== undefined).map(String))];
        if (!companyIds.length) return;
        const { data: companies, error: companyError } = await window.supabaseClient
            .from("companies")
            .select("id, name")
            .in("id", companyIds);
        if (companyError) {
            console.error("Load application companies failed:", companyError);
            return;
        }
        (companies || []).forEach((company) => companiesById.set(String(company.id), company));
    }

    function renderApplications() {
        const list = document.getElementById("myApplicationsList");
        if (!applicationRows.length) {
            list.innerHTML = `
                <div class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center sm:col-span-2">
                    <p class="text-sm text-slate-600" data-i18n="applications.noApplications">You haven't applied to any internships yet.</p>
                    <a href="../internships.html" class="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" data-i18n="applications.findInternships">Find Internships</a>
                </div>
            `;
            window.InternGuideI18n?.applyTranslations?.();
            return;
        }

        list.innerHTML = applicationRows.map((application) => {
            const internship = internshipsById.get(String(application.internship_id)) || {};
            const company = internship.company_name || companiesById.get(String(internship.company_id))?.name || t("notAvailable");
            const status = normalizeStatus(application.status);
            return `
                <article class="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div>
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div class="min-w-0"><p class="text-sm font-medium text-slate-600">${escapeHtml(company)}</p><h2 class="mt-1 text-lg font-bold text-slate-900">${escapeHtml(internship.title || t("internship"))}</h2></div>
                            <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(status)}" data-i18n="applications.statusLabels.${status}">${escapeHtml(statusLabel(status))}</span>
                        </div>
                        <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                            ${internship.location ? `<span class="inline-flex items-center gap-1.5"><i data-lucide="map-pin" class="h-4 w-4 text-slate-400"></i>${escapeHtml(internship.location)}</span>` : ""}
                            ${application.applied_at ? `<span class="inline-flex items-center gap-1.5"><i data-lucide="calendar-days" class="h-4 w-4 text-slate-400"></i>${escapeHtml(formatDate(application.applied_at))}</span>` : ""}
                        </div>
                    </div>
                    <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <span class="min-w-0 truncate text-xs text-slate-500">${escapeHtml(cvDisplayName(cvsById.get(String(application.cv_id))))}</span>
                        <div class="flex shrink-0 gap-2">
                            <button type="button" data-application-details="${escapeHtml(application.id)}" class="min-h-9 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50" data-i18n="applications.viewDetails">View Details</button>
                            <button type="button" data-delete-application="${escapeHtml(application.id)}" class="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50" aria-label="${escapeHtml(t("deleteApplication"))}" title="${escapeHtml(t("deleteApplication"))}">
                                <i data-lucide="trash-2" class="h-3.5 w-3.5" aria-hidden="true"></i>
                                <span data-i18n="applications.deleteApplication">Delete</span>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
        window.InternGuideI18n?.applyTranslations?.();
        window.lucide?.createIcons?.();
    }

    async function deleteApplication(id, button) {
        const application = applicationRows.find((item) => String(item.id) === String(id));
        if (!application || !currentUser || String(application.user_id) !== String(currentUser.id)) return;
        if (!window.confirm(t("confirmDeleteApplication"))) return;

        const status = document.getElementById("myApplicationsStatus");
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        status.textContent = t("removingApplication");
        status.removeAttribute("data-i18n");
        status.className = "mb-4 text-sm text-slate-500";

        try {
            const { data, error } = await window.supabaseClient
                .from("applications")
                .delete()
                .eq("id", application.id)
                .eq("user_id", currentUser.id)
                .select("id")
                .maybeSingle();
            if (error) throw error;
            if (!data) throw new Error("The application was not deleted.");

            applicationRows = applicationRows.filter((item) => String(item.id) !== String(id));
            renderApplications();
            status.textContent = t("applicationRemoved");
            status.className = "mb-4 text-sm text-emerald-700";
        } catch (error) {
            console.error("Remove student application failed:", error);
            button.disabled = false;
            button.removeAttribute("aria-busy");
            status.textContent = t("deleteApplicationError");
            status.className = "mb-4 text-sm text-rose-700";
        }
    }

    function showDetails(id) {
        const application = applicationRows.find((item) => String(item.id) === String(id));
        if (!application) return;
        const internship = internshipsById.get(String(application.internship_id)) || {};
        const company = internship.company_name || companiesById.get(String(internship.company_id))?.name || t("notAvailable");
        const status = normalizeStatus(application.status);
        setText("studentApplicationDetailsSubtitle", internship.title || t("internship"));
        setText("studentApplicationCompany", company);
        setText("studentApplicationLocation", internship.location);
        setText("studentApplicationWorkType", internship.work_type);
        setText("studentApplicationDuration", internship.duration);
        setText("studentApplicationDate", formatDate(application.applied_at));
        const statusElement = document.getElementById("studentApplicationStatus");
        statusElement.className = `mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(status)}`;
        statusElement.dataset.i18n = `applications.statusLabels.${status}`;
        statusElement.textContent = statusLabel(status);
        setText("studentApplicationCv", cvDisplayName(cvsById.get(String(application.cv_id))));
        document.getElementById("studentApplicationCoverLetter").textContent = application.cover_letter || t("notAvailable");
        window.InternGuideI18n?.applyTranslations?.();
        document.getElementById("studentApplicationDetails").showModal();
    }

    function showLoadError(status) {
        status.removeAttribute("data-i18n");
        status.innerHTML = `${escapeHtml(t("detailsError"))} <button type="button" data-retry-applications class="font-semibold text-blue-700 underline">${escapeHtml(window.InternGuideI18n?.t("common.tryAgain") || "Try Again")}</button>`;
    }

    function closeDetails() {
        document.getElementById("studentApplicationDetails")?.close();
    }

    function cvDisplayName(cv) {
        return cv?.file_name || cv?.name || cv?.title || t("cvUnavailable");
    }

    function normalizeStatus(status) {
        return statusValues.includes(status) ? status : "submitted";
    }

    function statusLabel(status) {
        return window.InternGuideI18n?.t(`applications.statusLabels.${status}`) || status;
    }

    function statusClass(status) {
        return ({
            submitted: "bg-blue-50 text-blue-700",
            reviewing: "bg-amber-50 text-amber-700",
            shortlisted: "bg-cyan-50 text-cyan-700",
            interview: "bg-indigo-50 text-indigo-700",
            accepted: "bg-emerald-50 text-emerald-700",
            rejected: "bg-rose-50 text-rose-700",
            withdrawn: "bg-slate-100 text-slate-600"
        })[status] || "bg-slate-100 text-slate-600";
    }

    function formatDate(value) {
        if (!value) return t("notAvailable");
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return t("notAvailable");
        const locale = window.InternGuideI18n?.getLanguage() === "km" ? "km-KH" : "en";
        return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(date);
    }

    function setText(id, value) {
        document.getElementById(id).textContent = value || t("notAvailable");
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    }
})();
