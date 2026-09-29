/* =========================================================
   INTERNGUIDE ADMIN DASHBOARD
   Real Supabase data
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    if (window.lucide) lucide.createIcons();

    const adminSession = await requireAdmin();
    if (!adminSession) return;

    console.log("Admin authenticated:", adminSession.profile);

    if (document.getElementById("totalUsers")) {
        setDashboardDateRange();
        await loadDashboardData();
        await loadRecentUsers();
        await loadRecentInternships();
        setupDashboardSearch();
    }
    if (document.getElementById("contactMessagesList")) setupMessageSearch();
    await loadContactMessages();

    setupLogout();
    setupSidebarDropdowns();
    setupContactMessageActions();
    setupMessageModalControls();
});

async function loadDashboardData() {
    try {
        const [{ data: profiles, error: profilesError }, { data: internships, error: internshipsError }] =
            await Promise.all([
                supabaseClient.from("profiles").select("id, role"),
                supabaseClient.from("internships").select("*")
            ]);

        if (profilesError) throw profilesError;
        if (internshipsError) throw internshipsError;

        const internshipRows = Array.isArray(internships) ? internships : [];
        const activeInternships = internshipRows.filter(item => isActiveInternship(item.status));
        const companies = new Set(
            internshipRows
                .map(item => String(item.company_name || "").trim().toLowerCase())
                .filter(Boolean)
        );

        updateElement("totalUsers", formatNumber(profiles?.length || 0));
        updateElement("activeInternships", formatNumber(activeInternships.length));
        updateElement("totalInternships", formatNumber(internshipRows.length));
        updateElement("totalCompanies", formatNumber(companies.size));

        setConnectionStatus("profilesConnectionStatus", true);
        setConnectionStatus("internshipsConnectionStatus", true);

        renderInternshipStatus(internshipRows);
    } catch (error) {
        console.error("Dashboard data error:", error);

        setConnectionStatus("profilesConnectionStatus", false);
        setConnectionStatus("internshipsConnectionStatus", false);

        ["totalUsers", "activeInternships", "totalInternships", "totalCompanies"]
            .forEach(id => updateElement(id, "—"));

        const bars = document.getElementById("internshipStatusBars");
        if (bars) bars.innerHTML = '<div class="text-xs text-red-500">Unable to load dashboard data.</div>';

        const list = document.getElementById("internshipStatusList");
        if (list) list.innerHTML = '<div class="text-xs text-red-500">Unable to load status data.</div>';
    }
}

async function loadRecentUsers() {
    const container = document.querySelector(".user-list");
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("id, full_name, role, created_at")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) throw error;

        if (!data?.length) {
            container.innerHTML = '<div class="py-8 text-center text-xs text-slate-400">No registered users yet.</div>';
            return;
        }

        container.innerHTML = data.map(user => {
            const name = user.full_name || "Unnamed User";
            const role = user.role === "admin" ? "Administrator" : "Student";
            const initial = name.charAt(0).toUpperCase();

            return `
                <div class="user-row flex min-h-14 items-center gap-3">
                    <div class="user-avatar grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ig-light text-xs font-semibold text-ig-primary">
                        ${escapeHtml(initial)}
                    </div>
                    <div class="user-info min-w-0 flex-1">
                        <strong class="block truncate text-[11px] font-semibold">${escapeHtml(name)}</strong>
                        <span class="text-[9px] text-slate-400">${escapeHtml(role)}</span>
                    </div>
                    <time class="shrink-0 text-[9px] text-slate-400">${formatRelativeTime(user.created_at)}</time>
                </div>
            `;
        }).join("");
    } catch (error) {
        console.error("Recent users error:", error);
        container.innerHTML = '<div class="py-8 text-center text-xs text-red-500">Unable to load users.</div>';
    }
}

async function loadRecentInternships() {
    const body = document.getElementById("recentInternshipsBody");
    if (!body) return;

    try {
        const { data, error } = await supabaseClient
            .from("internships")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) throw error;

        if (!data?.length) {
            body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">No internships found.</td></tr>';
            return;
        }

        body.innerHTML = data.map(item => {
            const status = String(item.status || "Unknown");
            return `
                <tr class="border-t border-slate-100">
                    <td class="px-4 py-3 font-medium text-slate-700">${escapeHtml(item.title || "Untitled Internship")}</td>
                    <td class="px-4 py-3">${escapeHtml(item.company_name || "—")}</td>
                    <td class="px-4 py-3">${escapeHtml(item.category || "—")}</td>
                    <td class="px-4 py-3">${formatDate(item.created_at)}</td>
                    <td class="px-4 py-3">${statusBadge(status)}</td>
                    <td class="px-4 py-3"><a href="./internships.html" class="rounded-md border border-ig-border px-2.5 py-1.5 text-[9px] font-medium text-ig-primary hover:bg-ig-light">View</a></td>
                </tr>
            `;
        }).join("");
    } catch (error) {
        console.error("Recent internships error:", error);
        body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Unable to load internships.</td></tr>';
    }
}

async function loadContactMessages() {
    const list = document.getElementById("contactMessagesList");
    const summary = document.getElementById("contactMessagesSummary");
    const statusEl = document.getElementById("contactMessagesConnectionStatus");
    const sidebarBadge = document.getElementById("messagesSidebarBadge");

    if (!list) return;

    try {
        const { data, error } = await supabaseClient
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        const rows = Array.isArray(data) ? data : [];
        const unreadCount = rows.filter(item => !item.is_read).length;

        if (statusEl) {
            setConnectionStatus("contactMessagesConnectionStatus", true);
        }

        if (summary) {
            summary.textContent = unreadCount ? `${unreadCount} unread` : "Inbox clear";
            summary.className = `rounded-full px-2.5 py-1 text-[10px] font-medium ${unreadCount ? "bg-red-50 text-red-700" : "bg-ig-light text-ig-primary"}`;
        }

        if (sidebarBadge) {
            if (unreadCount) {
                sidebarBadge.textContent = String(unreadCount);
                sidebarBadge.classList.remove("hidden");
            } else {
                sidebarBadge.textContent = "0";
                sidebarBadge.classList.add("hidden");
            }
        }

        if (!rows.length) {
            list.innerHTML = '<div class="px-5 py-8 text-center text-xs text-slate-400">No contact messages yet.</div>';
            return;
        }

        list.innerHTML = rows.map(message => {
            const status = String(message.status || "new").toLowerCase();
            const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
            const readingClass = message.is_read ? "bg-slate-100 text-slate-600" : "bg-blue-50 text-blue-700";

            return `
                <button type="button" data-message-open="${message.id}" class="block w-full cursor-pointer border-0 bg-white p-0 text-left">
                    <div class="flex flex-col gap-4 p-5 transition hover:bg-slate-50 md:flex-row md:items-start md:justify-between">
                        <div class="min-w-0 flex-1">
                            <div class="mb-2 flex flex-wrap items-center gap-2">
                                <span class="block text-sm font-semibold text-slate-800">${escapeHtml(message.full_name || "Unknown sender")}</span>
                                <span class="inline-flex rounded-full px-2 py-0.5 text-[9px] font-medium ${readingClass}">${message.is_read ? "Read" : "New"}</span>
                                <span class="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600">${escapeHtml(statusLabel)}</span>
                            </div>
                            <div class="mb-2 text-[10px] text-slate-500">
                                <span>${escapeHtml(message.email || "No email")}</span>
                                <span class="mx-2">•</span>
                                <span>${formatDate(message.created_at)}</span>
                            </div>
                            <div class="mb-2 text-[11px] font-medium text-slate-700">${escapeHtml(message.subject || "No subject")}</div>
                            <p class="max-w-2xl text-xs leading-5 text-slate-600">${escapeHtml((message.message || "No message provided.").slice(0, 180))}${(message.message || "").length > 180 ? "..." : ""}</p>
                        </div>
                        <div class="flex shrink-0 flex-wrap gap-2 md:justify-end">
                            <span class="rounded-lg border border-ig-border px-2.5 py-1.5 text-[10px] font-medium text-slate-700">Open</span>
                            <span class="rounded-lg border border-red-200 px-2.5 py-1.5 text-[10px] font-medium text-red-600">${message.status === "archived" ? "Archived" : "Actions"}</span>
                        </div>
                    </div>
                </button>
            `;
        }).join("");
        filterContactMessages();
    } catch (error) {
        console.error("Contact messages error:", error);
        if (statusEl) setConnectionStatus("contactMessagesConnectionStatus", false);
        list.innerHTML = '<div class="px-5 py-8 text-center text-xs text-red-500">Unable to load contact messages.</div>';
    }
}

function setupContactMessageActions() {
    document.addEventListener("click", async (event) => {
        const openTrigger = event.target.closest("[data-message-open]");
        if (openTrigger) {
            const messageId = openTrigger.dataset.messageOpen;
            if (messageId) {
                const { data, error } = await supabaseClient
                    .from("contact_messages")
                    .select("*")
                    .eq("id", messageId)
                    .single();

                if (!error && data) {
                    openMessageModal(data);
                }
            }
            return;
        }

        const button = event.target.closest("[data-contact-action]");
        if (!button) return;

        const { contactAction, contactId } = button.dataset;
        if (!contactAction || !contactId) return;

        await updateContactMessageStatus(contactId, contactAction);
    });
}

async function updateContactMessageStatus(contactId, contactAction) {
    const updates = {
        updated_at: new Date().toISOString(),
        is_read: ["read", "reply", "replied", "unread"].includes(contactAction) ? contactAction !== "unread" : true,
    };

    if (contactAction === "read") {
        updates.status = "read";
    } else if (contactAction === "reply" || contactAction === "replied") {
        updates.status = "replied";
    } else if (contactAction === "archive") {
        updates.status = "archived";
    } else if (contactAction === "unread") {
        updates.status = "new";
        updates.is_read = false;
    }

    try {
        const { error } = await supabaseClient
            .from("contact_messages")
            .update(updates)
            .eq("id", contactId);

        if (error) throw error;
        await loadContactMessages();
        if (document.getElementById("messageDetailModal")?.classList.contains("flex")) {
            const { data, error: fetchError } = await supabaseClient
                .from("contact_messages")
                .select("*")
                .eq("id", contactId)
                .single();
            if (!fetchError && data) openMessageModal(data);
        }
    } catch (error) {
        console.error("Update contact message error:", error);
        alert("Unable to update this message. Please try again.");
    }
}

function setupMessageModalControls() {
    const modal = document.getElementById("messageDetailModal");
    const closeBtn = document.getElementById("closeMessageModal");
    if (!modal || !closeBtn) return;

    const deleteButton = document.getElementById("deleteContactMessage");
    deleteButton?.addEventListener("click", async () => {
        const messageId = deleteButton.dataset.messageId;
        if (!messageId || !window.confirm("Delete this contact message permanently? This action cannot be undone.")) return;

        deleteButton.disabled = true;
        try {
            const { error } = await supabaseClient
                .from("contact_messages")
                .delete()
                .eq("id", messageId);
            if (error) throw error;

            modal.classList.add("hidden");
            modal.classList.remove("flex");
            await loadContactMessages();
            window.dispatchEvent(new CustomEvent("adminContactMessagesChanged"));
        } catch (error) {
            console.error("Delete contact message error:", error);
            alert("Unable to delete this message. Please try again.");
        } finally {
            deleteButton.disabled = false;
        }
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    });

    document.querySelectorAll(".message-status-button").forEach(button => {
        button.addEventListener("click", async () => {
            const action = button.dataset.messageStatusAction;
            const id = button.dataset.messageId;
            if (!action || !id) return;
            await updateContactMessageStatus(id, action);
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        });
    });
}

function openMessageModal(message) {
    const modal = document.getElementById("messageDetailModal");
    if (!modal) return;

    document.getElementById("messageDetailTitle").textContent = message.subject || "Message";
    document.getElementById("messageDetailName").textContent = message.full_name || "Unknown sender";
    document.getElementById("messageDetailEmail").textContent = message.email || "—";
    document.getElementById("messageDetailSubject").textContent = message.subject || "No subject";
    document.getElementById("messageDetailDate").textContent = formatDate(message.created_at);
    document.getElementById("messageDetailStatus").textContent = String(message.status || "new").charAt(0).toUpperCase() + String(message.status || "new").slice(1);
    document.getElementById("messageDetailBody").textContent = message.message || "No message provided.";

    document.querySelectorAll(".message-status-button").forEach(button => {
        button.dataset.messageId = message.id;
    });
    const deleteButton = document.getElementById("deleteContactMessage");
    if (deleteButton) deleteButton.dataset.messageId = message.id;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function renderInternshipStatus(items) {
    const counts = new Map();

    for (const item of items) {
        const status = normalizeStatus(item.status);
        counts.set(status, (counts.get(status) || 0) + 1);
    }

    const ordered = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const total = items.length;

    updateElement("statusTotal", formatNumber(total));

    const list = document.getElementById("internshipStatusList");
    if (list) {
        if (!ordered.length) {
            list.innerHTML = '<div class="text-xs text-slate-400">No internship statuses yet.</div>';
        } else {
            list.innerHTML = ordered.map(([status, count], index) => `
                <div class="status-row flex items-center justify-between text-xs">
                    <span class="flex items-center gap-2 text-slate-600">
                        <i class="h-2 w-2 rounded-full ${statusColorClass(index)}"></i>
                        ${escapeHtml(status)}
                    </span>
                    <strong>${formatNumber(count)} <span class="font-normal text-slate-400">(${Math.round(count / total * 100)}%)</span></strong>
                </div>
            `).join("");
        }
    }

    const bars = document.getElementById("internshipStatusBars");
    if (bars) {
        if (!ordered.length) {
            bars.innerHTML = '<div class="text-xs text-slate-400">No internship records yet.</div>';
        } else {
            bars.innerHTML = ordered.map(([status, count], index) => {
                const percent = Math.round((count / total) * 100);
                return `
                    <div>
                        <div class="mb-1.5 flex items-center justify-between text-[10px]">
                            <span class="font-medium text-slate-600">${escapeHtml(status)}</span>
                            <span class="text-slate-400">${count} (${percent}%)</span>
                        </div>
                        <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div class="h-full rounded-full ${statusBarClass(index)}" style="width:${percent}%"></div>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }

    const donut = document.getElementById("internshipDonut");
    if (donut && total) {
        const palette = ["#748FFC", "#40C057", "#FA5252", "#A5D8FF", "#FF922B", "#845EF7"];
        let cursor = 0;
        const stops = ordered.map(([_, count], index) => {
            const start = cursor;
            cursor += (count / total) * 100;
            return `${palette[index % palette.length]} ${start}% ${cursor}%`;
        });
        donut.style.background = `conic-gradient(${stops.join(",")})`;
    }
}

function isActiveInternship(status) {
    return ["approved", "published", "active"].includes(normalizeStatus(status).toLowerCase());
}

function normalizeStatus(status) {
    return String(status || "Unknown").trim() || "Unknown";
}

function statusBadge(status) {
    const value = normalizeStatus(status);
    const key = value.toLowerCase();

    let classes = "bg-slate-100 text-slate-600";
    if (["approved", "published", "active"].includes(key)) classes = "bg-emerald-50 text-emerald-700";
    else if (["pending", "draft"].includes(key)) classes = "bg-amber-50 text-amber-700";
    else if (["rejected", "closed"].includes(key)) classes = "bg-red-50 text-red-700";

    return `<span class="inline-flex rounded-full px-2.5 py-1 text-[9px] font-medium ${classes}">${escapeHtml(value)}</span>`;
}

function statusColorClass(index) {
    return ["bg-ig-secondary", "bg-green-500", "bg-red-500", "bg-sky-300", "bg-orange-500", "bg-violet-500"][index % 6];
}

function statusBarClass(index) {
    return ["bg-ig-primary", "bg-green-500", "bg-red-500", "bg-sky-300", "bg-orange-500", "bg-violet-500"][index % 6];
}

function setConnectionStatus(id, connected) {
    const element = document.getElementById(id);
    if (!element) return;

    element.textContent = connected ? "Connected" : "Unavailable";
    element.className = `font-semibold ${connected ? "text-emerald-600" : "text-red-500"}`;
}

function setDashboardDateRange() {
    const element = document.getElementById("dashboardDateRange");
    if (!element) return;

    const now = new Date();
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options = { month: "short", day: "numeric", year: "numeric" };
    element.textContent =
        `${monday.toLocaleDateString(undefined, options)} - ${sunday.toLocaleDateString(undefined, options)}`;
}

function setupDashboardSearch() {
    const searchInput = document.getElementById("dashboardSearch");
    if (!searchInput) return;

    searchInput.addEventListener("input", event => {
        const value = event.target.value.trim().toLowerCase();

        document.querySelectorAll("#recentInternshipsBody tr").forEach(row => {
            row.classList.toggle(
                "hidden",
                Boolean(value) && !row.textContent.toLowerCase().includes(value)
            );
        });
    });
}

function setupMessageSearch() {
    document.getElementById("adminGlobalSearch")?.addEventListener("input", filterContactMessages);
}

function filterContactMessages() {
    const searchInput = document.getElementById("adminGlobalSearch");
    const list = document.getElementById("contactMessagesList");
    if (!searchInput || !list) return;

    const query = searchInput.value.trim().toLowerCase();
    const messages = [...list.querySelectorAll("[data-message-open]")];
    let visibleCount = 0;

    messages.forEach(message => {
        const matches = !query || message.textContent.toLowerCase().includes(query);
        message.hidden = !matches;
        if (matches) visibleCount += 1;
    });

    let emptyState = list.querySelector("[data-message-search-empty]");
    if (query && messages.length && !visibleCount) {
        if (!emptyState) {
            emptyState = document.createElement("div");
            emptyState.dataset.messageSearchEmpty = "true";
            emptyState.className = "px-5 py-8 text-center text-sm text-slate-400";
            emptyState.textContent = "No messages match your search.";
            list.appendChild(emptyState);
        }
    } else {
        emptyState?.remove();
    }
}

function setupSidebarDropdowns() {
    document.querySelectorAll(".sidebar-dropdown").forEach(button => {
        button.addEventListener("click", () => {
            const target = document.getElementById(button.dataset.dropdown);
            const arrow = button.querySelector(".dropdown-arrow");
            target?.classList.toggle("hidden");
            arrow?.classList.toggle("rotate-180");
        });
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to logout?")) return;

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            alert("Unable to logout. Please try again.");
            return;
        }

        window.location.href = "../pages/auth/login.html";
    });
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function formatRelativeTime(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    return date.toLocaleDateString();
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
