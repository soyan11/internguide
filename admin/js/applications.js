(() => {
    const allowedStatuses = ["submitted", "reviewing", "shortlisted", "interview", "accepted", "rejected", "withdrawn"];
    let applications = [];
    let profilesById = new Map();
    let internshipsById = new Map();
    let companiesById = new Map();
    let cvsById = new Map();
    let selectedApplicationId = null;

    document.addEventListener("DOMContentLoaded", initializeAdminApplications);

    function t(key) {
        return window.InternGuideI18n?.t(`applications.${key}`) || key;
    }

    async function initializeAdminApplications() {
        const adminSession = await requireAdmin();
        if (!adminSession) return;

        document.getElementById("adminApplicationSearch")?.addEventListener("input", renderApplications);
        document.getElementById("adminApplicationStatus")?.addEventListener("change", renderApplications);
        window.addEventListener("resize", renderApplications);
        document.getElementById("adminApplicationsStatus")?.addEventListener("click", (event) => {
            if (event.target.closest("[data-retry-admin-applications]")) loadApplications();
        });
        document.getElementById("adminApplicationsTable")?.addEventListener("click", handleViewClick);
        document.getElementById("adminApplicationsCards")?.addEventListener("click", handleViewClick);
        document.getElementById("deleteAdminApplication")?.addEventListener("click", () => deleteApplication(selectedApplicationId));
        document.getElementById("closeAdminApplicationDialog")?.addEventListener("click", closeDetails);
        document.getElementById("closeAdminApplicationDialogFooter")?.addEventListener("click", closeDetails);
        document.getElementById("adminApplicationDialog")?.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) closeDetails();
        });
        document.getElementById("saveAdminApplicationStatus")?.addEventListener("click", saveStatus);
        document.getElementById("adminApplicationCvView")?.addEventListener("click", showCvPreview);
        document.getElementById("adminApplicationCvClosePreview")?.addEventListener("click", hideCvPreview);
        document.getElementById("logoutBtn")?.addEventListener("click", async () => {
            await supabaseClient.auth.signOut();
            window.location.href = "../pages/auth/login.html";
        });
        window.addEventListener("internGuideLanguageChange", renderApplications);
        setupSidebar();
        await loadApplications();
    }

    async function loadApplications() {
        const status = document.getElementById("adminApplicationsStatus");
        const table = document.getElementById("adminApplicationsTable");
        const cards = document.getElementById("adminApplicationsCards");
        const tableWrap = document.getElementById("adminApplicationsTableWrap");
        status.textContent = t("loadingApplications");
        status.dataset.i18n = "applications.loadingApplications";
        status.classList.remove("hidden");
        tableWrap?.classList.add("hidden");
        cards?.classList.add("hidden");
        table.replaceChildren();
        cards.replaceChildren();

        try {
            const { data, error } = await supabaseClient
                .from("applications")
                .select("id, user_id, internship_id, cv_id, cover_letter, status, applied_at, updated_at")
                .order("applied_at", { ascending: false });
            if (error) throw error;
            applications = data || [];
            await loadRelatedData();
            status.textContent = "";
            status.removeAttribute("data-i18n");
            status.classList.add("hidden");
            renderApplications();
        } catch (error) {
            console.error("Admin applications load failed:", error);
            status.removeAttribute("data-i18n");
            status.innerHTML = `${escapeHtml(t("unableToLoad"))} <button type="button" data-retry-admin-applications class="font-semibold text-blue-700 underline">${escapeHtml(window.InternGuideI18n?.t("common.tryAgain") || "Try Again")}</button>`;
            status.classList.remove("hidden");
        }
    }

    async function loadRelatedData() {
        profilesById = new Map();
        internshipsById = new Map();
        companiesById = new Map();
        cvsById = new Map();
        const userIds = [...new Set(applications.map((application) => application.user_id).filter(Boolean).map(String))];
        const internshipIds = [...new Set(applications.map((application) => String(application.internship_id || "")).filter(Boolean))];
        const cvIds = [...new Set(applications.map((application) => application.cv_id).filter(Boolean).map(String))];

        const [profileResult, internshipResult, cvResult] = await Promise.all([
            userIds.length
                ? supabaseClient.from("profiles").select("id, full_name, phone, university, major").in("id", userIds)
                : Promise.resolve({ data: [], error: null }),
            internshipIds.length
                ? supabaseClient.from("internships").select("id, title, company_id, company_name, location, work_type, duration").in("id", internshipIds)
                : Promise.resolve({ data: [], error: null }),
            cvIds.length
                ? supabaseClient.from("profile_cvs").select("*").in("id", cvIds)
                : Promise.resolve({ data: [], error: null })
        ]);

        if (profileResult.error) throw profileResult.error;
        if (internshipResult.error) throw internshipResult.error;
        (profileResult.data || []).forEach((row) => profilesById.set(String(row.id), row));
        (internshipResult.data || []).forEach((row) => internshipsById.set(String(row.id), row));
        if (cvResult.error) console.error("Admin application CV lookup failed:", cvResult.error);
        else (cvResult.data || []).forEach((row) => cvsById.set(String(row.id), row));

        const companyIds = [...new Set((internshipResult.data || []).map((row) => row.company_id).filter((id) => id !== null && id !== undefined).map(String))];
        if (!companyIds.length) return;
        const { data: companies, error: companyError } = await supabaseClient
            .from("companies")
            .select("id, name")
            .in("id", companyIds);
        if (companyError) {
            console.error("Admin application company lookup failed:", companyError);
            return;
        }
        (companies || []).forEach((row) => companiesById.set(String(row.id), row));
    }

    function handleViewClick(event) {
        const retry = event.target.closest("[data-retry-admin-applications]");
        if (retry) {
            loadApplications();
            return;
        }
        const deleteButton = event.target.closest("[data-delete-application]");
        if (deleteButton) { deleteApplication(deleteButton.dataset.deleteApplication); return; }
        const button = event.target.closest("[data-view-application]");
        if (button) openDetails(button.dataset.viewApplication);
    }

    function renderApplications() {
        const statusFilter = document.getElementById("adminApplicationStatus").value;
        const search = document.getElementById("adminApplicationSearch").value.trim().toLocaleLowerCase();
        const filtered = applications.filter((application) => {
            const profile = profilesById.get(String(application.user_id)) || {};
            const internship = internshipsById.get(String(application.internship_id)) || {};
            const company = internship.company_name || companiesById.get(String(internship.company_id))?.name || "";
            const matchesStatus = statusFilter === "all" || normalizeStatus(application.status) === statusFilter;
            const matchesSearch = !search || [profile.full_name, internship.title, company].some((value) => String(value || "").toLocaleLowerCase().includes(search));
            return matchesStatus && matchesSearch;
        });

        const table = document.getElementById("adminApplicationsTable");
        const cards = document.getElementById("adminApplicationsCards");
        const tableWrap = document.getElementById("adminApplicationsTableWrap");
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        if (isMobile) {
            tableWrap?.classList.add("hidden");
            cards?.classList.remove("hidden");
        } else {
            tableWrap?.classList.remove("hidden");
            cards?.classList.add("hidden");
        }

        if (!filtered.length) {
            const emptyMessage = applications.length ? t("noMatchingApplications") : t("noAdminApplications");
            table.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-sm text-slate-500">${escapeHtml(emptyMessage)}</td></tr>`;
            cards.innerHTML = `<div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">${escapeHtml(emptyMessage)}</div>`;
            return;
        }

        table.innerHTML = filtered.map(renderTableRow).join("");
        cards.innerHTML = filtered.map(renderApplicationCard).join("");
        window.InternGuideI18n?.applyTranslations?.();
        window.lucide?.createIcons?.();
    }

    function renderTableRow(application) {
        const profile = profilesById.get(String(application.user_id)) || {};
        const internship = internshipsById.get(String(application.internship_id)) || {};
        const company = internship.company_name || companiesById.get(String(internship.company_id))?.name || t("notAvailable");
        const status = normalizeStatus(application.status);
        return `<tr class="admin-applications-row border-t border-slate-100 align-top">
            <td class="px-4 py-3">
                <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-900">${escapeHtml(profile.full_name || t("notAvailable"))}</p>
                </div>
            </td>
            <td class="px-4 py-3 text-slate-700">${escapeHtml(internship.title || t("internship"))}</td>
            <td class="px-4 py-3 text-slate-700">${escapeHtml(company)}</td>
            <td class="whitespace-nowrap px-4 py-3 text-slate-500">${escapeHtml(formatDate(application.applied_at))}</td>
            <td class="max-w-48 truncate px-4 py-3 text-slate-600">${escapeHtml(cvName(cvsById.get(String(application.cv_id))))}</td>
            <td class="px-4 py-3"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(status)}" data-i18n="applications.statusLabels.${status}">${escapeHtml(statusLabel(status))}</span></td>
            <td class="px-4 py-3"><button type="button" data-view-application="${escapeHtml(application.id)}" class="min-h-9 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100" data-i18n="applications.viewApplication">View</button></td>
        </tr>`;
    }

    function renderApplicationCard(application) {
        const profile = profilesById.get(String(application.user_id)) || {};
        const internship = internshipsById.get(String(application.internship_id)) || {};
        const company = internship.company_name || companiesById.get(String(internship.company_id))?.name || t("notAvailable");
        const status = normalizeStatus(application.status);
        return `<article class="admin-application-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
            <div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-900">${escapeHtml(profile.full_name || t("notAvailable"))}</p><h2 class="mt-1 text-sm font-medium text-slate-800">${escapeHtml(internship.title || t("internship"))}</h2><p class="mt-1 text-xs text-slate-500">${escapeHtml(company)}</p></div><span class="application-status-pill shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${statusClass(status)}" data-i18n="applications.statusLabels.${status}">${escapeHtml(statusLabel(status))}</span></div>
            <div class="mt-3 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500"><span>${escapeHtml(formatDate(application.applied_at))}</span><span class="max-w-[55%] truncate">${escapeHtml(cvName(cvsById.get(String(application.cv_id))))}</span></div>
            <button type="button" data-view-application="${escapeHtml(application.id)}" class="mt-3 min-h-10 w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100" data-i18n="applications.viewApplication">View</button>
        </article>`;
    }

    async function openDetails(id) {
        const application = applications.find((item) => String(item.id) === String(id));
        if (!application) return;
        selectedApplicationId = String(application.id);
        const profile = profilesById.get(String(application.user_id)) || {};
        const internship = internshipsById.get(String(application.internship_id)) || {};
        const company = internship.company_name || companiesById.get(String(internship.company_id))?.name || t("notAvailable");
        const status = normalizeStatus(application.status);
        setText("adminApplicationDialogSubtitle", internship.title || t("internship"));
        setText("adminApplicantName", profile.full_name || t("notAvailable"));
        setText("adminApplicantEmail", t("emailManagedAuth"));
        setText("adminApplicantPhone", profile.phone);
        setText("adminApplicantUniversity", profile.university);
        setText("adminApplicantMajor", profile.major);
        setText("adminApplicationInternship", internship.title);
        setText("adminApplicationCompany", company);
        setText("adminApplicationLocation", internship.location);
        setText("adminApplicationWorkType", internship.work_type);
        setText("adminApplicationDuration", internship.duration);
        setText("adminApplicationDate", formatDate(application.applied_at));
        const cv = cvsById.get(String(application.cv_id));
        setText("adminApplicationCvName", cvName(cv));
        const cvMeta = document.getElementById("adminApplicationCvMeta");
        if (cvMeta) cvMeta.textContent = formatCvMeta(cv);
        const coverLetter = document.getElementById("adminApplicationCoverLetter");
        if (coverLetter) coverLetter.textContent = application.cover_letter || t("notAvailable");
        document.getElementById("adminApplicationStatusEdit").value = status;
        const deleteDetailButton = document.getElementById("deleteAdminApplication");
        if (deleteDetailButton) deleteDetailButton.disabled = false;
        const badge = document.getElementById("adminApplicationDialogStatusBadge");
        if (badge) {
            badge.className = `rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(status)}`;
            badge.textContent = statusLabel(status);
        }
        clearDetailMessage();
        hideCvPreview();
        await setCvPreview(cv);
        window.InternGuideI18n?.applyTranslations?.();
        window.lucide?.createIcons?.();
        const dialog = document.getElementById("adminApplicationDialog");
        if (dialog && !dialog.open) dialog.showModal();
    }

    async function setCvPreview(cv) {
        const viewButton = document.getElementById("adminApplicationCvView");
        const openLink = document.getElementById("adminApplicationCvLink");
        const downloadLink = document.getElementById("adminApplicationCvDownload");
        const message = document.getElementById("adminApplicationCvMessage");
        [viewButton, openLink, downloadLink].forEach((element) => element?.classList.add("hidden"));
        [openLink, downloadLink].forEach((element) => {
            if (element) {
                element.removeAttribute("href");
                element.removeAttribute("download");
            }
        });
        if (message) message.classList.add("hidden");

        if (!cv) {
            if (message) {
                message.textContent = "No CV was attached to this application.";
                message.classList.remove("hidden");
            }
            return;
        }

        try {
            const resolvedPath = await resolveCvStoragePath(cv);
            if (!resolvedPath) throw new Error("Unable to resolve the CV storage path");

            const { data, error } = await supabaseClient
                .storage
                .from("cv-files")
                .createSignedUrl(resolvedPath, 3600);
            if (error) throw error;

            const url = data?.signedUrl || "";
            if (!url) throw new Error("Supabase returned no signed URL");

            if (openLink) {
                openLink.href = url;
                openLink.target = "_blank";
                openLink.rel = "noopener noreferrer";
                openLink.classList.remove("hidden");
            }
            if (downloadLink) {
                downloadLink.href = url;
                downloadLink.target = "_blank";
                downloadLink.rel = "noopener noreferrer";
                downloadLink.setAttribute("download", cvOriginalName(cv) || "cv");
                downloadLink.classList.remove("hidden");
            }
            if (viewButton) {
                viewButton.dataset.cvUrl = url;
                viewButton.dataset.cvType = cvMimeType(cv);
                viewButton.classList.remove("hidden");
            }
        } catch (error) {
            console.error("Create admin application CV URL failed:", error, { cv });
            if (message) {
                message.textContent = "The CV is attached, but the file could not be opened. The admin account needs access to the cv-files object and the stored file path must match the uploaded file.";
                message.classList.remove("hidden");
            }
        }
    }

    async function resolveCvStoragePath(cv) {
        // The profile CV schema has changed across versions of the app. Prefer the
        // exact object path stored with the CV, but also accept URL-style fields.
        const rawCandidates = [
            cv.storage_path, cv.storagePath, cv.file_path, cv.filePath, cv.path,
            cv.object_path, cv.objectPath, cv.storage_key, cv.storageKey,
            cv.file_url, cv.fileUrl, cv.cv_url, cv.cvUrl, cv.url,
            cv.public_url, cv.publicUrl, cv.signed_url, cv.signedUrl,
            cv.download_url, cv.downloadUrl
        ].filter(Boolean).map(String);

        const candidates = [];
        for (const raw of rawCandidates) {
            const normalized = normalizeCvStoragePath(raw);
            if (normalized) candidates.push(normalized);
        }

        for (const candidate of [...new Set(candidates)]) {
            if (await canCreateCvSignedUrl(candidate)) return candidate;
        }

        const discovered = await discoverCvStoragePath(cv);
        if (discovered) return discovered;

        return '';
    }

    function normalizeCvStoragePath(value) {
        let path = String(value || '').trim();
        if (!path) return '';

        // Convert a Supabase Storage URL into the object path inside cv-files.
        if (/^https?:\/\//i.test(path)) {
            try {
                const url = new URL(path);
                const marker = '/storage/v1/object/';
                const markerIndex = url.pathname.indexOf(marker);
                if (markerIndex === -1) return '';
                path = url.pathname.slice(markerIndex + marker.length);
                path = path.replace(/^(sign|public|authenticated)\//i, '');
                path = path.replace(/^cv-files\//i, '');
            } catch (_) {
                return '';
            }
        }

        path = path.split('?')[0].split('#')[0];
        path = path.replace(/^\/+/, '').replace(/^cv-files\//i, '');
        try { path = decodeURIComponent(path); } catch (_) { /* keep original */ }
        return path.replace(/^\/+/, '');
    }

    async function canCreateCvSignedUrl(path) {
        try {
            const { data, error } = await supabaseClient.storage.from("cv-files").createSignedUrl(path, 300);
            return !error && Boolean(data?.signedUrl);
        } catch (_) {
            return false;
        }
    }

    async function discoverCvStoragePath(cv) {
        // If the database path is missing/stale, search the private bucket for the
        // exact CV record. This keeps the admin UI resilient to older upload formats.
        try {
            const identifiers = [
                cv.id,
                cv.user_id,
                cv.userId,
                cv.file_name,
                cv.fileName,
                cv.filename,
                cv.original_filename,
                cv.originalFilename,
                cv.name,
                cv.title
            ].filter(Boolean).map((value) => String(value).toLowerCase());

            const maxDepth = 4;
            const visited = new Set();

            async function walk(prefix = "", depth = 0) {
                if (depth > maxDepth || visited.has(prefix)) return null;
                visited.add(prefix);
                const { data, error } = await supabaseClient.storage.from("cv-files").list(prefix, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: "name", order: "asc" }
                });
                if (error || !Array.isArray(data)) return null;

                for (const item of data) {
                    const name = String(item?.name || "");
                    if (!name) continue;
                    const fullPath = prefix ? `${prefix}/${name}` : name;
                    const isFolder = !item?.metadata;
                    if (isFolder) {
                        const found = await walk(fullPath, depth + 1);
                        if (found) return found;
                        continue;
                    }

                    const haystack = fullPath.toLowerCase();
                    const exactMatch = identifiers.some((identifier) => identifier && haystack.includes(identifier));
                    if (!exactMatch) continue;
                    if (await canCreateCvSignedUrl(fullPath)) return fullPath;
                }
                return null;
            }

            // Prefer the applicant's folder when user_id is available.
            for (const userId of [cv.user_id, cv.userId]) {
                if (userId) {
                    const found = await walk(String(userId), 0);
                    if (found) return found;
                }
            }
            return await walk("", 0);
        } catch (error) {
            console.warn("Unable to discover CV storage object:", error);
            return "";
        }
    }

    function cvOriginalName(cv) {
        return String(cv?.original_filename || cv?.originalFilename || cv?.file_name || cv?.fileName || cv?.filename || cv?.name || cv?.title || "").trim();
    }

    function showCvPreview() {
        const button = document.getElementById("adminApplicationCvView");
        const preview = document.getElementById("adminApplicationCvPreview");
        const frame = document.getElementById("adminApplicationCvFrame");
        const url = button?.dataset.cvUrl;
        const type = button?.dataset.cvType || "";
        if (!url || !preview || !frame) return;
        frame.src = url;
        preview.classList.remove("hidden");
        if (!/pdf|application\/pdf/i.test(type) && !/\.pdf(?:$|[?#])/i.test(url)) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    }

    function hideCvPreview() {
        const preview = document.getElementById("adminApplicationCvPreview");
        const frame = document.getElementById("adminApplicationCvFrame");
        preview?.classList.add("hidden");
        if (frame) frame.src = "about:blank";
    }

    function cvMimeType(cv) {
        return String(cv?.mime_type || cv?.mimeType || cv?.content_type || cv?.file_type || "").toLowerCase();
    }

    function formatCvMeta(cv) {
        const type = cvMimeType(cv);
        const size = Number(cv?.file_size || cv?.size || 0);
        const parts = [];
        if (type) parts.push(type.replace("application/", "").replace("vnd.openxmlformats-officedocument.wordprocessingml.document", "DOCX").toUpperCase());
        if (size > 0) parts.push(formatFileSize(size));
        return parts.length ? parts.join(" • ") : "Uploaded CV";
    }

    function formatFileSize(bytes) {
        if (!bytes) return "";
        const units = ["B", "KB", "MB", "GB"];
        let value = bytes;
        let index = 0;
        while (value >= 1024 && index < units.length - 1) { value /= 1024; index += 1; }
        return `${value < 10 && index > 0 ? value.toFixed(1) : Math.round(value)} ${units[index]}`;
    }

    async function deleteApplication(id) {
        const application = applications.find((item) => String(item.id) === String(id));
        if (!application) return;
        const profile = profilesById.get(String(application.user_id)) || {};
        const internship = internshipsById.get(String(application.internship_id)) || {};
        const applicantName = profile.full_name || "this applicant";
        const internshipTitle = internship.title || "this internship";
        const confirmed = window.confirm(`Delete the application from ${applicantName} for ${internshipTitle}?\n\nThis removes only the application record. The applicant's saved CV will not be deleted.`);
        if (!confirmed) return;

        const buttons = document.querySelectorAll(`[data-delete-application="${CSS.escape(String(id))}"], #deleteAdminApplication`);
        buttons.forEach((button) => { button.disabled = true; button.textContent = "Deleting…"; });
        try {
            const { error } = await supabaseClient.from("applications").delete().eq("id", application.id);
            if (error) throw error;
            applications = applications.filter((item) => String(item.id) !== String(application.id));
            closeDetails();
            renderApplications();
            const message = document.getElementById("adminApplicationMessage");
            if (message) {
                message.textContent = "Application deleted successfully.";
                message.className = "mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700";
                setTimeout(() => message.classList.add("hidden"), 3500);
            }
        } catch (error) {
            console.error("Delete application failed:", error);
            const message = document.getElementById("adminApplicationMessage");
            if (message) {
                message.textContent = "The application could not be deleted. Check the applications DELETE policy in Supabase.";
                message.className = "mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700";
            }
            buttons.forEach((button) => { button.disabled = false; button.textContent = button.id === "deleteAdminApplication" ? "Delete Application" : "Delete"; });
        }
    }

    async function saveStatus() {
        const application = applications.find((item) => String(item.id) === selectedApplicationId);
        if (!application) return;
        const newStatus = document.getElementById("adminApplicationStatusEdit").value;
        if (!allowedStatuses.includes(newStatus)) return;
        const button = document.getElementById("saveAdminApplicationStatus");
        button.disabled = true;
        button.textContent = t("statusUpdating");
        clearDetailMessage();
        try {
            const { error } = await supabaseClient
                .from("applications")
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq("id", application.id);
            if (error) throw error;
            application.status = newStatus;
            application.updated_at = new Date().toISOString();
            renderApplications();
            showDetailMessage("statusUpdated", "success");
        } catch (error) {
            console.error("Update application status failed:", error);
            showDetailMessage("statusUpdateError", "error");
        } finally {
            button.disabled = false;
            button.textContent = t("saveStatus");
        }
    }

    function showDetailMessage(key, type) {
        const message = document.getElementById("adminApplicationDetailMessage");
        message.textContent = t(key);
        message.className = `mt-3 rounded-lg p-3 text-sm ${type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`;
        message.dataset.i18n = `applications.${key}`;
        window.InternGuideI18n?.applyTranslations?.();
    }

    function clearDetailMessage() {
        const message = document.getElementById("adminApplicationDetailMessage");
        message.className = "mt-3 hidden rounded-lg p-3 text-sm";
        message.textContent = "";
        message.removeAttribute("data-i18n");
    }

    function closeDetails() {
        document.getElementById("adminApplicationDialog")?.close();
        selectedApplicationId = null;
    }

    function cvName(cv) {
        return cv?.original_filename || cv?.originalFilename || cv?.file_name || cv?.fileName || cv?.filename || cv?.name || cv?.title || t("cvUnavailable");
    }

    function normalizeStatus(status) {
        return allowedStatuses.includes(status) ? status : "submitted";
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

    function setupSidebar() {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebarOverlay");
        const menu = document.getElementById("mobileMenuBtn");
        const close = () => {
            sidebar?.classList.add("-translate-x-full");
            sidebar?.classList.remove("translate-x-0");
            overlay?.classList.add("hidden");
            document.body.classList.remove("overflow-hidden");
        };
        menu?.addEventListener("click", () => {
            sidebar?.classList.remove("-translate-x-full");
            sidebar?.classList.add("translate-x-0");
            overlay?.classList.remove("hidden");
            document.body.classList.add("overflow-hidden");
        });
        overlay?.addEventListener("click", close);
        window.addEventListener("resize", () => { if (window.innerWidth >= 1024) close(); });
        sidebar?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { if (window.innerWidth < 1024) close(); }));
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    }
})();
