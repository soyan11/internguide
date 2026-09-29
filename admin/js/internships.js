let internships = [];
let companies = [];
let categories = [];
let editingId = null;
let editingCompanyId = null;
let editingCategoryId = null;

const $ = (id) => document.getElementById(id);


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    const admin = await requireAdmin();

    if (!admin) return;

    setupEvents();

    await loadCompanies();
    await loadCategories();
    await loadInternships();
});


// ==========================================
// EVENTS
// ==========================================

function setupEvents() {
    $("addInternshipBtn")?.addEventListener("click", openAddModal);
    $("closeModalBtn")?.addEventListener("click", closeModal);
    $("cancelBtn")?.addEventListener("click", closeModal);
    $("internshipForm")?.addEventListener("submit", saveInternship);

    $("createCompanyBtn")?.addEventListener("click", openCompanyModal);
    $("closeCompanyModalBtn")?.addEventListener("click", closeCompanyModal);
    $("cancelCompanyBtn")?.addEventListener("click", closeCompanyModal);
    $("companyModal")?.addEventListener("click", event => {
        if (event.target === $("companyModal")) closeCompanyModal();
    });
    $("companyForm")?.addEventListener("submit", saveCompany);

    $("createCategoryBtn")?.addEventListener("click", openCategoryModal);
    $("closeCategoryModalBtn")?.addEventListener("click", closeCategoryModal);
    $("cancelCategoryBtn")?.addEventListener("click", closeCategoryModal);
    $("categoryModal")?.addEventListener("click", event => {
        if (event.target === $("categoryModal")) closeCategoryModal();
    });
    $("categoryForm")?.addEventListener("submit", saveCategory);

    $("manageCompaniesBtn")?.addEventListener("click", openCompanyManager);
    $("closeCompanyManagerBtn")?.addEventListener("click", closeCompanyManager);
    $("companyManagerModal")?.addEventListener("click", event => {
        if (event.target === $("companyManagerModal")) closeCompanyManager();
    });
    $("companyManagerSearch")?.addEventListener("input", renderCompaniesManager);
    $("companiesManagerList")?.addEventListener("click", handleCompanyManagerAction);

    $("manageCategoriesBtn")?.addEventListener("click", openCategoryManager);
    $("closeCategoryManagerBtn")?.addEventListener("click", closeCategoryManager);
    $("categoryManagerModal")?.addEventListener("click", event => {
        if (event.target === $("categoryManagerModal")) closeCategoryManager();
    });
    $("categoryManagerSearch")?.addEventListener("input", renderCategoriesManager);
    $("categoriesManagerList")?.addEventListener("click", handleCategoryManagerAction);

    $("searchInput")?.addEventListener("input", renderTable);
    $("statusFilter")?.addEventListener("change", renderTable);
    $("categoryFilter")?.addEventListener("change", renderTable);

    $("logoutBtn")?.addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        window.location.href = "../pages/auth/login.html";
    });

    $("mobileMenuBtn")?.addEventListener("click", () => {
        const sidebar = $("sidebar");
        const overlay = $("sidebarOverlay");
        const isOpen = sidebar?.classList.contains("mobile-open") || sidebar?.classList.contains("open");
        sidebar?.classList.toggle("open", !isOpen);
        sidebar?.classList.toggle("mobile-open", !isOpen);
        sidebar?.classList.toggle("translate-x-0", !isOpen);
        sidebar?.classList.toggle("-translate-x-full", isOpen);
        overlay?.classList.toggle("hidden", isOpen);
        document.body.classList.toggle("overflow-hidden", !isOpen);
    });
}


// ==========================================
// LOAD COMPANIES
// ==========================================

async function loadCompanies(selectedId = "") {
    const select = $("companyName");
    if (select) select.disabled = true;
    if ($("companyLoadMessage")) $("companyLoadMessage").textContent = "";

    try {
        const { data, error } = await supabaseClient
            .from("companies")
            .select("id, name, logo_url, website_url, description, location")
            .order("name", { ascending: true });

        if (error) throw error;

        companies = data || [];
        setCompanyOptions(selectedId || select?.value || "");
        return true;
    } catch (error) {
        console.error("Load companies error:", error);
        companies = [];
        setCompanyOptions();
        if ($("companyLoadMessage")) {
            $("companyLoadMessage").textContent = "Companies could not be loaded. Please try again.";
        }
        return false;
    } finally {
        if (select) select.disabled = false;
    }
}

function setCompanyOptions(selectedId = "") {
    const select = $("companyName");
    if (!select) return;

    const placeholder = companies.length ? "Select company" : "No companies available";
    select.innerHTML = `<option value="">${placeholder}</option>` +
        companies.map(company =>
            `<option value="${escapeHtml(company.id)}" ${String(company.id) === String(selectedId) ? "selected" : ""}>${escapeHtml(company.name)}</option>`
        ).join("");

    $("companyId").value = select.value || "";
}

async function loadCategories(selectedId = "") {
    const select = $("category");
    if (select) select.disabled = true;
    if ($("categoryLoadMessage")) $("categoryLoadMessage").textContent = "";

    try {
        const { data, error } = await supabaseClient
            .from("categories")
            .select("id, name, slug, icon")
            .order("name", { ascending: true });

        if (error) throw error;

        categories = data || [];
        setCategoryOptions(selectedId || select?.value || "");
        populateCategoryFilter();
        return true;
    } catch (error) {
        console.error("Load categories error:", error);
        categories = [];
        setCategoryOptions();
        if ($("categoryLoadMessage")) {
            $("categoryLoadMessage").textContent = "Categories could not be loaded. Please try again.";
        }
        return false;
    } finally {
        if (select) select.disabled = false;
    }
}

function setCategoryOptions(selectedId = "") {
    const select = $("category");
    if (!select) return;

    const placeholder = categories.length ? "Select category" : "No categories available";
    select.innerHTML = `<option value="">${placeholder}</option>` +
        categories.map(category =>
            `<option value="${escapeHtml(category.id)}" ${String(category.id) === String(selectedId) ? "selected" : ""}>${escapeHtml(category.name)}</option>`
        ).join("");
}

// ==========================================
// LOAD INTERNSHIPS
// ==========================================

async function loadInternships() {
    let result;
    try {
        result = await supabaseClient
            .from("internships")
            .select(`
                id, title, company_id, category_id, location, work_type, duration,
                description, requirements, deadline, application_url, source_name,
                source_url, status, created_at, updated_at, company_name,
                internship_type, skills
            `)
            .order("created_at", { ascending: false });
    } catch (error) {
        result = { data: null, error };
    }

    const { data, error } = result || {};


    if (error) {

        console.error(
            "Load internships error:",
            error
        );


        $("internshipTableBody").innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    Could not load internships.
                    <br>
                    <small>
                        ${escapeHtml(error.message)}
                    </small>
                </td>
            </tr>
        `;

        return;
    }


    internships = data || [];


    updateStats();

    populateCategoryFilter();

    renderTable();
}


// ==========================================
// STATISTICS
// ==========================================

function updateStats() {

    const total =
        internships.length;


    const active =
        internships.filter(
            item =>
                item.status === "active"
        ).length;


    const drafts =
        internships.filter(
            item =>
                item.status === "draft"
        ).length;


    const companies = new Set(internships.map(item =>
        item.company_id !== null && item.company_id !== undefined
            ? `id:${item.company_id}`
            : `name:${(item.company_name || "").trim().toLowerCase()}`
    ).filter(value => value !== "name:"));


    $("totalCount").textContent =
        total;

    $("activeCount").textContent =
        active;

    $("draftCount").textContent =
        drafts;

    $("companyCount").textContent =
        companies.size;
}


// ==========================================
// CATEGORY FILTER
// ==========================================

function populateCategoryFilter() {
    $("categoryFilter").innerHTML =
        `<option value="all">
            All Categories
        </option>` +
        categories
            .map(category => `
                <option value="${escapeHtml(category.id)}">
                    ${escapeHtml(category.name)}
                </option>
            `)
            .join("");
}

function getCategoryName(categoryId) {
    return categories.find(category => String(category.id) === String(categoryId))?.name || "—";
}

function getCompanyName(internship) {
    const company = companies.find(item => String(item.id) === String(internship.company_id));
    return company?.name || internship.company_name || (internship.company_id ? `Company #${internship.company_id}` : "—");
}


// ==========================================
// FILTER
// ==========================================

function getFilteredInternships() {

    const search =
        $("searchInput")
            .value
            .trim()
            .toLowerCase();


    const status =
        $("statusFilter").value;


    const category =
        $("categoryFilter").value;


    return internships.filter(
        item => {

            const searchable = [

                item.title,

                getCompanyName(item),

                item.location,

                item.work_type,

                item.internship_type,

                item.duration,

                item.skills,

                getCategoryName(item.category_id)

            ]

                .filter(Boolean)

                .join(" ")

                .toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(search);


            const matchesStatus =
                status === "all" ||
                item.status === status;


            const matchesCategory =
                category === "all" ||
                String(item.category_id) ===
                String(category);


            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        }
    );
}


// ==========================================
// RENDER TABLE
// ==========================================

function renderTable() {

    const rows =
        getFilteredInternships();


    if (!rows.length) {

        $("internshipTableBody").innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    No internships found.
                </td>
            </tr>
        `;

        return;
    }


    $("internshipTableBody").innerHTML =

        rows

            .map(
                item => `

                <tr>

                    <!-- TITLE -->

                    <td>

                        <div class="table-main-text">

                            ${escapeHtml(
                                item.title
                            )}

                        </div>

                        <div class="table-sub-text">

                            ${escapeHtml(
                                item.location ||
                                "Location not specified"
                            )}

                        </div>

                    </td>


                    <!-- COMPANY -->

                    <td>

                        ${escapeHtml(getCompanyName(item))}

                    </td>


                    <!-- CATEGORY -->

                    <td>
                        ${escapeHtml(getCategoryName(item.category_id))}
                    </td>


                    <!-- TYPE -->

                    <td>

                        ${escapeHtml(
                            item.internship_type ||
                            item.work_type ||
                            "Internship"
                        )}

                    </td>


                    <!-- DEADLINE -->

                    <td>

                        ${formatDate(
                            item.deadline
                        )}

                    </td>


                    <!-- STATUS -->

                    <td>

                        <span
                            class="
                                status-badge
                                status-${escapeHtml(
                                    item.status || "active"
                                )}
                            "
                        >

                            ${capitalize(
                                item.status || "active"
                            )}

                        </span>

                    </td>


                    <!-- ACTIONS -->

                    <td>

                        <div class="table-actions">

                            <button
                                class="icon-action"
                                title="Edit"
                                onclick="
                                    editInternship(
                                        '${item.id}'
                                    )
                                "
                            >

                                <i
                                    data-lucide="pencil"
                                ></i>

                            </button>


                            <button
                                class="
                                    icon-action
                                    danger
                                "
                                data-delete-internship="${escapeHtml(item.id)}"
                                title="Delete"
                                onclick="
                                    deleteInternship(
                                        '${item.id}'
                                    )
                                "
                            >

                                <i
                                    data-lucide="trash-2"
                                ></i>

                            </button>

                        </div>

                    </td>

                </tr>

            `
            )

            .join("");


    lucide.createIcons();
}


// ==========================================
// OPEN ADD MODAL
// ==========================================

function openAddModal() {

    editingId = null;


    $("modalTitle").textContent =
        "Add Internship";


    $("internshipForm").reset();


    $("internshipId").value = "";
    $("companyId").value = "";
    setCompanyOptions();
    setCategoryOptions();


    $("status").value =
        "pending";


    $("formMessage").textContent =
        "";


    $("internshipModal").classList.remove("hidden");
    $("internshipModal").classList.add("flex");
    document.body.classList.add("overflow-hidden");
}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    $("internshipModal").classList.add("hidden");
    $("internshipModal").classList.remove("flex");
    document.body.classList.remove("overflow-hidden");


    $("formMessage").textContent =
        "";
}

function openCompanyModal(company = null) {
    editingCompanyId = company?.id ?? null;
    $("companyForm").reset();
    $("companyFormMessage").textContent = "";
    $("companyModalTitle").textContent = editingCompanyId ? "Edit Company" : "Add New Company";
    $("saveCompanyBtn").textContent = editingCompanyId ? "Save Changes" : "Add Company";
    if (company) {
        $("newCompanyName").value = company.name || "";
        $("newCompanyWebsite").value = company.website_url || "";
        $("newCompanyLogoUrl").value = company.logo_url || "";
        $("newCompanyLocation").value = company.location || "";
        $("newCompanyDescription").value = company.description || "";
    }
    $("companyModal").classList.remove("hidden");
    $("companyModal").classList.add("flex");
    $("newCompanyName").focus();
    lucide.createIcons();
}

function closeCompanyModal() {
    $("companyModal").classList.add("hidden");
    $("companyModal").classList.remove("flex");
    editingCompanyId = null;
    $("companyModalTitle").textContent = "Add New Company";
    $("saveCompanyBtn").textContent = "Add Company";
}

function openCategoryModal(category = null) {
    editingCategoryId = category?.id ?? null;
    $("categoryForm").reset();
    $("categoryFormMessage").textContent = "";
    $("categoryModalTitle").textContent = editingCategoryId ? "Edit Category" : "Add New Category";
    $("saveCategoryBtn").textContent = editingCategoryId ? "Save Changes" : "Add Category";
    if (category) $("newCategoryName").value = category.name || "";
    $("categoryModal").classList.remove("hidden");
    $("categoryModal").classList.add("flex");
    $("newCategoryName").focus();
    lucide.createIcons();
}

function closeCategoryModal() {
    $("categoryModal").classList.add("hidden");
    $("categoryModal").classList.remove("flex");
    editingCategoryId = null;
    $("categoryModalTitle").textContent = "Add New Category";
    $("saveCategoryBtn").textContent = "Add Category";
}

async function saveCompany(event) {
    event.preventDefault();
    const message = $("companyFormMessage");
    const button = $("saveCompanyBtn");
    const companyId = editingCompanyId;
    const wasEditing = companyId !== null;
    const name = $("newCompanyName").value.trim();
    const website = $("newCompanyWebsite").value.trim();
    const logoUrl = $("newCompanyLogoUrl").value.trim();

    message.textContent = "";
    if (!name) {
        message.textContent = "Company name is required.";
        $("newCompanyName").focus();
        return;
    }
    if (!isValidHttpUrl(website) || !isValidHttpUrl(logoUrl)) {
        message.textContent = "Enter valid website and logo URLs beginning with http:// or https://.";
        return;
    }

    button.disabled = true;
    button.textContent = wasEditing ? "Saving..." : "Adding...";

    try {
        const { data: existingCompanies, error: lookupError } = await supabaseClient
            .from("companies")
            .select("id, name");
        if (lookupError) throw lookupError;

        const duplicate = existingCompanies.find(company =>
            String(company.id) !== String(companyId) &&
            company.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase()
        );
        if (duplicate) {
            await loadCompanies(duplicate.id);
            message.textContent = "Company already exists. Please select it from the company list.";
            return;
        }

        const payload = {
            name,
            website_url: website || null,
            logo_url: logoUrl || null,
            description: $("newCompanyDescription").value.trim() || null,
            location: $("newCompanyLocation").value.trim() || null
        };
        let request = supabaseClient.from("companies");
        if (wasEditing) request = request.update(payload).eq("id", companyId);
        else request = request.insert(payload);

        const { data: company, error } = await request
            .select("id, name, logo_url, website_url, description, location")
            .single();
        if (error) throw error;

        companies = [...companies.filter(item => String(item.id) !== String(company.id)), company]
            .sort((left, right) => left.name.localeCompare(right.name));
        setCompanyOptions(company.id);
        renderCompaniesManager();
        renderTable();
        updateStats();
        closeCompanyModal();
        showToast(wasEditing ? "Company updated successfully." : "Company added successfully.");
    } catch (error) {
        console.error("Create company error:", error);
        message.textContent = formatSupabaseError("Company could not be saved", error);
    } finally {
        button.disabled = false;
        button.textContent = wasEditing ? "Save Changes" : "Add Company";
    }
}

async function saveCategory(event) {
    event.preventDefault();
    const message = $("categoryFormMessage");
    const button = $("saveCategoryBtn");
    const categoryId = editingCategoryId;
    const wasEditing = categoryId !== null;
    const name = $("newCategoryName").value.trim();

    message.textContent = "";
    if (!name) {
        message.textContent = "Category name is required.";
        $("newCategoryName").focus();
        return;
    }

    button.disabled = true;
    button.textContent = wasEditing ? "Saving..." : "Adding...";

    try {
        const { data: existingCategories, error: lookupError } = await supabaseClient
            .from("categories")
            .select("id, name, slug, icon");
        if (lookupError) throw lookupError;

        const duplicate = existingCategories.find(category =>
            String(category.id) !== String(categoryId) &&
            category.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase()
        );
        if (duplicate) {
            await loadCategories(duplicate.id);
            message.textContent = "Category already exists. Please select it from the category list.";
            return;
        }

        const existingCategory = existingCategories.find(item => String(item.id) === String(categoryId));
        const slug = createCategorySlug(name, existingCategories.filter(item => String(item.id) !== String(categoryId)));
        const payload = { name, slug, icon: existingCategory?.icon || "tag" };
        let request = supabaseClient.from("categories");
        if (wasEditing) request = request.update(payload).eq("id", categoryId);
        else request = request.insert(payload);

        const { data: category, error } = await request
            .select("id, name, slug, icon")
            .single();
        if (error) throw error;

        categories = [...categories.filter(item => String(item.id) !== String(category.id)), category]
            .sort((left, right) => left.name.localeCompare(right.name));
        setCategoryOptions(category.id);
        populateCategoryFilter();
        renderCategoriesManager();
        renderTable();
        closeCategoryModal();
        showToast(wasEditing ? "Category updated successfully." : "Category added successfully.");
    } catch (error) {
        console.error("Create category error:", error);
        message.textContent = formatSupabaseError("Category could not be saved", error);
    } finally {
        button.disabled = false;
        button.textContent = wasEditing ? "Save Changes" : "Add Category";
    }
}

function createCategorySlug(name, existingCategories) {
    const base = name.toLocaleLowerCase().normalize("NFKC")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-|-$/g, "") || "category";
    const usedSlugs = new Set(existingCategories.map(category => category.slug?.toLocaleLowerCase()));
    let slug = base;
    let suffix = 2;
    while (usedSlugs.has(slug.toLocaleLowerCase())) {
        slug = `${base}-${suffix++}`;
    }
    return slug;
}

function isValidHttpUrl(value) {
    if (!value) return true;
    try {
        return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
        return false;
    }
}

function showToast(text) {
    const toast = $("adminToast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.remove("hidden");
    window.clearTimeout(Number(toast.dataset.timeout));
    toast.dataset.timeout = String(window.setTimeout(() => toast.classList.add("hidden"), 3500));
}

function openCompanyManager() {
    $("companyManagerSearch").value = "";
    $("companyManagerMessage").textContent = "";
    renderCompaniesManager();
    $("companyManagerModal").classList.remove("hidden");
    $("companyManagerModal").classList.add("flex");
    lucide.createIcons();
}

function closeCompanyManager() {
    $("companyManagerModal").classList.add("hidden");
    $("companyManagerModal").classList.remove("flex");
}

function renderCompaniesManager() {
    const search = $("companyManagerSearch").value.trim().toLocaleLowerCase();
    const rows = companies.filter(company =>
        [company.name, company.website_url, company.location].filter(Boolean).join(" ").toLocaleLowerCase().includes(search)
    );

    $("companiesManagerList").innerHTML = rows.length
        ? rows.map(company => `
            <div class="flex items-center justify-between gap-3 py-3">
                <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-slate-800">${escapeHtml(company.name)}</p>
                    <p class="truncate text-[11px] text-slate-500">${escapeHtml(company.location || company.website_url || "No additional details")}</p>
                </div>
                <div class="flex shrink-0 items-center gap-1">
                    <button type="button" data-edit-company="${escapeHtml(company.id)}" class="grid h-9 w-9 place-items-center rounded-lg border border-ig-border text-slate-600 hover:bg-slate-50" aria-label="Edit ${escapeHtml(company.name)}"><i data-lucide="pencil" class="h-4 w-4"></i></button>
                    <button type="button" data-delete-company="${escapeHtml(company.id)}" class="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Delete ${escapeHtml(company.name)}"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
                </div>
            </div>
        `).join("")
        : '<p class="py-5 text-center text-xs text-slate-500">No companies found.</p>';
    lucide.createIcons();
}

function handleCompanyManagerAction(event) {
    const button = event.target.closest("button[data-edit-company], button[data-delete-company]");
    if (!button) return;
    if (button.dataset.editCompany) openCompanyModal(companies.find(company => String(company.id) === button.dataset.editCompany));
    else deleteCompany(button.dataset.deleteCompany, button);
}

async function deleteCompany(id, button) {
    const company = companies.find(item => String(item.id) === String(id));
    if (!company) return;
    $("companyManagerMessage").textContent = "";
    button.disabled = true;

    try {
        const { data: linkedInternships, error: usageError } = await supabaseClient
            .from("internships")
            .select("id")
            .eq("company_id", id);
        if (usageError) throw usageError;

        const usageCount = linkedInternships?.length || 0;
        if (usageCount) {
            $("companyManagerMessage").textContent = `This company is currently used by ${usageCount} internships and cannot be deleted.`;
            return;
        }
        if (!confirm(`Delete company "${company.name}"?`)) return;

        const { error } = await supabaseClient.from("companies").delete().eq("id", id);
        if (error) throw error;

        const selectedId = $("companyName").value;
        companies = companies.filter(item => String(item.id) !== String(id));
        setCompanyOptions(String(selectedId) === String(id) ? "" : selectedId);
        renderCompaniesManager();
        renderTable();
        updateStats();
        showToast("Company deleted successfully.");
    } catch (error) {
        console.error("Delete company error:", error);
        $("companyManagerMessage").textContent = "Company could not be deleted. Please try again.";
    } finally {
        button.disabled = false;
    }
}

function openCategoryManager() {
    $("categoryManagerSearch").value = "";
    $("categoryManagerMessage").textContent = "";
    renderCategoriesManager();
    $("categoryManagerModal").classList.remove("hidden");
    $("categoryManagerModal").classList.add("flex");
    lucide.createIcons();
}

function closeCategoryManager() {
    $("categoryManagerModal").classList.add("hidden");
    $("categoryManagerModal").classList.remove("flex");
}

function renderCategoriesManager() {
    const search = $("categoryManagerSearch").value.trim().toLocaleLowerCase();
    const rows = categories.filter(category =>
        [category.name, category.slug].filter(Boolean).join(" ").toLocaleLowerCase().includes(search)
    );

    $("categoriesManagerList").innerHTML = rows.length
        ? rows.map(category => `
            <div class="flex items-center justify-between gap-3 py-3">
                <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-slate-800">${escapeHtml(category.name)}</p>
                    <p class="truncate text-[11px] text-slate-500">${escapeHtml(category.slug || "")}</p>
                </div>
                <div class="flex shrink-0 items-center gap-1">
                    <button type="button" data-edit-category="${escapeHtml(category.id)}" class="grid h-9 w-9 place-items-center rounded-lg border border-ig-border text-slate-600 hover:bg-slate-50" aria-label="Edit ${escapeHtml(category.name)}"><i data-lucide="pencil" class="h-4 w-4"></i></button>
                    <button type="button" data-delete-category="${escapeHtml(category.id)}" class="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Delete ${escapeHtml(category.name)}"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
                </div>
            </div>
        `).join("")
        : '<p class="py-5 text-center text-xs text-slate-500">No categories found.</p>';
    lucide.createIcons();
}

function handleCategoryManagerAction(event) {
    const button = event.target.closest("button[data-edit-category], button[data-delete-category]");
    if (!button) return;
    if (button.dataset.editCategory) openCategoryModal(categories.find(category => String(category.id) === button.dataset.editCategory));
    else deleteCategory(button.dataset.deleteCategory, button);
}

async function deleteCategory(id, button) {
    const category = categories.find(item => String(item.id) === String(id));
    if (!category) return;
    $("categoryManagerMessage").textContent = "";
    button.disabled = true;

    try {
        const { data: linkedInternships, error: usageError } = await supabaseClient
            .from("internships")
            .select("id")
            .eq("category_id", id);
        if (usageError) throw usageError;

        const usageCount = linkedInternships?.length || 0;
        if (usageCount) {
            $("categoryManagerMessage").textContent = `This category is currently used by ${usageCount} internships and cannot be deleted.`;
            return;
        }
        if (!confirm(`Delete category "${category.name}"?`)) return;

        const { error } = await supabaseClient.from("categories").delete().eq("id", id);
        if (error) throw error;

        const selectedId = $("category").value;
        categories = categories.filter(item => String(item.id) !== String(id));
        setCategoryOptions(String(selectedId) === String(id) ? "" : selectedId);
        populateCategoryFilter();
        renderCategoriesManager();
        renderTable();
        showToast("Category deleted successfully.");
    } catch (error) {
        console.error("Delete category error:", error);
        $("categoryManagerMessage").textContent = "Category could not be deleted. Please try again.";
    } finally {
        button.disabled = false;
    }
}


// ==========================================
// EDIT INTERNSHIP
// ==========================================

window.editInternship =
    function (id) {

        const item =
            internships.find(
                internship =>
                    String(internship.id) ===
                    String(id)
            );


        if (!item) return;


        editingId = id;


        $("modalTitle").textContent =
            "Edit Internship";


        $("internshipId").value =
            item.id;


        $("title").value =
            item.title || "";


        const matchingCompany = companies.find(company =>
            String(company.id) === String(item.company_id) ||
            String(company.name).trim().toLowerCase() === String(item.company_name || "").trim().toLowerCase()
        );

        setCompanyOptions(matchingCompany?.id ?? item.company_id ?? "");


        $("location").value =
            item.location || "";


        $("internshipType").value =
            item.internship_type ||
            "Internship";


        setCategoryOptions(item.category_id || "");


        $("deadline").value =
            item.deadline || "";


        $("status").value =
            item.status || "active";


        $("applicationUrl").value =
            item.application_url || "";


        $("description").value =
            item.description || "";


        $("requirements").value =
            item.requirements || "";


        $("skills").value =
            item.skills || "";


        $("formMessage").textContent =
            "";


        $("internshipModal").classList.remove("hidden");
        $("internshipModal").classList.add("flex");
        document.body.classList.add("overflow-hidden");
    };


// ==========================================
// SAVE INTERNSHIP
// ==========================================

async function saveInternship(event) {
    event.preventDefault();

    const companyId = Number($("companyName").value);
    const selectedCompany = companies.find(company => String(company.id) === String(companyId));
    if (!Number.isInteger(companyId) || !selectedCompany) {
        $("formMessage").textContent = "Please select a company.";
        $("companyName").focus();
        return;
    }

    const categoryId = Number($("category").value);
    const selectedCategory = categories.find(category => String(category.id) === String(categoryId));
    if (!Number.isInteger(categoryId) || !selectedCategory) {
        $("formMessage").textContent = "Please select a category.";
        $("category").focus();
        return;
    }

    const payload = {
        title: $("title").value.trim(),
        company_id: companyId,
        company_name: selectedCompany.name,
        location: $("location").value.trim() || null,
        internship_type: $("internshipType").value || null,
        category_id: categoryId,
        work_type: $("internshipType").value || null,
        deadline: $("deadline").value || null,
        status: $("status").value,
        application_url: $("applicationUrl").value.trim() || null,
        description: $("description").value.trim() || null,
        requirements: $("requirements").value.trim() || null,
        skills: $("skills").value.trim() || null
    };

    if (!payload.title) {
        $("formMessage").textContent = "Internship title is required.";
        $("title").focus();
        return;
    }

    const saveButton = $("saveBtn");
    const wasEditing = Boolean(editingId);
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        let request = supabaseClient.from("internships");
        if (editingId) request = request.update(payload).eq("id", editingId);
        else request = request.insert(payload);

        const { error } = await request;
        if (error) throw error;

        closeModal();
        await loadInternships();
        showToast(wasEditing ? "Internship updated successfully." : "Internship added successfully.");
    } catch (error) {
        console.error("Save internship error:", error);
        $("formMessage").textContent = "Internship could not be saved. Please check the required fields and try again.";
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i data-lucide="save" class="h-4 w-4"></i>Save Internship';
        lucide.createIcons();
    }
}


// ==========================================
// DELETE
// ==========================================

window.deleteInternship = async function (id) {
    const item = internships.find(internship => String(internship.id) === String(id));
    if (!item) return;
    if (!confirm("Are you sure you want to delete this internship?")) return;

    const button = [...document.querySelectorAll("[data-delete-internship]")]
        .find(candidate => candidate.dataset.deleteInternship === String(id));
    if (button) button.disabled = true;

    try {
        const { error } = await supabaseClient
            .from("internships")
            .delete()
            .eq("id", id);
        if (error) throw error;

        await loadInternships();
        showToast("Internship deleted successfully.");
    } catch (error) {
        console.error("Delete internship error:", error);
        showToast("Internship could not be deleted. Please try again.");
        if (button) button.disabled = false;
    }
};


// ==========================================
// DATE
// ==========================================

function formatDate(value) {

    if (!value) return "—";


    const date =
        new Date(
            value + "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


// ==========================================
// CAPITALIZE
// ==========================================

function capitalize(value) {

    if (!value) return "";


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}

function formatSupabaseError(action, error) {
    const detail = error?.message || error?.details || error?.hint || "Please try again.";
    if (/row-level security|violates row-level security/i.test(detail)) {
        return `${action}: Supabase rejected this request because of row-level security. Details: ${detail}`;
    }
    return `${action}: ${detail}`;
}