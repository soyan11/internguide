(function () {
    const pages = {
        home: { href: "../index.html", key: "nav.home" },
        internships: { href: "internships.html", key: "nav.internships" },
        career: { href: "career-guide.html", key: "nav.careerGuide" },
        cv: { href: "cv-interview.html", key: "nav.cvInterview" },
        about: { href: "about-contact.html", key: "nav.about" }
    };

    const t = (key) => window.InternGuideI18n?.t(key) || key;
    const currentPage = getCurrentPage();
    const activeClass = "nav-link active";
    const normalClass = "nav-link hover:text-gray-700";

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("header")?.replaceWith(createHeader());
        document.querySelector("footer")?.replaceWith(createFooter());
        window.InternGuideI18n?.applyTranslations();
    });

    function createHeader() {
        const header = document.createElement("header");
        header.className = "site-header py-2 sticky top-0 z-50";
        header.innerHTML = `
            <div class="site-container flex justify-between items-center">
                <a href="../index.html" class="logo">
                    <img src="../src/assets/images/logo.png" alt="InternGuide Logo">
                </a>
                <nav class="site-nav items-center hidden lg:flex">
                    ${desktopLinks()}
                </nav>
                <div id="authGuestActions" class="site-auth flex items-center">
                    <a href="auth/login.html" class="site-login border border-[#DEE2E6] rounded-xl" data-i18n="nav.login">${t("nav.login")}</a>
                    <a href="auth/signup.html" class="site-signup bg-[#3B5BDB] text-white rounded-xl" data-i18n="nav.signup">${t("nav.signup")}</a>
                </div>
                <div id="authUserActions" class="site-auth hidden items-center">
                    <a href="profile/profile.html" class="text-gray-600 hover:text-gray-800" data-i18n="nav.profile">${t("nav.profile")}</a>
                    <a href="profile/profile.html" id="homeNavbarAvatar" class="w-11 h-11 rounded-full bg-[#EDF2FF] flex items-center justify-center overflow-hidden">
                        <span id="homeNavbarAvatarInitials" class="text-[#3B5BDB] font-semibold">IG</span>
                        <img id="homeNavbarAvatarImage" src="" alt="Profile" class="hidden w-full h-full object-cover">
                    </a>
                    <button id="homeLogoutBtn" type="button" class="site-logout border border-red-200 text-red-600 hover:bg-red-50 rounded-xl" data-i18n="nav.logout">${t("nav.logout")}</button>
                </div>
                <div class="site-mobile-wrap">
                    <button id="toggle-btn" class="site-mobile-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
                    <div id="mobile-menu" class="site-mobile-menu hidden flex-col">
                        ${mobileLinks()}
                        <div class="site-mobile-auth">
                            <a href="auth/login.html" class="border border-slate-200 text-slate-700" data-i18n="nav.login">${t("nav.login")}</a>
                            <a href="auth/signup.html" class="bg-blue-600 text-white" data-i18n="nav.signup">${t("nav.signup")}</a>
                        </div>
                    </div>
                </div>
            </div>
            <nav class="gap-12 py-4 items-center lg:hidden md:flex hidden text-gray-500 justify-center">
                ${desktopLinks()}
            </nav>
        `;
        return header;
    }

    function createFooter() {
        const footer = document.createElement("footer");
        footer.className = "site-footer border-t border-slate-200 bg-slate-50/90 py-12 md:py-14";
        footer.id = "about";
        footer.innerHTML = `
            <div class="site-container">
                <div class="grid gap-10 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr]">
                    <div class="max-w-sm space-y-5">
                        <a href="../index.html" class="footer-logo inline-flex items-center" aria-label="InternGuide home">
                            <img class="logo" src="../src/assets/images/logo.png" alt="InternGuide Logo">
                        </a>
                        <p class="text-sm leading-7 text-slate-600">
                            InternGuide helps students and young professionals discover internships, build career skills,
                            and prepare for the next step in their future.
                        </p>
                        <div class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                            Career-ready opportunities
                        </div>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold uppercase tracking-[0.12em] text-slate-900">Explore</h3>
                        <ul class="mt-4 space-y-3 text-sm text-slate-600">
                            <li><a class="transition hover:text-blue-700 hover:underline hover:underline-offset-4" href="../index.html">Home</a></li>
                            <li><a class="transition hover:text-blue-700 hover:underline hover:underline-offset-4" href="internships.html">Internships</a></li>
                            <li><a class="transition hover:text-blue-700 hover:underline hover:underline-offset-4" href="career-guide.html">Career Guide</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold uppercase tracking-[0.12em] text-slate-900">Resources</h3>
                        <ul class="mt-4 space-y-3 text-sm text-slate-600">
                            <li><a class="transition hover:text-blue-700 hover:underline hover:underline-offset-4" href="cv-interview.html">CV &amp; Interview</a></li>
                            <li><a class="transition hover:text-blue-700 hover:underline hover:underline-offset-4" href="about-contact.html">About</a></li>
                            <li><a class="transition hover:text-blue-700 hover:underline hover:underline-offset-4" href="about-contact.html">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold uppercase tracking-[0.12em] text-slate-900">Follow us</h3>
                        <div class="mt-4 flex items-center gap-3">
                            <a class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-blue-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" href="#" aria-label="Facebook">
                                <i class="fa-brands fa-facebook-f"></i>
                            </a>
                            <a class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-blue-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" href="#" aria-label="Instagram">
                                <i class="fa-brands fa-instagram"></i>
                            </a>
                            <a class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-blue-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" href="#" aria-label="LinkedIn">
                                <i class="fa-brands fa-linkedin-in"></i>
                            </a>
                            <a class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-blue-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" href="#" aria-label="GitHub">
                                <i class="fa-brands fa-github"></i>
                            </a>
                            <a class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-blue-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" href="#" aria-label="Telegram">
                                <i class="fa-brands fa-telegram"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-10 border-t border-slate-200 pt-6">
                    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>© <span id="footerYear">2026</span> InternGuide. All rights reserved.</span>
                        </div>

                        <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <a class="transition hover:text-blue-700" href="../index.html">Home</a>
                            <a class="transition hover:text-blue-700" href="internships.html">Internships</a>
                            <a class="transition hover:text-blue-700" href="career-guide.html">Career Guide</a>
                            <a class="transition hover:text-blue-700" href="about-contact.html">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const yearEl = footer.querySelector("#footerYear");
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }

        return footer;
    }

    function desktopLinks() {
        return Object.entries(pages).map(([key, page]) => `
            <a href="${page.href}" class="${key === currentPage ? activeClass : normalClass}" data-i18n="${page.key}">${t(page.key)}</a>
        `).join("");
    }

    function mobileLinks() {
        return Object.entries(pages).map(([key, page]) => `
            <a href="${page.href}" class="${key === currentPage ? "active-mobile" : "flex h-10 items-center justify-center gap-2 border-b border-gray-200 text-sm font-medium text-[#3f5ddd] hover:bg-gray-100"}" data-i18n="${page.key}">
                ${t(page.key)}
            </a>
        `).join("");
    }

    function getCurrentPage() {
        const file = window.location.pathname.split("/").pop();

        if (file === "internships.html") return "internships";
        if (file === "career-guide.html") return "career";
        if (file === "cv-interview.html") return "cv";
        if (file === "about-contact.html") return "about";

        return "home";
    }
})();