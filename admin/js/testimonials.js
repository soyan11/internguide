document.addEventListener("DOMContentLoaded", initializeTestimonialsAdmin);

async function initializeTestimonialsAdmin() {
    const adminSession = await requireAdmin();
    if (!adminSession) return;

    const tableBody = document.getElementById("testimonialAdminTableBody");
    const searchInput = document.getElementById("testimonialAdminSearch");
    const modal = document.getElementById("editTestimonialModal");
    const editForm = document.getElementById("editTestimonialForm");
    let testimonials = [];
    let activeStatus = "all";

    const translate = (key) => window.InternGuideI18n?.t(`testimonials.${key}`) || key;

    searchInput.addEventListener("input", renderTestimonials);
    document.querySelectorAll("[data-testimonial-status]").forEach((button) => {
        button.addEventListener("click", () => {
            activeStatus = button.dataset.testimonialStatus;
            document.querySelectorAll("[data-testimonial-status]").forEach((item) => {
                const active = item === button;
                item.setAttribute("aria-pressed", String(active));
                item.classList.toggle("bg-blue-600", active);
                item.classList.toggle("text-white", active);
                item.classList.toggle("border", !active);
                item.classList.toggle("border-slate-200", !active);
                item.classList.toggle("text-slate-600", !active);
            });
            renderTestimonials();
        });
    });

    tableBody.addEventListener("click", async (event) => {
        const retryButton = event.target.closest("[data-retry-testimonials-admin]");
        if (retryButton) {
            await loadTestimonials();
            return;
        }

        const actionButton = event.target.closest("[data-testimonial-action]");
        if (!actionButton || actionButton.disabled) return;
        const testimonial = testimonials.find((item) => String(item.id) === actionButton.dataset.testimonialId);
        if (!testimonial) return;

        const action = actionButton.dataset.testimonialAction;
        if (action === "edit") {
            openEditModal(testimonial);
        } else if (action === "approve" || action === "reject") {
            await updateStatus(testimonial.id, action === "approve" ? "approved" : "rejected");
        } else if (action === "delete") {
            await deleteTestimonial(testimonial.id);
        }
    });

    document.getElementById("closeTestimonialModal").addEventListener("click", closeEditModal);
    document.getElementById("cancelTestimonialEdit").addEventListener("click", closeEditModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeEditModal();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("show")) closeEditModal();
    });
    editForm.addEventListener("submit", saveTestimonial);

    window.addEventListener("internGuideLanguageChange", renderTestimonials);
    setupAdminSidebar();
    document.getElementById("logoutBtn").addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        window.location.href = "../pages/auth/login.html";
    });

    await loadTestimonials();

    async function loadTestimonials() {
        clearAdminError();
        tableBody.innerHTML = `<tr><td colspan="7" class="p-12 text-center text-sm text-slate-500">${escapeAdminHtml(translate("loading"))}</td></tr>`;

        try {
            const { data, error } = await supabaseClient
                .from("testimonials")
                .select("id, user_id, name, role, content, rating, status, created_at, updated_at")
                .order("created_at", { ascending: false });
            if (error) throw error;

            testimonials = data || [];
            updateStatistics();
            renderTestimonials();
        } catch (error) {
            console.error("Load Admin testimonials error:", error);
            tableBody.innerHTML = `
                <tr><td colspan="7" class="p-8 text-center">
                    <p class="text-sm text-rose-700">${escapeAdminHtml(translate("unableToLoad"))}</p>
                    <button type="button" data-retry-testimonials-admin class="mt-3 text-sm font-semibold text-blue-700 underline">${escapeAdminHtml(translate("tryAgain"))}</button>
                </td></tr>
            `;
        }
    }

    function updateStatistics() {
        document.getElementById("testimonialTotalCount").textContent = String(testimonials.length);
        document.getElementById("testimonialPendingCount").textContent = String(testimonials.filter((item) => item.status === "pending").length);
        document.getElementById("testimonialApprovedCount").textContent = String(testimonials.filter((item) => item.status === "approved").length);
        document.getElementById("testimonialRejectedCount").textContent = String(testimonials.filter((item) => item.status === "rejected").length);
    }

    function renderTestimonials() {
        const search = searchInput.value.trim().toLocaleLowerCase();
        const filtered = testimonials.filter((item) => {
            const matchesStatus = activeStatus === "all" || item.status === activeStatus;
            const searchable = [item.name, item.role, item.content].map((value) => String(value || "")).join(" ").toLocaleLowerCase();
            return matchesStatus && (!search || searchable.includes(search));
        });

        if (!filtered.length) {
            const emptyKey = activeStatus === "pending" ? "noPending"
                : activeStatus === "approved" ? "noApproved"
                    : "noTestimonials";
            tableBody.innerHTML = `<tr><td colspan="7" class="p-12 text-center text-sm text-slate-500">${escapeAdminHtml(translate(emptyKey))}</td></tr>`;
            return;
        }

        tableBody.innerHTML = filtered.map(renderTestimonialRow).join("");
    }

    function renderTestimonialRow(testimonial) {
        const rating = Math.max(0, Math.min(5, Math.round(Number(testimonial.rating) || 0)));
        const stars = `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;
        const submitted = testimonial.created_at
            ? new Date(testimonial.created_at).toLocaleDateString(window.InternGuideI18n?.getLanguage() === "km" ? "km-KH" : "en")
            : "—";
        const statusClass = testimonial.status === "approved" ? "bg-emerald-50 text-emerald-700"
            : testimonial.status === "rejected" ? "bg-rose-50 text-rose-700"
                : "bg-blue-50 text-blue-700";
        const actions = [
            testimonial.status !== "approved" ? actionButton("approve", testimonial, "approve", "bg-emerald-50 text-emerald-700 hover:bg-emerald-100") : "",
            testimonial.status !== "rejected" ? actionButton("reject", testimonial, "reject", "bg-amber-50 text-amber-700 hover:bg-amber-100") : "",
            actionButton("edit", testimonial, "edit", "bg-slate-100 text-slate-700 hover:bg-slate-200"),
            actionButton("delete", testimonial, "delete", "bg-rose-50 text-rose-700 hover:bg-rose-100")
        ].filter(Boolean).join("");

        return `
            <tr class="border-t border-slate-100 align-top">
                <td data-user-content class="max-w-45 px-4 py-4 font-semibold text-slate-900">${escapeAdminHtml(testimonial.name || "—")}</td>
                <td data-user-content class="max-w-47.5 px-4 py-4 text-slate-600">${escapeAdminHtml(testimonial.role || "—")}</td>
                <td class="max-w-90 px-4 py-4 text-slate-600"><p class="line-clamp-3 whitespace-pre-line" data-user-content>${escapeAdminHtml(testimonial.content || "")}</p></td>
                <td class="whitespace-nowrap px-4 py-4"><span class="text-amber-500" aria-label="${rating} / 5">${stars}</span><span class="ml-1 text-xs text-slate-500">${rating}/5</span></td>
                <td class="px-4 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}" data-i18n="testimonials.${escapeAdminHtml(testimonial.status)}">${escapeAdminHtml(translate(testimonial.status))}</span></td>
                <td class="whitespace-nowrap px-4 py-4 text-xs text-slate-500">${escapeAdminHtml(submitted)}</td>
                <td class="px-4 py-4"><div class="flex min-w-63.75 flex-wrap gap-1.5">${actions}</div></td>
            </tr>
        `;
    }

    function actionButton(action, testimonial, labelKey, colorClass) {
        return `<button type="button" data-testimonial-action="${action}" data-testimonial-id="${escapeAdminHtml(testimonial.id)}" class="rounded-md px-2.5 py-1.5 text-xs font-semibold ${colorClass}">${escapeAdminHtml(translate(labelKey))}</button>`;
    }

    async function updateStatus(id, status) {
        clearAdminMessage();
        try {
            const { error } = await supabaseClient
                .from("testimonials")
                .update({ status })
                .eq("id", id);
            if (error) throw error;
            await loadTestimonials();
            showAdminMessage(status === "approved" ? "approveSuccess" : "rejectSuccess", "success");
        } catch (error) {
            console.error(`Update testimonial status to ${status} error:`, error);
            showAdminMessage("actionError", "error");
        }
    }

    async function deleteTestimonial(id) {
        if (!window.confirm(translate("confirmDelete"))) return;
        clearAdminMessage();
        try {
            const { error } = await supabaseClient
                .from("testimonials")
                .delete()
                .eq("id", id);
            if (error) throw error;
            await loadTestimonials();
            showAdminMessage("deleteSuccess", "success");
        } catch (error) {
            console.error("Delete testimonial error:", error);
            showAdminMessage("deleteError", "error");
        }
    }

    function openEditModal(testimonial) {
        document.getElementById("editTestimonialId").value = testimonial.id;
        document.getElementById("editTestimonialName").value = testimonial.name || "";
        document.getElementById("editTestimonialRole").value = testimonial.role || "";
        document.getElementById("editTestimonialContent").value = testimonial.content || "";
        document.getElementById("editTestimonialRating").value = String(testimonial.rating || 5);
        document.getElementById("editTestimonialStatus").value = testimonial.status || "pending";
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("overflow-hidden");
        document.getElementById("editTestimonialName").focus();
    }

    function closeEditModal() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("overflow-hidden");
    }

    async function saveTestimonial(event) {
        event.preventDefault();
        const id = document.getElementById("editTestimonialId").value;
        const rating = Number(document.getElementById("editTestimonialRating").value);
        const status = document.getElementById("editTestimonialStatus").value;
        const saveButton = document.getElementById("saveTestimonialEdit");
        saveButton.disabled = true;
        clearAdminMessage();

        try {
            const { error } = await supabaseClient
                .from("testimonials")
                .update({
                    name: document.getElementById("editTestimonialName").value.trim(),
                    role: document.getElementById("editTestimonialRole").value.trim(),
                    content: document.getElementById("editTestimonialContent").value,
                    rating,
                    status
                })
                .eq("id", id);
            if (error) throw error;

            closeEditModal();
            await loadTestimonials();
            showAdminMessage("updateSuccess", "success");
        } catch (error) {
            console.error("Edit testimonial error:", error);
            showAdminMessage("actionError", "error");
        } finally {
            saveButton.disabled = false;
        }
    }

    function showAdminMessage(key, type) {
        const message = document.getElementById("testimonialAdminMessage");
        message.textContent = translate(key);
        message.classList.remove("hidden", "bg-emerald-50", "text-emerald-700", "bg-rose-50", "text-rose-700");
        message.classList.add(type === "success" ? "bg-emerald-50" : "bg-rose-50", type === "success" ? "text-emerald-700" : "text-rose-700");
    }

    function clearAdminMessage() {
        document.getElementById("testimonialAdminMessage").classList.add("hidden");
    }

    function clearAdminError() {
        const error = document.getElementById("testimonialAdminError");
        error.classList.add("hidden");
        error.textContent = "";
    }

    function setupAdminSidebar() {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebarOverlay");
        const menu = document.getElementById("mobileMenuBtn");
        const close = () => {
            sidebar?.classList.add("-translate-x-full");
            sidebar?.classList.remove("translate-x-0");
            overlay?.classList.add("hidden");
            document.body.classList.remove("overflow-hidden");
        };
        const open = () => {
            sidebar?.classList.remove("-translate-x-full");
            sidebar?.classList.add("translate-x-0");
            overlay?.classList.remove("hidden");
            document.body.classList.add("overflow-hidden");
        };
        menu?.addEventListener("click", open);
        overlay?.addEventListener("click", close);
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 1024) close();
        });
        sidebar?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
            if (window.innerWidth < 1024) close();
        }));
    }
}

function escapeAdminHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}
