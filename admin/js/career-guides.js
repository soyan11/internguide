let careerGuides = [];
let editingId = null;

const $ = (id) => document.getElementById(id);


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const admin =
            await requireAdmin();

        if (!admin) return;

        setupEvents();

        await loadCareerGuides();
    }
);


// ==========================================
// EVENTS
// ==========================================

function setupEvents() {

    $("addGuideBtn")?.addEventListener(
        "click",
        openAddModal
    );


    $("closeModalBtn")?.addEventListener(
        "click",
        closeModal
    );


    $("cancelBtn")?.addEventListener(
        "click",
        closeModal
    );


    $("guideForm")?.addEventListener(
        "submit",
        saveCareerGuide
    );


    $("searchInput")?.addEventListener(
        "input",
        renderTable
    );


    $("statusFilter")?.addEventListener(
        "change",
        renderTable
    );


    $("categoryFilter")?.addEventListener(
        "change",
        renderTable
    );


    $("logoutBtn")?.addEventListener(
        "click",
        async () => {

            await supabaseClient
                .auth
                .signOut();

            window.location.href =
                "../pages/auth/login.html";
        }
    );


    $("mobileMenuBtn")?.addEventListener(
        "click",
        () => {

            $("adminSidebar")
                ?.classList
                .toggle("open");

        }
    );
}


// ==========================================
// LOAD DATA
// ==========================================

async function loadCareerGuides() {

    const {
        data,
        error
    } = await supabaseClient

        .from("career_guides")

        .select(`
            id,
            title,
            category,
            description,
            skills,
            qualifications,
            career_path,
            related_internships,
            content,
            status,
            created_at,
            updated_at
        `)

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Career guides error:",
            error
        );


        $("guideTableBody").innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="empty-state"
                >

                    Could not load career guides.

                    <br>

                    <small>
                        ${escapeHtml(
                            error.message
                        )}
                    </small>

                </td>

            </tr>
        `;

        return;
    }


    careerGuides =
        data || [];


    updateStats();

    populateCategoryFilter();

    renderTable();
}


// ==========================================
// STATISTICS
// ==========================================

function updateStats() {

    const total =
        careerGuides.length;


    const published =
        careerGuides.filter(
            item =>
                item.status ===
                "published"
        ).length;


    const drafts =
        careerGuides.filter(
            item =>
                item.status ===
                "draft"
        ).length;


    const categories =
        new Set(

            careerGuides

                .map(
                    item =>
                        (
                            item.category ||
                            ""
                        )
                        .trim()
                        .toLowerCase()
                )

                .filter(Boolean)

        );


    $("totalCount").textContent =
        total;


    $("publishedCount").textContent =
        published;


    $("draftCount").textContent =
        drafts;


    $("categoryCount").textContent =
        categories.size;
}


// ==========================================
// CATEGORY FILTER
// ==========================================

function populateCategoryFilter() {

    const categories = [

        ...new Set(

            careerGuides

                .map(
                    item =>
                        item.category
                )

                .filter(Boolean)

                .map(
                    category =>
                        category.trim()
                )

        )

    ].sort();


    $("categoryFilter").innerHTML =

        `<option value="all">
            All Categories
        </option>` +

        categories

            .map(
                category => `

                    <option
                        value="${escapeHtml(
                            category
                        )}"
                    >

                        ${escapeHtml(
                            category
                        )}

                    </option>

                `
            )

            .join("");
}


// ==========================================
// FILTER
// ==========================================

function getFilteredGuides() {

    const search =
        $("searchInput")
            .value
            .trim()
            .toLowerCase();


    const status =
        $("statusFilter")
            .value;


    const category =
        $("categoryFilter")
            .value;


    return careerGuides.filter(
        item => {

            const searchable = [

                item.title,

                item.category,

                item.description,

                item.skills,

                item.qualifications,

                item.career_path

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
                item.category === category;


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
        getFilteredGuides();


    if (!rows.length) {

        $("guideTableBody").innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="empty-state"
                >
                    No career guides found.
                </td>

            </tr>
        `;

        return;
    }


    $("guideTableBody").innerHTML =

        rows

            .map(
                item => `

                <tr>


                    <!-- TITLE -->

                    <td>

                        <div
                            class="table-main-text"
                        >

                            ${escapeHtml(
                                item.title
                            )}

                        </div>

                        <div
                            class="table-sub-text"
                        >

                            ${escapeHtml(
                                item.description
                                    ? item.description
                                        .substring(0, 70) +
                                      (
                                        item.description.length > 70
                                            ? "..."
                                            : ""
                                      )
                                    : "No description"
                            )}

                        </div>

                    </td>


                    <!-- CATEGORY -->

                    <td>

                        ${escapeHtml(
                            item.category ||
                            "—"
                        )}

                    </td>


                    <!-- SKILLS -->

                    <td>

                        ${escapeHtml(
                            item.skills ||
                            "—"
                        )}

                    </td>


                    <!-- CAREER PATH -->

                    <td>

                        ${escapeHtml(
                            item.career_path ||
                            "—"
                        )}

                    </td>


                    <!-- STATUS -->

                    <td>

                        <span
                            class="
                                status-badge
                                status-${escapeHtml(
                                    item.status
                                )}
                            "
                        >

                            ${capitalize(
                                item.status
                            )}

                        </span>

                    </td>


                    <!-- CREATED -->

                    <td>

                        ${formatDate(
                            item.created_at
                        )}

                    </td>


                    <!-- ACTIONS -->

                    <td>

                        <div
                            class="table-actions"
                        >

                            <button
                                class="icon-action"
                                title="Edit"
                                onclick="
                                    editCareerGuide(
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
                                title="Delete"
                                onclick="
                                    deleteCareerGuide(
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
// ADD
// ==========================================

function openAddModal() {

    editingId = null;


    $("modalTitle").textContent =
        "Add Career Guide";


    $("guideForm").reset();


    $("guideId").value = "";


    $("status").value =
        "draft";


    $("formMessage").textContent =
        "";


    $("guideModal")
        .classList
        .remove("hidden");

    $("guideModal")
        .classList
        .add("flex");
}


// ==========================================
// CLOSE
// ==========================================

function closeModal() {

    $("guideModal")
        .classList
        .remove("flex");

    $("guideModal")
        .classList
        .add("hidden");


    $("formMessage").textContent =
        "";
}


// ==========================================
// EDIT
// ==========================================

window.editCareerGuide =
    function (id) {

        const item =
            careerGuides.find(
                guide =>
                    String(guide.id) ===
                    String(id)
            );


        if (!item) return;


        editingId = id;


        $("modalTitle").textContent =
            "Edit Career Guide";


        $("guideId").value =
            item.id;


        $("title").value =
            item.title || "";


        $("category").value =
            item.category || "";


        $("skills").value =
            item.skills || "";


        $("status").value =
            item.status || "draft";


        $("description").value =
            item.description || "";


        $("qualifications").value =
            item.qualifications || "";


        $("careerPath").value =
            item.career_path || "";


        $("relatedInternships").value =
            item.related_internships || "";


        $("content").value =
            item.content || "";


        $("formMessage").textContent =
            "";


        $("guideModal")
            .classList
            .remove("hidden");

        $("guideModal")
            .classList
            .add("flex");
    };


// ==========================================
// SAVE
// ==========================================

async function saveCareerGuide(event) {

    event.preventDefault();


    const payload = {

        title:
            $("title")
                .value
                .trim(),


        category:
            $("category")
                .value
                .trim() || null,


        description:
            $("description")
                .value
                .trim() || null,


        skills:
            $("skills")
                .value
                .trim() || null,


        qualifications:
            $("qualifications")
                .value
                .trim() || null,


        career_path:
            $("careerPath")
                .value
                .trim() || null,


        related_internships:
            $("relatedInternships")
                .value
                .trim() || null,


        content:
            $("content")
                .value
                .trim() || null,


        status:
            $("status")
                .value
    };


    if (!payload.title) {

        $("formMessage").textContent =
            "Career guide title is required.";

        return;
    }


    const saveButton =
        $("saveBtn");


    saveButton.disabled =
        true;


    saveButton.textContent =
        "Saving...";


    let result;


    // UPDATE

    if (editingId) {

        result =
            await supabaseClient

                .from("career_guides")

                .update(payload)

                .eq(
                    "id",
                    editingId
                );

    }


    // INSERT

    else {

        result =
            await supabaseClient

                .from("career_guides")

                .insert(payload);
    }


    saveButton.disabled =
        false;


    saveButton.innerHTML = `
        <i data-lucide="save"></i>
        Save Career Guide
    `;


    lucide.createIcons();


    if (result.error) {

        console.error(
            "Save career guide error:",
            result.error
        );


        $("formMessage").textContent =
            result.error.message ||
            "Could not save career guide.";

        return;
    }


    closeModal();


    await loadCareerGuides();
}


// ==========================================
// DELETE
// ==========================================

window.deleteCareerGuide =
    async function (id) {

        const item =
            careerGuides.find(
                guide =>
                    String(guide.id) ===
                    String(id)
            );


        if (!item) return;


        const confirmed =
            confirm(
                `Delete "${item.title}"?\n\n` +
                `This action cannot be undone.`
            );


        if (!confirmed) return;


        const {
            error
        } = await supabaseClient

            .from("career_guides")

            .delete()

            .eq(
                "id",
                id
            );


        if (error) {

            console.error(
                "Delete career guide error:",
                error
            );


            alert(
                error.message ||
                "Could not delete career guide."
            );


            return;
        }


        await loadCareerGuides();
    };


// ==========================================
// DATE
// ==========================================

function formatDate(value) {

    if (!value) return "—";


    const date =
        new Date(value);


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