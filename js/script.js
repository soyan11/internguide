// ======================================================
// INTERNGUIDE SHARED SCRIPT
// Mobile navigation + Home internship search/filter
// Works with static or dynamically rendered Supabase cards
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // RESPONSIVE MOBILE MENU
    // ==================================================

    const toggleBtn = document.getElementById("toggle-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (toggleBtn && mobileMenu) {
        const closeMenu = () => {
            mobileMenu.classList.add("hidden");
            mobileMenu.classList.remove("flex");
            toggleBtn.setAttribute("aria-expanded", "false");
            toggleBtn.setAttribute("aria-label", "Open menu");
            toggleBtn.classList.remove("bg-gray-200");
        };

        const openMenu = () => {
            mobileMenu.classList.remove("hidden");
            mobileMenu.classList.add("flex");
            toggleBtn.setAttribute("aria-expanded", "true");
            toggleBtn.setAttribute("aria-label", "Close menu");
            toggleBtn.classList.add("bg-gray-200");
        };

        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "Open menu");

        toggleBtn.addEventListener("click", (event) => {
            event.stopPropagation();

            if (mobileMenu.classList.contains("hidden")) {
                openMenu();
                return;
            }

            closeMenu();
        });

        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (!mobileMenu.contains(event.target) && !toggleBtn.contains(event.target)) {
                closeMenu();
            }
        });
    }


    // ==================================================
    // HOME PAGE INTERNSHIP SEARCH & FILTER
    // ==================================================

    const form = document.getElementById(
        "home-search-form"
    );

    const input = document.getElementById(
        "home-search-input"
    );

    const empty = document.getElementById(
        "internship-empty-state"
    );

    const internshipList = document.getElementById(
        "internship-list"
    );

    const filters = Array.from(
        document.querySelectorAll(
            ".category-filter"
        )
    );


    // This script is shared between pages.
    // If this page does not contain the Home
    // internship search, stop here.

    if (
        !form ||
        !input ||
        !internshipList
    ) {
        return;
    }


    let activeCategory = "";


    // ==================================================
    // GET INTERNSHIP CARDS
    // ==================================================

    function getCards() {

        const cards =
            Array.from(
                internshipList.querySelectorAll(
                    "[data-internship-card], .internship-card"
                )
            );

        // Remove duplicates
        return [...new Set(cards)];
    }


    // ==================================================
    // NORMALIZE TEXT
    // ==================================================

    function normalize(value) {

        return String(value ?? "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
    }


    // ==================================================
    // GET SEARCHABLE TEXT
    // ==================================================

    function getSearchText(card) {

        // Preferred method
        if (card.dataset.search) {

            return normalize(
                card.dataset.search
            );
        }

        // Fallback:
        // Search all visible card text
        return normalize(
            card.textContent
        );
    }


    // ==================================================
    // GET CATEGORY DATA
    // ==================================================

    function getCategories(card) {

        // Preferred method
        if (card.dataset.category) {

            return normalize(
                card.dataset.category
            )
                .split(/[\s,|/]+/)
                .filter(Boolean);
        }


        // Fallback:
        // Look for category elements
        const values = [];

        card.querySelectorAll(
            `
            [data-category],
            .category,
            .category-tag,
            .badge,
            [class*="category"]
            `
        ).forEach((element) => {

            const value =
                element.dataset.category ||
                element.textContent;

            if (value) {
                values.push(
                    normalize(value)
                );
            }

        });


        return values.flatMap(
            (value) =>
                value
                    .split(/[\s,|/]+/)
                    .filter(Boolean)
        );
    }


    // ==================================================
    // FILTER INTERNSHIPS
    // ==================================================

    function applyFilters() {

        const cards = getCards();

        const query =
            normalize(input.value);

        let visible = 0;


        cards.forEach((card) => {

            // Get searchable information
            const searchText =
                getSearchText(card);


            // Get category information
            const categories =
                getCategories(card);


            // Search matching
            const matchesSearch =
                !query ||
                searchText.includes(query);


            // Category matching
            const category =
                normalize(activeCategory);


            const matchesCategory =
                !category ||
                categories.includes(category) ||
                searchText.includes(category);


            // Final result
            const shouldShow =
                matchesSearch &&
                matchesCategory;


            // Show / hide card
            card.classList.toggle(
                "hidden",
                !shouldShow
            );


            if (shouldShow) {
                visible++;
            }

        });


        // ==================================================
        // EMPTY STATE
        // ==================================================

        if (empty) {

            /*
             * Do not show "No internships found"
             * while Supabase is still loading and
             * there are simply no cards yet.
             */

            const shouldShowEmpty =
                cards.length > 0 &&
                visible === 0;


            empty.classList.toggle(
                "hidden",
                !shouldShowEmpty
            );
        }
    }


    // ==================================================
    // SEARCH SUBMIT
    // ==================================================

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            applyFilters();


            // Scroll to internship section
            document
                .getElementById("internships")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        }
    );


    // ==================================================
    // LIVE SEARCH
    // ==================================================

    input.addEventListener(
        "input",
        () => {

            applyFilters();

        }
    );


    // ==================================================
    // CATEGORY FILTERS
    // ==================================================

    filters.forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const selected =
                    button.dataset.category || "";


                // Clicking the same category
                // removes the filter

                if (
                    normalize(activeCategory) ===
                    normalize(selected)
                ) {

                    activeCategory = "";

                } else {

                    activeCategory =
                        selected;

                }


                // ==================================================
                // UPDATE CATEGORY BUTTON UI
                // ==================================================

                filters.forEach((item) => {

                    const itemCategory =
                        item.dataset.category || "";


                    const isActive =
                        normalize(itemCategory) ===
                        normalize(activeCategory);


                    // Active
                    item.classList.toggle(
                        "bg-blue-600",
                        isActive
                    );

                    item.classList.toggle(
                        "text-white",
                        isActive
                    );

                    item.classList.toggle(
                        "border-blue-600",
                        isActive
                    );


                    // Inactive
                    item.classList.toggle(
                        "bg-white",
                        !isActive
                    );

                    item.classList.toggle(
                        "text-slate-600",
                        !isActive
                    );

                });


                // Apply filtering
                applyFilters();


                // Scroll to internships
                document
                    .getElementById("internships")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }
        );

    });


    // ==================================================
    // WATCH FOR SUPABASE INTERNSHIP CARDS
    // ==================================================

    /*
     * Supabase may load internship cards
     * after the page has already loaded.
     *
     * MutationObserver detects those new cards
     * and automatically applies the search/filter.
     */

    const observer =
        new MutationObserver(() => {

            applyFilters();

        });


    observer.observe(
        internshipList,
        {
            childList: true,
            subtree: true
        }
    );


    // ==================================================
    // INITIAL FILTER
    // ==================================================

    applyFilters();

});
