(() => {
    const careerGuideFields = [
        "title",
        "category",
        "description",
        "skills",
        "qualifications",
        "career_path",
        "related_internships",
        "content"
    ];
    const careerGuidesPerPage = 4;
    let careerGuideRows = [];
    let currentCareerGuidePage = 1;

    document.addEventListener("DOMContentLoaded", initializeCareerGuidesPage);

    async function initializeCareerGuidesPage() {
        const grid = document.getElementById("careerGuidesGrid");
        const status = document.getElementById("careerGuidesStatus");
        const form = document.getElementById("home-search-form");
        const searchInput = document.getElementById("home-search-input");
        const categories = document.getElementById("careerGuideCategories");
        const dialog = document.getElementById("careerGuideDialog");
        const pagination = document.getElementById("careerGuidesPagination");

        if (!grid || !status || !form || !searchInput || !categories || !dialog) return;

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            currentCareerGuidePage = 1;
            renderCareerGuides();
            grid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        searchInput.addEventListener("input", () => {
            currentCareerGuidePage = 1;
            renderCareerGuides();
        });
        categories.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-category]");
            if (!button) return;

            searchInput.value = button.dataset.category;
            currentCareerGuidePage = 1;
            renderCareerGuides();
            grid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        pagination?.addEventListener("click", (event) => {
            const button = event.target.closest("[data-career-guide-page]");
            if (!button || button.disabled) return;

            const page = Number(button.dataset.careerGuidePage);
            const pageCount = Number(pagination.dataset.pageCount);
            if (!Number.isInteger(page) || page < 1 || page > pageCount || page === currentCareerGuidePage) return;

            currentCareerGuidePage = page;
            renderCareerGuides();
            grid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        grid.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-guide-id]");
            if (!button) return;

            const guide = careerGuideRows.find((row) => String(row.id) === button.dataset.guideId);
            if (guide) openCareerGuideDialog(dialog, guide);
        });
        dialog.querySelectorAll("[data-close-career-dialog]").forEach((button) => {
            button.addEventListener("click", () => dialog.close());
        });
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) dialog.close();
        });
        dialog.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            dialog.close();
        });

        if (!window.supabaseClient) {
            showCareerGuideError(grid, status, "The database connection is not available. Please refresh the page.");
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from("career_guides")
                .select("id, title, category, description, skills, qualifications, career_path, related_internships, content")
                .eq("status", "published")
                .order("created_at", { ascending: false });

            if (error) throw error;

            careerGuideRows = data || [];
            renderCareerGuideCategories(categories, careerGuideRows);
            renderCareerGuides();
            status.textContent = careerGuideRows.length
                ? `${careerGuideRows.length} published ${careerGuideRows.length === 1 ? "career guide" : "career guides"}`
                : "No career guides have been published yet.";
        } catch (error) {
            console.error("Load public career guides error:", error);
            showCareerGuideError(grid, status, "Career guides could not be loaded. Please try again later.");
        }
    }

    function renderCareerGuideCategories(container, guides) {
        const categories = [...new Set(guides.map((guide) => guide.category?.trim()).filter(Boolean))].slice(0, 4);
        const label = document.createElement("span");
        label.className = "font-medium text-gray-400 mr-1";
        label.textContent = "Popular:";
        container.replaceChildren(label);

        categories.forEach((category) => {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.category = category;
            button.className = "px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:border-gray-300 transition-colors hover:shadow-[0_0_8px_rgba(10,100,246,0.5)]";
            button.textContent = category;
            container.append(button);
        });
    }

    function renderCareerGuides() {
        const grid = document.getElementById("careerGuidesGrid");
        const search = document.getElementById("home-search-input").value.trim().toLocaleLowerCase();
        const filtered = careerGuideRows.filter((guide) =>
            careerGuideFields.some((field) => stringifyGuideValue(guide[field]).toLocaleLowerCase().includes(search))
        );

        if (!careerGuideRows.length) {
            grid.replaceChildren();
            pagination?.classList.add("hidden");
            if (pagination) pagination.innerHTML = "";
            grid.classList.remove("grid", "grid-cols-1", "md:grid-cols-2");
            grid.style.display = "none";
            grid.setAttribute("aria-hidden", "true");
            grid.setAttribute("aria-busy", "false");
            return;
        }

        const pageCount = Math.ceil(filtered.length / careerGuidesPerPage);
        currentCareerGuidePage = pageCount ? Math.min(currentCareerGuidePage, pageCount) : 1;
        const pageStart = (currentCareerGuidePage - 1) * careerGuidesPerPage;
        const pageRows = filtered.slice(pageStart, pageStart + careerGuidesPerPage);

        grid.innerHTML = filtered.length
            ? pageRows.map(renderCareerGuideCard).join("")
            : '<p class="col-span-full rounded-xl border border-slate-200 bg-white p-6 text-slate-600">No career guides match your search.</p>';
        grid.classList.add("grid", "grid-cols-1", "md:grid-cols-2");
        grid.style.display = "grid";
        grid.removeAttribute("aria-hidden");
        grid.setAttribute("aria-busy", "false");
        renderCareerGuidesPagination(filtered.length, pageCount);
        window.InternGuideI18n?.applyTranslations?.();
    }

    function renderCareerGuidesPagination(totalItems, pageCount) {
        const pagination = document.getElementById("careerGuidesPagination");
        if (!pagination) return;
        pagination.dataset.pageCount = String(pageCount);

        if (pageCount <= 1) {
            pagination.innerHTML = "";
            pagination.classList.add("hidden");
            pagination.classList.remove("flex");
            return;
        }

        pagination.classList.add("flex");
        pagination.classList.remove("hidden");
        const firstPage = Math.max(1, Math.min(currentCareerGuidePage - 2, pageCount - 4));
        const lastPage = Math.min(pageCount, firstPage + 4);
        const pageButtons = Array.from({ length: lastPage - firstPage + 1 }, (_, index) => {
            const page = firstPage + index;
            const active = page === currentCareerGuidePage;
            return `
                <button type="button" data-career-guide-page="${page}" ${active ? 'aria-current="page"' : ""}
                    class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50"}">
                    ${page}
                </button>
            `;
        }).join("");

        pagination.innerHTML = `
            <button type="button" data-career-guide-page="${currentCareerGuidePage - 1}" ${currentCareerGuidePage === 1 ? "disabled" : ""}
                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40" data-i18n="common.previous">Previous</button>
            ${pageButtons}
            <button type="button" data-career-guide-page="${currentCareerGuidePage + 1}" ${currentCareerGuidePage === pageCount ? "disabled" : ""}
                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40" data-i18n="common.next">Next</button>
            <span class="ml-2 text-sm text-slate-500"><span data-i18n="common.page">Page</span> ${currentCareerGuidePage} <span data-i18n="common.of">of</span> ${pageCount} <span class="sr-only">(${totalItems} results)</span></span>
        `;
    }

    function renderCareerGuideCard(guide) {
        const skills = parseGuideList(guide.skills);

        return `
            <article class="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-[0_0_16px_rgba(10,100,246,0.25)]">
                <div>
                    <div class="flex items-center justify-between gap-3">
                        <span class="bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full text-xs">${escapeGuideHtml(guide.category || "Career")}</span>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900 mt-5 mb-2.5">${escapeGuideHtml(guide.title || "Career Guide")}</h2>
                    ${guide.description ? `<p class="text-slate-600 text-sm mb-6 leading-relaxed whitespace-pre-line">${escapeGuideHtml(guide.description)}</p>` : ""}
                    ${skills.length ? `
                        <div class="mb-5">
                            <h3 class="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3">Key Skills</h3>
                            <div class="flex flex-wrap gap-2">${skills.map((skill) => `<span class="bg-slate-100/80 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-medium">${escapeGuideHtml(skill)}</span>`).join("")}</div>
                        </div>
                    ` : ""}
                </div>
                <button type="button" data-guide-id="${escapeGuideHtml(guide.id)}"
                    class="mt-8 w-full rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                    View Career
                </button>
            </article>
        `;
    }

    function openCareerGuideDialog(dialog, guide) {
        const description = document.getElementById("careerGuideDialogDescription");
        const skills = parseGuideList(guide.skills);
        const sections = [
            ["Key Skills", skills.join(", ")],
            ["Qualifications", guide.qualifications],
            ["Career Path", guide.career_path],
            ["Related Internships", guide.related_internships],
            ["Guide", guide.content]
        ].filter(([, value]) => stringifyGuideValue(value).trim());

        document.getElementById("careerGuideDialogCategory").textContent = guide.category || "Career";
        document.getElementById("careerGuideDialogTitle").textContent = guide.title || "Career Guide";
        description.textContent = guide.description || "Explore the key details for this career path.";
        document.getElementById("careerGuideDialogContent").innerHTML = sections.length
            ? `<div class="space-y-6">${sections.map(([label, value]) => `
                <section>
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">${label}</h3>
                    <p class="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">${escapeGuideHtml(value)}</p>
                </section>
            `).join("")}</div>`
            : '<p class="text-sm text-slate-600">More information about this career will be added soon.</p>';

        dialog.showModal();
    }

    function parseGuideList(value) {
        if (Array.isArray(value)) return value.map(stringifyGuideValue).filter(Boolean);
        if (typeof value !== "string") return [];

        const trimmed = value.trim();
        if (trimmed.startsWith("[")) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed.map(stringifyGuideValue).filter(Boolean);
            } catch {
                // Treat malformed JSON as ordinary text.
            }
        }
        return trimmed.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean);
    }

    function stringifyGuideValue(value) {
        if (Array.isArray(value)) return value.map(stringifyGuideValue).join(" ");
        return value === null || value === undefined ? "" : String(value);
    }

    function escapeGuideHtml(value) {
        return stringifyGuideValue(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function showCareerGuideError(grid, status, message) {
        status.textContent = message;
        grid.innerHTML = "";
        grid.classList.remove("grid", "grid-cols-1", "md:grid-cols-2");
        grid.style.display = "none";
        grid.setAttribute("aria-hidden", "true");
        grid.setAttribute("aria-busy", "false");
    }
})();