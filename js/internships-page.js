const internshipFacetDefinitions = [
    { key: "location", labelKey: "common.location" },
    { key: "work_mode", labelKey: "common.workMode" },
    { key: "internship_type", labelKey: "common.internshipType" },
    { key: "duration", labelKey: "common.duration" },
    { key: "career_field", labelKey: "common.careerField" },
    { key: "skills", labelKey: "common.skills" }
];

const internshipsPerPage = 4;
const internshipFilters = new Map();
const internshipFacetOptions = new Map();
let internshipRows = [];
let internshipDataLoaded = false;
let internshipResults;
let internshipActiveFilters;
let internshipMain;
let internshipPagination;
let currentInternshipPage = 1;

window.addEventListener("DOMContentLoaded", initializeInternshipPage);

async function initializeInternshipPage() {
    const searchInput = document.getElementById("internshipSearch");
    const sidebarSearchInput = document.getElementById("internshipSidebarSearch");
    const locationInput = document.getElementById("internshipLocationSearch");
    const sortSelect = document.getElementById("internshipSort");
    const filterContainer = document.getElementById("internship-filters");
    internshipMain = document.querySelector("main") || document.querySelector("section main") || document.querySelector("section .site-container main");

    if (!searchInput || !sidebarSearchInput || !locationInput || !sortSelect || !filterContainer || !internshipMain) {
        console.warn("Internship page: required internship elements were not found.");
        return;
    }

    prepareResultsContainer();
    filterContainer.replaceChildren();

    searchInput.addEventListener("input", () => {
        sidebarSearchInput.value = searchInput.value;
        currentInternshipPage = 1;
        renderInternships();
    });
    sidebarSearchInput.addEventListener("input", () => {
        searchInput.value = sidebarSearchInput.value;
        currentInternshipPage = 1;
        renderInternships();
    });
    locationInput.addEventListener("input", () => {
        currentInternshipPage = 1;
        renderInternships();
    });
    sortSelect.addEventListener("change", () => {
        currentInternshipPage = 1;
        renderInternships();
    });
    filterContainer.addEventListener("change", (event) => {
        const checkbox = event.target.closest("input[data-filter-key]");
        if (!checkbox) return;

        const selected = internshipFilters.get(checkbox.dataset.filterKey);
        if (checkbox.checked) selected.add(checkbox.dataset.filterValue);
        else selected.delete(checkbox.dataset.filterValue);
        currentInternshipPage = 1;
        renderInternships();
    });

    document.getElementById("clearInternshipFilters")?.addEventListener("click", resetInternshipFilters);
    document.getElementById("resetInternshipFilters")?.addEventListener("click", resetInternshipFilters);
    setupMobileFilterDrawer();
    window.addEventListener("internGuideLanguageChange", () => {
        if (!internshipDataLoaded) return;
        renderFacetOptions();
        renderInternships();
    });

    internshipActiveFilters?.addEventListener("click", (event) => {
        if (event.target.closest("[data-clear-all-internship-filters]")) {
            resetInternshipFilters();
            return;
        }

        const searchType = event.target.closest("[data-clear-search]")?.dataset.clearSearch;
        if (searchType === "keyword") {
            searchInput.value = "";
            sidebarSearchInput.value = "";
        } else if (searchType === "location") {
            locationInput.value = "";
        } else {
            const chip = event.target.closest("[data-clear-filter-key]");
            if (!chip) return;
            internshipFilters.get(chip.dataset.clearFilterKey)?.delete(chip.dataset.clearFilterValue);
            filterContainer.querySelectorAll("input[data-filter-key]").forEach((checkbox) => {
                if (checkbox.dataset.filterKey === chip.dataset.clearFilterKey && checkbox.dataset.filterValue === chip.dataset.clearFilterValue) {
                    checkbox.checked = false;
                }
            });
        }

        currentInternshipPage = 1;
        renderInternships();
    });

    internshipResults.addEventListener("click", (event) => {
        if (event.target.closest("[data-clear-all-internship-filters]")) {
            resetInternshipFilters();
            return;
        }

        const toggle = event.target.closest("[data-internship-details-toggle]");
        if (!toggle) return;

        const card = toggle.closest("[data-internship-card]");
        const details = card?.querySelector("[data-internship-details]");
        if (!details) return;

        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isOpen));
        details.hidden = isOpen;
        details.classList.toggle("hidden", isOpen);
        const label = toggle.querySelector("[data-internship-details-label]");
        const labelKey = isOpen ? "common.viewDetails" : "common.hideDetails";
        if (label) {
            label.dataset.i18n = labelKey;
            label.textContent = window.InternGuideI18n?.t(labelKey) || "View Details";
        }
    });
    document.querySelectorAll("[data-popular-search]").forEach((button) => {
        button.addEventListener("click", () => {
            searchInput.value = button.dataset.popularSearch;
            sidebarSearchInput.value = searchInput.value;
            currentInternshipPage = 1;
            renderInternships();
            document.getElementById("internshipResults")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    await loadInternshipData();
}

function prepareResultsContainer() {
    const header = internshipMain.firstElementChild;
    if (!header) return;
    internshipMain.replaceChildren(header);

    internshipActiveFilters = document.createElement("div");
    internshipActiveFilters.id = "activeInternshipFilters";
    internshipActiveFilters.className = "hidden";
    header.insertAdjacentElement("afterend", internshipActiveFilters);

    internshipResults = document.createElement("div");
    internshipResults.id = "internshipResults";
    internshipResults.className = "space-y-5";
    internshipActiveFilters.insertAdjacentElement("afterend", internshipResults);

    internshipPagination = document.createElement("nav");
    internshipPagination.id = "internshipPagination";
    internshipPagination.className = "hidden flex w-full flex-wrap items-center justify-center gap-2 pb-4";
    internshipPagination.setAttribute("aria-label", "Internship pagination");
    internshipResults.insertAdjacentElement("afterend", internshipPagination);
    internshipPagination.addEventListener("click", (event) => {
        const button = event.target.closest("[data-internship-page]");
        if (!button || button.disabled) return;

        const page = Number(button.dataset.internshipPage);
        const pageCount = Number(internshipPagination.dataset.pageCount);
        if (!Number.isInteger(page) || page < 1 || page > pageCount || page === currentInternshipPage) return;

        currentInternshipPage = page;
        renderInternships();
        internshipResults.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function setupMobileFilterDrawer() {
    const sidebar = document.getElementById("internshipFilterSidebar");
    const backdrop = document.getElementById("internshipFilterBackdrop");
    const toggle = document.getElementById("mobileFilterToggle");
    const close = document.getElementById("closeMobileFilters");
    const apply = document.getElementById("applyMobileFilters");
    if (!sidebar || !backdrop || !toggle) return;

    const setOpen = (open) => {
        sidebar.classList.toggle("is-open", open);
        backdrop.classList.toggle("is-open", open);
        backdrop.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("overflow-hidden", open);
        if (open) close?.focus();
        else toggle.focus();
    };

    toggle.addEventListener("click", () => setOpen(true));
    close?.addEventListener("click", () => setOpen(false));
    apply?.addEventListener("click", () => setOpen(false));
    backdrop.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && sidebar.classList.contains("is-open")) setOpen(false);
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024 && sidebar.classList.contains("is-open")) setOpen(false);
    });
}

function renderActiveFilters() {
    if (!internshipActiveFilters) return;
    const keyword = document.getElementById("internshipSearch").value.trim();
    const locationSearch = document.getElementById("internshipLocationSearch").value.trim();
    const activeValues = [...internshipFilters.entries()].flatMap(([key, selected]) =>
        [...selected].map((value) => ({ key, value }))
    );
    const activeCount = activeValues.length + Number(Boolean(keyword)) + Number(Boolean(locationSearch));
    const countBadge = document.getElementById("activeFilterCount");
    if (countBadge) {
        countBadge.textContent = String(activeCount);
        countBadge.classList.toggle("hidden", activeCount === 0);
    }

    const chips = [];
    if (keyword) chips.push(`<button type="button" data-clear-search="keyword" class="filter-chip"><span>${escapeHtml(`${window.InternGuideI18n?.t("common.search") || "Search"}: ${keyword}`)}</span><span aria-hidden="true">×</span></button>`);
    if (locationSearch) chips.push(`<button type="button" data-clear-search="location" class="filter-chip"><span>${escapeHtml(`${window.InternGuideI18n?.t("common.location") || "Location"}: ${locationSearch}`)}</span><span aria-hidden="true">×</span></button>`);
    activeValues.forEach(({ key, value }) => {
        const definition = internshipFacetDefinitions.find((item) => item.key === key);
        const label = definition ? window.InternGuideI18n?.t(definition.labelKey) || definition.labelKey : key;
        const valueLabel = internshipFacetOptions.get(key)?.get(value)?.label || value;
        chips.push(`<button type="button" data-clear-filter-key="${escapeHtml(key)}" data-clear-filter-value="${escapeHtml(value)}" class="filter-chip"><span>${escapeHtml(`${label}: ${valueLabel}`)}</span><span aria-hidden="true">×</span></button>`);
    });

    internshipActiveFilters.classList.toggle("hidden", chips.length === 0);
    internshipActiveFilters.innerHTML = chips.length ? `
        <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="mr-1 text-xs font-semibold text-slate-500" data-i18n="common.activeFilters">Active filters</span>
            ${chips.join("")}
            <button type="button" data-clear-all-internship-filters class="px-2 py-1 text-xs font-semibold text-blue-700 hover:underline" data-i18n="common.clearAll">Clear All</button>
        </div>
    ` : "";
    window.InternGuideI18n?.applyTranslations?.();
}

async function loadInternshipData() {
    internshipResults.innerHTML = '<p class="rounded-xl border border-slate-200 bg-white p-6 text-slate-600" data-i18n="common.loadingInternships">Loading internships...</p>';

    if (!window.supabaseClient) {
        console.error("Supabase client is unavailable.");
        showLoadError();
        return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);
    try {
        const { data, error } = await window.supabaseClient
            .from("internships")
            .select("id, title, company_id, company_name, location, work_type, duration, description, requirements, deadline, application_url, status, created_at, internship_type, skills, category_id, categories ( id, name, slug )")
            .in("status", ["active", "approved"])
            .order("created_at", { ascending: false })
            .abortSignal(controller.signal);
        window.clearTimeout(timeoutId);

        if (error) {
            console.error("Load public internships error:", error);
            showLoadError();
            return;
        }

        internshipRows = await addCompanyLogos(data || []);
        internshipDataLoaded = true;
        renderFacetOptions();
        renderInternships();
    } catch (error) {
        window.clearTimeout(timeoutId);
        console.error("Load public internships failed:", error);
        showLoadError();
    }
}

function renderFacetOptions() {
    const container = document.getElementById("internship-filters");
    container.innerHTML = internshipFacetDefinitions.map(({ key, labelKey }) => {
        if (!internshipFilters.has(key)) internshipFilters.set(key, new Set());
        const options = new Map();
        internshipRows.forEach((row) => {
            getFacetEntries(row, key).forEach(({ value, label }) => {
                const option = options.get(value);
                if (option) option.count += 1;
                else options.set(value, { value, label, count: 1 });
            });
        });
        internshipFacetOptions.set(key, options);
        const values = [...options.values()].sort((a, b) =>
            a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" })
        );

        if (!values.length) return "";

        return `
            <section class="border-b border-slate-100 pb-5 last:border-0">
                <h3 class="mb-3 text-base font-bold text-slate-900" data-i18n="${labelKey}">${escapeHtml(window.InternGuideI18n?.t(labelKey) || labelKey)}</h3>
                <div class="max-h-56 space-y-3 overflow-y-auto">
                    ${values.map(({ value, label, count }) => `
                        <label class="flex cursor-pointer items-center justify-between gap-3 group">
                            <span class="flex min-w-0 items-center gap-3">
                                <input type="checkbox" class="custom-checkbox" value="${escapeHtml(value)}" data-filter-key="${escapeHtml(key)}" data-filter-value="${escapeHtml(value)}" ${internshipFilters.get(key).has(value) ? "checked" : ""}>
                                <span class="truncate text-sm font-medium text-slate-700 group-hover:text-slate-900">${escapeHtml(label)}</span>
                            </span>
                            <span class="text-xs font-medium text-slate-400">${count}</span>
                        </label>
                    `).join("")}
                </div>
            </section>
        `;
    }).join("") || `<p class="text-sm text-slate-500" data-i18n="common.noFilterOptions">No filter options available.</p>`;
    window.InternGuideI18n?.applyTranslations?.();
}

function renderInternships() {
    if (!internshipResults) return;

    const search = document.getElementById("internshipSearch").value.trim().toLocaleLowerCase();
    const locationSearch = document.getElementById("internshipLocationSearch").value.trim().toLocaleLowerCase();
    const selectedFilters = [...internshipFilters.entries()].filter(([, values]) => values.size);

    const filtered = internshipRows.filter((row) => {
        const searchable = [
            row.title,
            row.company_name,
            row.location,
            ...getFacetValues(row, "work_mode"),
            ...getFacetValues(row, "internship_type"),
            ...getFacetValues(row, "duration"),
            getCategoryName(row),
            row.description,
            row.requirements,
            ...getFacetValues(row, "skills")
        ].map(stringifyValue).join(" ").toLocaleLowerCase();

        if (search && !searchable.includes(search)) return false;
        const searchableLocations = getFacetValues(row, "location");
        if (locationSearch && !searchableLocations.some((value) => value.toLocaleLowerCase().includes(locationSearch))) return false;

        return selectedFilters.every(([key, selected]) => {
            const selectedKeys = new Set([...selected].map(normalizeOptionKey));
            return getFacetValues(row, key).some((value) => selectedKeys.has(normalizeOptionKey(value)));
        });
    });

    if (document.getElementById("internshipResultCount")) {
        document.getElementById("internshipResultCount").textContent = String(filtered.length);
    }

    const sort = document.getElementById("internshipSort").value;
    if (sort === "newest") {
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (search) {
        filtered.sort((a, b) => relevanceScore(b, search) - relevanceScore(a, search));
    }

    const pageCount = Math.ceil(filtered.length / internshipsPerPage);
    currentInternshipPage = pageCount ? Math.min(currentInternshipPage, pageCount) : 1;
    const pageStart = (currentInternshipPage - 1) * internshipsPerPage;
    const pageRows = filtered.slice(pageStart, pageStart + internshipsPerPage);

    internshipResults.innerHTML = filtered.length
        ? pageRows.map(renderInternshipCard).join("")
        : `
            <div class="rounded-xl border border-slate-200 bg-white p-8 text-center" role="status">
                <h2 class="text-base font-semibold text-slate-900" data-i18n="common.noResults">No internships found</h2>
                <p class="mt-2 text-sm text-slate-500" data-i18n="common.noResultsHint">Try removing a filter, changing your search, or clearing all filters.</p>
                <button type="button" data-clear-all-internship-filters class="mt-4 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" data-i18n="common.clearAll">Clear All</button>
            </div>
        `;

    renderInternshipPagination(filtered.length, pageCount);
    renderActiveFilters();

    internshipResults.querySelectorAll("[data-company-logo]").forEach((image) => {
        image.addEventListener("error", () => {
            image.classList.add("hidden");
            image.parentElement?.querySelector("[data-company-fallback]")?.classList.remove("hidden");
        }, { once: true });
    });

    window.InternGuideI18n?.applyTranslations?.();
}

function renderInternshipPagination(totalItems, pageCount) {
    if (!internshipPagination) return;
    internshipPagination.dataset.pageCount = String(pageCount);

    if (pageCount <= 1) {
        internshipPagination.innerHTML = "";
        internshipPagination.classList.add("hidden");
        return;
    }

    internshipPagination.classList.remove("hidden");
    const firstPage = Math.max(1, Math.min(currentInternshipPage - 2, pageCount - 4));
    const lastPage = Math.min(pageCount, firstPage + 4);
    const pageButtons = Array.from({ length: lastPage - firstPage + 1 }, (_, index) => {
        const page = firstPage + index;
        const active = page === currentInternshipPage;
        return `
            <button type="button" data-internship-page="${page}" ${active ? 'aria-current="page"' : ""}
                class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50"}">
                ${page}
            </button>
        `;
    }).join("");

    internshipPagination.innerHTML = `
        <button type="button" data-internship-page="${currentInternshipPage - 1}" ${currentInternshipPage === 1 ? "disabled" : ""}
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40" data-i18n="common.previous">Previous</button>
        ${pageButtons}
        <button type="button" data-internship-page="${currentInternshipPage + 1}" ${currentInternshipPage === pageCount ? "disabled" : ""}
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40" data-i18n="common.next">Next</button>
        <span class="ml-2 text-sm text-slate-500"><span data-i18n="common.page">Page</span> ${currentInternshipPage} <span data-i18n="common.of">of</span> ${pageCount} <span class="sr-only">(${totalItems} results)</span></span>
    `;
}

function renderInternshipCard(row) {
    const skills = getFacetValues(row, "skills");
    const deadline = row.deadline ? new Date(row.deadline) : null;
    const deadlineLabel = deadline && !Number.isNaN(deadline.getTime())
        ? `Deadline: ${deadline.toLocaleDateString()}`
        : "Applications open";
    const applicationUrl = getSafeApplicationUrl(row.application_url);
    const companyName = stringifyValue(row.company_name || "Company");
    const companyLogoUrl = getSafeApplicationUrl(row.company_logo_url);
    const description = stringifyValue(row.description);
    const requirements = stringifyValue(row.requirements);
    const workMode = normalizeWorkMode(row.work_type) || (isRemoteLocation(row.location) ? "Remote" : "");
    const metadata = [
        { icon: "fa-location-dot", value: stringifyValue(row.location) },
        { icon: "fa-clock", value: stringifyValue(row.duration) },
        { icon: "fa-building", value: workMode }
    ].filter((item) => item.value.trim());
    const metadataMarkup = metadata.map((item, index) => `
        ${index ? '<span class="text-slate-300" aria-hidden="true">·</span>' : ""}
        <span class="inline-flex items-center gap-2 text-sm text-slate-600">
            <i class="fa-solid ${item.icon} text-slate-400" aria-hidden="true"></i>
            ${escapeHtml(item.value)}
        </span>
    `).join("");
    const postedAt = formatPostedDate(row.created_at);
    const isHiring = ["active", "approved"].includes(stringifyValue(row.status).toLowerCase());

    return `
        <article data-internship-card class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2 text-sm font-semibold text-slate-600">
                    ${companyLogoUrl ? `<img data-company-logo src="${escapeHtml(companyLogoUrl)}" alt="" class="h-full w-full object-contain">` : ""}
                    <span data-company-fallback class="${companyLogoUrl ? "hidden" : ""}">${escapeHtml(getCompanyInitials(companyName))}</span>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p class="text-sm font-medium text-slate-800">${escapeHtml(companyName)}</p>
                        ${isHiring ? '<span class="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700" data-i18n="common.activeHiring">Active Hiring</span>' : `<span class="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">${escapeHtml(formatFacetValue("status", stringifyValue(row.status || "Open")))}</span>`}
                    </div>
                    <h2 class="mt-1 text-lg font-semibold leading-snug text-slate-900 sm:text-xl">${escapeHtml(row.title || "Internship opportunity")}</h2>
                </div>
            </div>

            ${metadataMarkup ? `<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">${metadataMarkup}</div>` : ""}
            ${description ? `<p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">${escapeHtml(description)}</p>` : ""}
            ${skills.length ? `<div class="mt-3 flex flex-wrap gap-2">${skills.map((skill) => `<span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">${escapeHtml(skill)}</span>`).join("")}</div>` : ""}

            <div data-internship-details class="hidden mt-4 space-y-3 rounded-lg bg-slate-50 p-4" hidden>
                ${requirements ? `<div><h3 class="text-xs font-semibold uppercase text-slate-500">Requirements</h3><p class="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">${escapeHtml(requirements)}</p></div>` : ""}
                <div><h3 class="text-xs font-semibold uppercase text-slate-500">Deadline</h3><p class="mt-1 text-sm text-slate-700">${escapeHtml(deadlineLabel)}</p></div>
                ${applicationUrl ? `<a href="${escapeHtml(applicationUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800" data-i18n="applications.originalListing">Original Listing <i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i></a>` : ""}
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <span class="text-xs font-medium text-slate-500">${postedAt}</span>
                <div class="flex flex-wrap items-center gap-2">
                    <button type="button" data-apply-internship-id="${escapeHtml(row.id)}" data-apply-title="${escapeHtml(row.title || "Internship opportunity")}" data-apply-company="${escapeHtml(companyName)}" data-apply-location="${escapeHtml(row.location || "")}" data-apply-work-type="${escapeHtml(workMode)}" data-apply-duration="${escapeHtml(row.duration || "")}" class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                        <span data-i18n="applications.applyNow">Apply Now</span>
                    </button>
                    <button type="button" data-internship-details-toggle aria-expanded="false" class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                        <span data-internship-details-label data-i18n="common.viewDetails">View Details</span>
                        <i class="fa-solid fa-arrow-right text-[11px]" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

async function addCompanyLogos(rows) {
    const companyIds = [...new Set(rows.map((row) => row.company_id).filter((id) => id !== null && id !== undefined))];
    if (!companyIds.length) return rows;

    try {
        const { data, error } = await window.supabaseClient
            .from("companies")
            .select("id, name, logo_url")
            .in("id", companyIds);
        if (error) return rows;

        const companiesByCompanyId = new Map((data || []).map((company) => [String(company.id), company]));
        return rows.map((row) => ({
            ...row,
            company_name: row.company_name || companiesByCompanyId.get(String(row.company_id))?.name || "Company",
            company_logo_url: companiesByCompanyId.get(String(row.company_id))?.logo_url || ""
        }));
    } catch {
        return rows;
    }
}

function getCompanyInitials(companyName) {
    const words = companyName.trim().split(/\s+/).filter(Boolean);
    return (words.length > 1 ? `${words[0][0]}${words[1][0]}` : words[0]?.slice(0, 2) || "C").toUpperCase();
}

function formatPostedDate(createdAt) {
    if (!createdAt) return '<span data-i18n="common.recentlyPosted">Recently posted</span>';

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return '<span data-i18n="common.recentlyPosted">Recently posted</span>';

    const daysAgo = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
    const language = window.InternGuideI18n?.getLanguage() === "km" ? "km-KH" : "en";
    const relativeDate = new Intl.RelativeTimeFormat(language, { numeric: "auto" }).format(-daysAgo, "day");
    return `<span><span data-i18n="common.posted">Posted</span> ${escapeHtml(relativeDate)}</span>`;
}

function resetInternshipFilters() {
    document.getElementById("internshipSearch").value = "";
    document.getElementById("internshipSidebarSearch").value = "";
    document.getElementById("internshipLocationSearch").value = "";
    document.getElementById("internshipSort").value = "relevant";
    internshipFilters.forEach((selected) => selected.clear());
    currentInternshipPage = 1;
    document.querySelectorAll("#internship-filters input[type=checkbox]").forEach((checkbox) => {
        checkbox.checked = false;
    });
    renderInternships();
}

function showLoadError() {
    internshipResults.innerHTML = `
        <div role="status" class="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
            <p class="font-medium" data-i18n="common.unableToLoadInternships">Unable to load internships.</p>
            <button id="retryInternshipsButton" type="button" class="mt-3 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100" data-i18n="common.tryAgain">Try Again</button>
        </div>
    `;
    internshipPagination?.classList.add("hidden");
    internshipActiveFilters?.classList.add("hidden");
    const count = document.getElementById("internshipResultCount");
    if (count) count.textContent = "0";
    window.InternGuideI18n?.applyTranslations?.();
    document.getElementById("retryInternshipsButton")?.addEventListener("click", loadInternshipData);
}

function getFacetValues(row, key) {
    return getFacetEntries(row, key).map(({ value }) => value);
}

function getFacetEntries(row, key) {
    let entries = [];
    if (key === "location") {
        const location = normalizeFacetText(key, row.location);
        if (location) entries = [location];
    } else if (key === "work_mode") {
        const workMode = normalizeFacetText(key, row.work_type);
        if (workMode) entries = [workMode];
    } else if (key === "internship_type") {
        const type = normalizeFacetText(key, row.internship_type);
        if (type) entries = [type];
    } else if (key === "duration") {
        const duration = normalizeFacetText(key, row.duration);
        if (duration) entries = [duration];
    } else if (key === "career_field") {
        const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
        const categoryName = getCategoryName(row);
        if (categoryName && row.category_id !== null && row.category_id !== undefined) {
            entries = [{ value: String(row.category_id), label: toCanonicalEnglishText(category?.name || row.category_name) }];
        }
    } else if (key === "skills") {
        entries = toValueList(row.skills)
            .map((skill) => normalizeFacetText(key, skill))
            .filter(Boolean);
    }
    return [...new Map(entries.filter(Boolean).map((entry) => [entry.value, entry])).values()];
}

function getCategoryName(row) {
    const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    const name = normalizeText(category?.name || row.category_name);
    return /^category\s*\d+$/i.test(name) ? "" : name;
}

function normalizeText(value) {
    return stringifyValue(value).replace(/\s+/g, " ").trim();
}

function normalizeOptionKey(value) {
    return normalizeText(value).toLocaleLowerCase();
}

function toCanonicalEnglishText(value) {
    return normalizeText(window.InternGuideI18n?.toEnglishText?.(value) || value);
}

function normalizeFacetText(key, value) {
    const englishText = toCanonicalEnglishText(value);
    if (!englishText) return null;

    if (key === "location") {
        const location = englishText.replace(/,\s*cambodia$/i, "").trim();
        if (!location) return null;
        if (isRemoteLocation(location)) return { value: "remote", label: "Remote" };
        const knownLocations = { "phnom penh": "Phnom Penh" };
        const label = knownLocations[normalizeOptionKey(location)] || location;
        return { value: normalizeOptionKey(label), label };
    }

    if (key === "work_mode") {
        const label = normalizeWorkMode(englishText);
        return label ? { value: normalizeOptionKey(label), label } : null;
    }

    if (key === "internship_type") {
        const normalized = englishText.toLocaleLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
        const knownTypes = {
            internship: "Internship",
            internships: "Internship",
            "full time internship": "Full-time Internship",
            "part time internship": "Part-time Internship",
            "summer internship": "Summer Internship"
        };
        const label = knownTypes[normalized] || englishText;
        return { value: normalizeOptionKey(label), label };
    }

    if (key === "duration") {
        const normalized = englishText.toLocaleLowerCase().replace(/\s+/g, " ").trim();
        const duration = normalized.match(/^(\d+)\s*(?:months?)$/);
        const label = duration
            ? `${duration[1]} ${Number(duration[1]) === 1 ? "month" : "months"}`
            : englishText;
        return { value: normalizeOptionKey(label), label };
    }

    const label = englishText.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    return label ? { value: normalizeOptionKey(label), label } : null;
}

function isRemoteLocation(value) {
    const normalized = normalizeText(value).toLocaleLowerCase().replace(/[_-]+/g, " ");
    return ["remote", "remote work", "work from home"].includes(normalized);
}

function normalizeLocation(value) {
    const location = normalizeText(value).replace(/,\s*cambodia$/i, "").trim();
    return isRemoteLocation(location) ? "Remote" : location;
}


function normalizeInternshipType(value) {
    const type = normalizeText(value);
    const normalized = type.toLocaleLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    if (/^internship$/.test(normalized)) return "Internship";
    if (/^full time internship$/.test(normalized)) return "Full-time Internship";
    if (/^part time internship$/.test(normalized)) return "Part-time Internship";
    if (/^summer internship$/.test(normalized)) return "Summer Internship";
    return type;
}

function normalizeWorkMode(value) {
    const normalized = normalizeText(value).toLocaleLowerCase().replace(/[_-]+/g, " ");
    if (/^(on\s*site|onsite|in\s*person|in\s*office)$/.test(normalized)) return "On-site";
    if (/^hybrid$/.test(normalized)) return "Hybrid";
    if (/^(remote|remote work|work from home)$/.test(normalized)) return "Remote";
    return "";
}

function toValueList(value) {
    if (Array.isArray(value)) return value;
    if (typeof value !== "string") return value ? [value] : [];
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            // Keep the original value when the stored text is not JSON.
        }
    }
    return trimmed.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
}

function formatFacetValue(key, value) {
    if (key === "work_mode") return value;
    return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function stringifyValue(value) {
    if (Array.isArray(value)) return value.map(stringifyValue).join(" ");
    if (value && typeof value === "object") return Object.values(value).map(stringifyValue).join(" ");
    return value === null || value === undefined ? "" : String(value);
}

function relevanceScore(row, search) {
    const title = stringifyValue(row.title).toLocaleLowerCase();
    const company = stringifyValue(row.company_name).toLocaleLowerCase();
    return (title.startsWith(search) ? 2 : title.includes(search) ? 1 : 0) + (company.startsWith(search) ? 1 : 0);
}

function getSafeApplicationUrl(value) {
    if (!value) return "";
    try {
        const url = new URL(value, window.location.href);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}
