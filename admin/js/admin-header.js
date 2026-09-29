/* Shared admin header: language, notifications, and authenticated admin profile. */
(function () {
    const state = {
        adminSession: null,
        unreadMessages: [],
        notificationOpen: false,
    };

    document.addEventListener("DOMContentLoaded", async () => {
        setupLanguageSwitcher();
        setupNotificationButton();
        setupAdminProfile();
        await hydrateAdminHeader();
        await refreshNotificationCount();
        window.addEventListener("adminContactMessagesChanged", refreshNotificationCount);
        if (window.lucide) window.lucide.createIcons();
    });

    async function hydrateAdminHeader() {
        try {
            if (typeof requireAdmin !== "function") return;
            state.adminSession = await requireAdmin();
            if (!state.adminSession?.profile) return;

            const profile = state.adminSession.profile;
            const name = String(profile.full_name || state.adminSession.user?.email || "Admin").trim() || "Admin";
            const role = profile.role === "admin" ? "Administrator" : String(profile.role || "Administrator");

            document.querySelectorAll(".admin-name").forEach(el => { el.textContent = name; });
            document.querySelectorAll(".admin-role").forEach(el => { el.textContent = role; });
            document.querySelectorAll(".admin-avatar-fallback").forEach(el => {
                el.textContent = name.charAt(0).toUpperCase();
            });

            if (profile.avatar_url) {
                const avatarUrl = await resolveAvatarUrl(profile.avatar_url);
                if (avatarUrl) {
                    document.querySelectorAll(".admin-avatar-image").forEach(img => {
                        img.src = avatarUrl;
                        img.hidden = false;
                        img.onload = () => img.closest(".admin-avatar")?.classList.add("has-image");
                        img.onerror = () => {
                            img.hidden = true;
                            img.closest(".admin-avatar")?.classList.remove("has-image");
                        };
                    });
                }
            }
        } catch (error) {
            console.error("Admin header profile error:", error);
        }
    }

    async function resolveAvatarUrl(value) {
        let url = String(value || "").trim();
        if (!url) return "";
        if (/^https?:\/\//i.test(url)) return url;

        try {
            const { data, error } = await supabaseClient.storage
                .from("avatars")
                .createSignedUrl(url, 3600);
            if (error) throw error;
            return data?.signedUrl || "";
        } catch (error) {
            console.warn("Could not resolve admin avatar:", error);
            return "";
        }
    }

    function setupAdminProfile() {
        document.querySelectorAll(".admin-profile").forEach(button => {
            button.addEventListener("click", () => {
                window.location.href = "../pages/profile/profile.html";
            });
        });
    }

    function setupNotificationButton() {
        document.addEventListener("click", async (event) => {
            const button = event.target.closest(".notification-button");
            const popover = event.target.closest(".notification-popover");

            if (button) {
                event.preventDefault();
                if (state.notificationOpen) {
                    closeNotifications();
                } else {
                    await openNotifications();
                }
                return;
            }

            if (!popover) closeNotifications();

            const item = event.target.closest("[data-admin-notification-id]");
            if (item) {
                const id = item.dataset.adminNotificationId;
                await markMessageRead(id);
                window.location.href = "./messages.html";
            }
        });
    }

    async function refreshNotificationCount() {
        try {
            const { data, error } = await supabaseClient
                .from("contact_messages")
                .select("id, full_name, subject, message, created_at, is_read, status")
                .eq("is_read", false)
                .order("created_at", { ascending: false });

            if (error) throw error;
            state.unreadMessages = (Array.isArray(data) ? data : []).filter(item => String(item.status || "new").toLowerCase() !== "archived");
            updateNotificationBadge(state.unreadMessages.length);
        } catch (error) {
            console.error("Admin notification count error:", error);
            updateNotificationBadge(0);
        }
    }

    function updateNotificationBadge(count) {
        document.querySelectorAll(".notification-count").forEach(badge => {
            const value = Number(count) || 0;
            badge.textContent = value > 99 ? "99+" : String(value);
            badge.hidden = value <= 0;
        });
        document.querySelectorAll("#messagesSidebarBadge").forEach(badge => {
            const value = Number(count) || 0;
            badge.textContent = value > 99 ? "99+" : String(value);
            badge.classList.toggle("hidden", value <= 0);
        });
    }

    async function openNotifications() {
        const wrap = document.querySelector(".notification-wrap");
        const popover = wrap?.querySelector(".notification-popover");
        const button = wrap?.querySelector(".notification-button");
        if (!popover || !button) return;

        state.notificationOpen = true;
        button.setAttribute("aria-expanded", "true");
        popover.hidden = false;

        const list = popover.querySelector(".notification-list");
        const countEl = popover.querySelector(".notification-popover-count");
        const messages = state.unreadMessages.slice(0, 8);
        if (countEl) countEl.textContent = String(state.unreadMessages.length);

        if (!messages.length) {
            list.innerHTML = '<div class="notification-empty"><i data-lucide="check-circle-2"></i><p>No new messages</p><span>You are all caught up.</span></div>';
        } else {
            list.innerHTML = messages.map(message => `
                <button type="button" class="notification-item" data-admin-notification-id="${escapeAttr(message.id)}">
                    <span class="notification-item-icon"><i data-lucide="mail"></i></span>
                    <span class="notification-item-content">
                        <strong>${escapeHtml(message.full_name || "New message")}</strong>
                        <span>${escapeHtml(message.subject || "Contact message")}</span>
                        <small>${escapeHtml(formatNotificationTime(message.created_at))}</small>
                    </span>
                </button>
            `).join("");
        }

        if (window.lucide) window.lucide.createIcons();

        // Opening the notification center acknowledges the currently unread messages.
        // This keeps the badge tied to the real unread state in Supabase.
        if (state.unreadMessages.length) {
            const ids = state.unreadMessages.map(item => item.id).filter(Boolean);
            const { error } = await supabaseClient
                .from("contact_messages")
                .update({ is_read: true, status: "read", updated_at: new Date().toISOString() })
                .in("id", ids);
            if (!error) {
                state.unreadMessages = [];
                updateNotificationBadge(0);
                if (countEl) countEl.textContent = "0";
            }
        }
    }

    async function markMessageRead(id) {
        if (!id) return;
        try {
            await supabaseClient
                .from("contact_messages")
                .update({ is_read: true, status: "read", updated_at: new Date().toISOString() })
                .eq("id", id);
        } catch (error) {
            console.error("Could not mark notification read:", error);
        }
        await refreshNotificationCount();
    }

    function closeNotifications() {
        document.querySelectorAll(".notification-popover").forEach(popover => { popover.hidden = true; });
        document.querySelectorAll(".notification-button").forEach(button => button.setAttribute("aria-expanded", "false"));
        state.notificationOpen = false;
    }

    function setupLanguageSwitcher() {
        document.querySelectorAll("[data-admin-language]").forEach(wrapper => {
            const trigger = wrapper.querySelector(".language-trigger");
            const menu = wrapper.querySelector(".language-menu");
            if (!trigger || !menu) return;

            syncLanguageUI(wrapper, getCurrentLanguage());

            trigger.addEventListener("click", event => {
                event.stopPropagation();
                const open = !menu.hidden;
                document.querySelectorAll(".language-menu").forEach(other => { other.hidden = true; });
                document.querySelectorAll(".language-trigger").forEach(other => other.setAttribute("aria-expanded", "false"));
                menu.hidden = open;
                trigger.setAttribute("aria-expanded", String(!open));
            });

            wrapper.querySelectorAll("[data-language-option]").forEach(option => {
                option.addEventListener("click", async () => {
                    const lang = option.dataset.languageOption;
                    await changeLanguage(lang);
                    document.querySelectorAll("[data-admin-language]").forEach(el => syncLanguageUI(el, lang));
                    menu.hidden = true;
                    trigger.setAttribute("aria-expanded", "false");
                });
            });
        });

        document.addEventListener("click", () => {
            document.querySelectorAll(".language-menu").forEach(menu => { menu.hidden = true; });
            document.querySelectorAll(".language-trigger").forEach(button => button.setAttribute("aria-expanded", "false"));
        });
    }

    function getCurrentLanguage() {
        const api = window.InternGuideI18n;
        return api?.getLanguage?.() || document.documentElement.dataset.language || localStorage.getItem("internGuideLanguage") || "en";
    }

    async function changeLanguage(lang) {
        const api = window.InternGuideI18n;
        try {
            if (api?.setLanguage) await api.setLanguage(lang);
            else if (api?.changeLanguage) await api.changeLanguage(lang);
            else if (api?.switchLanguage) await api.switchLanguage(lang);
            else {
                localStorage.setItem("internGuideLanguage", lang);
                document.documentElement.dataset.language = lang;
                api?.applyTranslations?.();
                window.dispatchEvent(new CustomEvent("internGuideLanguageChange", { detail: { language: lang } }));
            }
        } catch (error) {
            console.error("Language switch failed:", error);
        }
    }

    function syncLanguageUI(wrapper, lang) {
        const isKhmer = lang === "km";
        const flag = wrapper.querySelector(".language-current-flag");
        const label = wrapper.querySelector(".language-current-label");
        if (flag) flag.textContent = isKhmer ? "🇰🇭" : "🇺🇸";
        if (label) label.textContent = isKhmer ? "ខ្មែរ" : "English";
        wrapper.querySelectorAll("[data-language-option]").forEach(option => option.classList.toggle("active", option.dataset.languageOption === lang));
    }

    function formatNotificationTime(value) {
        if (!value) return "Just now";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleString(getCurrentLanguage() === "km" ? "km-KH" : "en-US", { dateStyle: "medium", timeStyle: "short" });
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
    }

    function escapeAttr(value) { return escapeHtml(value); }
})();
