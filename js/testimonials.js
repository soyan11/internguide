(() => {
    const testimonialSelect = "id, user_id, name, role, content, rating, status, created_at";
    let currentUser = null;
    let currentProfile = null;
    let selectedRating = 0;

    document.addEventListener("DOMContentLoaded", initializeTestimonials);

    async function initializeTestimonials() {
        initializeHomepageTestimonials();
        await initializeTestimonialsPage();
    }

    function translate(key) {
        return window.InternGuideI18n?.t(`testimonials.${key}`) || key;
    }

    async function fetchApprovedTestimonials(limit) {
        if (!window.supabaseClient) throw new Error("Supabase client is unavailable.");

        let request = window.supabaseClient
            .from("testimonials")
            .select(testimonialSelect)
            .eq("status", "approved")
            .order("created_at", { ascending: false });
        if (Number.isInteger(limit)) request = request.limit(limit);

        const { data, error } = await request;
        if (error) throw error;

        const rows = data || [];
        const avatars = await loadProfileAvatars(rows);
        return rows.map((row) => ({ ...row, avatar_url: avatars.get(String(row.user_id)) || "" }));
    }

    function initializeHomepageTestimonials() {
        const container = document.getElementById("homeTestimonials");
        const status = document.getElementById("homeTestimonialsStatus");
        if (!container || !status) return;

        const section = container.closest(".testimonials-section");
        section?.addEventListener("click", (event) => {
            if (!event.target.closest("[data-retry-testimonials]")) return;
            loadHomepageTestimonials(container, status);
        });
        loadHomepageTestimonials(container, status);
    }

    async function loadHomepageTestimonials(container, status) {
        status.textContent = translate("loading");
        status.dataset.i18n = "testimonials.loading";
        container.replaceChildren();

        try {
            const rows = await fetchApprovedTestimonials(3);
            if (!rows.length) {
                status.textContent = translate("noApproved");
                status.dataset.i18n = "testimonials.noApproved";
                window.InternGuideI18n?.applyTranslations?.();
                return;
            }

            status.textContent = "";
            status.removeAttribute("data-i18n");
            container.innerHTML = rows.map(renderTestimonialCard).join("");
            window.InternGuideI18n?.applyTranslations?.();
            setupAvatarFallbacks(container);
        } catch (error) {
            console.error("Load homepage testimonials error:", error);
            status.innerHTML = `${escapeHtml(translate("unableToLoad"))} <button type="button" data-retry-testimonials class="font-semibold text-blue-700 underline">${escapeHtml(translate("tryAgain"))}</button>`;
            status.removeAttribute("data-i18n");
        }
    }

    async function initializeTestimonialsPage() {
        const list = document.getElementById("publicTestimonials");
        if (!list) return;

        const status = document.getElementById("publicTestimonialsStatus");
        list.closest("main")?.addEventListener("click", (event) => {
            if (!event.target.closest("[data-retry-testimonials]")) return;
            loadPublicTestimonials(list, status);
        });
        await Promise.all([loadPublicTestimonials(list, status), initializeSubmissionForm()]);
    }

    async function loadPublicTestimonials(container, status) {
        if (!status) return;
        status.textContent = translate("loading");
        status.dataset.i18n = "testimonials.loading";
        container.replaceChildren();

        try {
            const rows = await fetchApprovedTestimonials();
            if (!rows.length) {
                status.textContent = translate("noApproved");
                status.dataset.i18n = "testimonials.noApproved";
                window.InternGuideI18n?.applyTranslations?.();
                return;
            }

            status.textContent = "";
            status.removeAttribute("data-i18n");
            container.innerHTML = rows.map(renderTestimonialCard).join("");
            window.InternGuideI18n?.applyTranslations?.();
            setupAvatarFallbacks(container);
        } catch (error) {
            console.error("Load public testimonials error:", error);
            status.innerHTML = `${escapeHtml(translate("unableToLoad"))} <button type="button" data-retry-testimonials class="font-semibold text-blue-700 underline">${escapeHtml(translate("tryAgain"))}</button>`;
            status.removeAttribute("data-i18n");
        }
    }

    async function loadProfileAvatars(rows) {
        const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))];
        if (!userIds.length) return new Map();

        let { data, error } = await window.supabaseClient
            .from("testimonial_public_profiles")
            .select("id, avatar_url")
            .in("id", userIds);
        if (error) {
            console.warn("Public testimonial avatar view is unavailable; trying profiles visible to the current user.", error);
            const fallback = await window.supabaseClient
                .from("profiles")
                .select("id, avatar_url")
                .in("id", userIds);
            data = fallback.data;
            error = fallback.error;
        }
        if (error) {
            console.error("Load testimonial profile avatars error:", error);
            return new Map();
        }

        const profiles = new Map((data || []).map((profile) => [String(profile.id), profile.avatar_url]));
        const avatarEntries = await Promise.all([...profiles.entries()].map(async ([userId, avatarPath]) => {
            if (!avatarPath) return [userId, ""];
            if (/^https?:\/\//i.test(avatarPath)) {
                return [userId, getSafeImageUrl(avatarPath) || ""];
            }

            const { data: signed, error: signedError } = await window.supabaseClient.storage
                .from("avatars")
                .createSignedUrl(avatarPath, 3600);
            if (signedError) {
                console.error("Sign testimonial avatar URL error:", signedError);
                return [userId, ""];
            }
            return [userId, getSafeImageUrl(signed?.signedUrl) || ""];
        }));
        return new Map(avatarEntries);
    }

    function renderTestimonialCard(testimonial) {
        const name = testimonial.name || "InternGuide Student";
        const role = testimonial.role || "";
        const rating = Math.min(5, Math.max(0, Math.round(Number(testimonial.rating) || 0)));
        const stars = `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;
        const initials = getInitials(name);
        const avatarUrl = getSafeImageUrl(testimonial.avatar_url);
        const ratingLabel = translate("ratingOutOf").replace("{rating}", String(rating));

        return `
            <article class="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
                <p class="whitespace-pre-line text-sm italic leading-6 text-slate-600" data-user-content>${escapeHtml(testimonial.content || "")}</p>
                <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div class="flex min-w-0 items-center gap-3">
                        <div class="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                            <span data-avatar-fallback>${escapeHtml(initials)}</span>
                            ${avatarUrl ? `<img data-testimonial-avatar src="${escapeHtml(avatarUrl)}" alt="" class="absolute inset-0 h-full w-full object-cover">` : ""}
                        </div>
                        <div class="min-w-0">
                            <strong class="block truncate text-base font-semibold text-slate-900" data-user-content>${escapeHtml(name)}</strong>
                            ${role ? `<span class="block truncate text-sm text-slate-500" data-user-content>${escapeHtml(role)}</span>` : ""}
                        </div>
                    </div>
                    <div class="flex shrink-0 items-center gap-1" aria-label="${escapeHtml(ratingLabel)}">
                        <span class="text-lg tracking-wide text-amber-500" aria-hidden="true">${stars}</span>
                        <span class="text-xs font-medium text-slate-500">${rating}/5</span>
                    </div>
                </div>
            </article>
        `;
    }

    function setupAvatarFallbacks(container) {
        container.querySelectorAll("[data-testimonial-avatar]").forEach((image) => {
            const fallback = image.parentElement?.querySelector("[data-avatar-fallback]");
            const showFallback = () => {
                image.remove();
                fallback?.classList.remove("invisible");
            };

            image.addEventListener("error", showFallback, { once: true });
            if (image.complete) {
                if (image.naturalWidth === 0) showFallback();
                else fallback?.classList.add("invisible");
            } else {
                fallback?.classList.add("invisible");
            }
        });
    }

    async function initializeSubmissionForm() {
        const form = document.getElementById("testimonialForm");
        const guestNotice = document.getElementById("testimonialSignInNotice");
        const formPanel = document.getElementById("testimonialFormPanel");
        if (!form || !guestNotice || !formPanel) return;

        const client = window.supabaseClient;
        if (!client) {
            formPanel.classList.remove("hidden");
            setFormMessage("testimonialFormMessage", "unableToLoad", "error");
            return;
        }

        const { data, error } = await client.auth.getUser();
        if (error && error.name !== "AuthSessionMissingError") {
            console.error("Get testimonial submitter error:", error);
        }
        currentUser = data?.user || null;
        if (!currentUser) {
            guestNotice.classList.remove("hidden");
            formPanel.classList.add("hidden");
            return;
        }

        const { data: profile, error: profileError } = await client
            .from("profiles")
            .select("full_name, major, university, year_of_study, career_roles, preferred_industry")
            .eq("id", currentUser.id)
            .maybeSingle();
        if (profileError) console.error("Load testimonial submitter profile error:", profileError);
        currentProfile = profile || {};

        const profileName = currentProfile.full_name || currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email || "";
        const role = [currentProfile.major, currentProfile.university, currentProfile.year_of_study]
            .map((value) => String(value || "").trim())
            .filter(Boolean);
        const fallbackRole = currentProfile.career_roles || currentProfile.preferred_industry || "";
        document.getElementById("testimonialName").value = profileName;
        document.getElementById("testimonialRole").value = role.join(" · ") || fallbackRole;
        guestNotice.classList.add("hidden");
        formPanel.classList.remove("hidden");

        const ratingButtons = form.querySelectorAll("[data-testimonial-rating]");
        const updateRatingLabels = () => ratingButtons.forEach((button) => {
            button.setAttribute("aria-label", translate("star").replace("{rating}", button.dataset.testimonialRating));
        });
        updateRatingLabels();
        window.addEventListener("internGuideLanguageChange", updateRatingLabels);
        ratingButtons.forEach((button) => button.addEventListener("click", () => {
            selectedRating = Number(button.dataset.testimonialRating);
            ratingButtons.forEach((item) => {
                const active = Number(item.dataset.testimonialRating) <= selectedRating;
                item.setAttribute("aria-pressed", String(Number(item.dataset.testimonialRating) === selectedRating));
                item.classList.toggle("text-amber-500", active);
                item.classList.toggle("text-slate-300", !active);
                item.textContent = active ? "★" : "☆";
            });
            document.getElementById("testimonialRatingError")?.classList.add("hidden");
        }));

        form.addEventListener("submit", submitTestimonial);
    }

    async function submitTestimonial(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const submitButton = document.getElementById("submitTestimonialButton");
        const ratingError = document.getElementById("testimonialRatingError");
        if (!selectedRating) {
            ratingError?.classList.remove("hidden");
            form.querySelector("[data-testimonial-rating]")?.focus();
            return;
        }
        if (!currentUser || !window.supabaseClient) return;

        const name = document.getElementById("testimonialName").value.trim();
        const role = document.getElementById("testimonialRole").value.trim();
        const content = document.getElementById("testimonialContent").value;
        if (!name) {
            document.getElementById("testimonialName").focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = translate("submitting");
        try {
            const { error } = await window.supabaseClient
                .from("testimonials")
                .insert({
                    user_id: currentUser.id,
                    name,
                    role,
                    content,
                    rating: selectedRating,
                    status: "pending"
                });
            if (error) throw error;

            form.reset();
            selectedRating = 0;
            document.getElementById("testimonialName").value = currentProfile.full_name || currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email || "";
            const profileRole = [currentProfile.major, currentProfile.university, currentProfile.year_of_study]
                .map((value) => String(value || "").trim()).filter(Boolean).join(" · ");
            document.getElementById("testimonialRole").value = profileRole || currentProfile.career_roles || currentProfile.preferred_industry || "";
            form.querySelectorAll("[data-testimonial-rating]").forEach((button) => {
                button.setAttribute("aria-pressed", "false");
                button.classList.remove("text-amber-500");
                button.classList.add("text-slate-300");
                button.textContent = "☆";
            });
            showSubmissionSuccess();
        } catch (error) {
            console.error("Submit testimonial error:", error);
            setFormMessage("testimonialFormMessage", "submissionError", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = translate("submit");
        }
    }

    function setFormMessage(elementId, key, type) {
        const message = document.getElementById(elementId);
        if (!message) return;
        message.dataset.i18n = `testimonials.${key}`;
        message.textContent = translate(key);
        message.className = `rounded-lg p-3 text-sm ${type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`;
        window.InternGuideI18n?.applyTranslations?.();
    }

    function showSubmissionSuccess() {
        const message = document.getElementById("testimonialFormMessage");
        if (!message) return;
        message.className = "rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800";
        message.innerHTML = `
            <strong class="block" data-i18n="testimonials.submissionThanks">${escapeHtml(translate("submissionThanks"))}</strong>
            <span class="mt-1 block" data-i18n="testimonials.submissionPending">${escapeHtml(translate("submissionPending"))}</span>
        `;
        window.InternGuideI18n?.applyTranslations?.();
    }

    function getSafeImageUrl(value) {
        if (!value) return "";
        try {
            const url = new URL(value, window.location.origin);
            return ["https:", "http:"].includes(url.protocol) ? url.href : "";
        } catch {
            return "";
        }
    }

    function getInitials(value) {
        const words = String(value || "").trim().split(/\s+/).filter(Boolean);
        return (words.length > 1 ? `${words[0][0]}${words[1][0]}` : words[0]?.slice(0, 2) || "IG").toUpperCase();
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }
})();
