import './style.css';

type Internship = {
    id: string | number;
    title: string;
    company_id?: number | null;
    category_id?: number | null;
    location?: string | null;
    internship_type?: string | null;
    duration?: string | null;
    description?: string | null;
    skills?: string | string[] | null;
    application_url?: string | null;
    deadline?: string | null;
    status?: string | null;
    created_at?: string | null;
    companies?: {
        id: number;
        name: string;
        logo_url?: string | null;
    } | null;
    categories?: {
        id: number;
        name: string;
    } | null;
};

type HomepageWindow = Window & {
    supabaseClient?: any;

    lucide?: {
        createIcons: () => void;
    };

    InternGuideI18n?: {
        applyTranslations?: () => void;
    };
};

const homepage = window as HomepageWindow;

document.addEventListener('DOMContentLoaded', () => {
    initializeHomepageIcons();
    loadFeaturedInternships();
});

function initializeHomepageIcons() {
    homepage.lucide?.createIcons();
}

async function loadFeaturedInternships() {
    const list = document.getElementById('internship-list');
    const emptyState = document.getElementById('internship-empty-state');

    if (!list) {
        console.error('Homepage: #internship-list was not found.');
        return;
    }

    if (!homepage.supabaseClient) {
        console.error('Homepage: Supabase client was not found.');
        showLoadError(list, emptyState, 'Supabase is not available.');
        return;
    }

    // Show loading state immediately
    showLoadingState(list, emptyState);

    // Prevent the page from waiting forever
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
        controller.abort();
    }, 10000); // 10 seconds

    try {
        const { data, error } = await homepage.supabaseClient
            .from('internships')
            .select(`
                id,
                title,
                company_id,
                category_id,
                location,
                internship_type,
                duration,
                description,
                skills,
                application_url,
                deadline,
                status,
                created_at,
                companies (
                    id,
                    name,
                    logo_url
                ),
                categories (
                    id,
                    name
                )
            `)
            .in('status', ['active', 'approved'])
            .order('created_at', { ascending: false })
            .abortSignal(controller.signal);

        window.clearTimeout(timeoutId);

        if (error) {
            console.error('Homepage internships error:', error);

            showLoadError(
                list,
                emptyState,
                getSupabaseErrorMessage(error)
            );

            return;
        }

        const internships = (data || []) as Internship[];

        // Render internships
        list.innerHTML = internships
            .map(renderInternshipCard)
            .join('');

        initializeCompanyLogoFallbacks(list);

        if (internships.length > 0) {
            emptyState?.classList.add('hidden');
        } else {
            showNoInternshipsState(list, emptyState);
        }

        initializeHomepageIcons();

        // Let the i18n system translate newly rendered content
        homepage.InternGuideI18n?.applyTranslations?.();

    } catch (error: any) {
        window.clearTimeout(timeoutId);

        console.error(
            'Homepage internships loading failed:',
            error
        );

        if (error?.name === 'AbortError') {
            showLoadError(
                list,
                emptyState,
                'The internship service took too long to respond.'
            );
        } else {
            showLoadError(
                list,
                emptyState,
                'Unable to load internships right now.'
            );
        }
    }
}

function showLoadingState(
    list: HTMLElement,
    emptyState: HTMLElement | null
) {
    emptyState?.classList.add('hidden');

    list.innerHTML = `
        <div class="col-span-full flex min-h-40 items-center justify-center">
            <div class="flex flex-col items-center gap-3 text-center">
                <div
                    class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
                    aria-hidden="true"
                ></div>

                <p class="text-sm font-medium text-slate-500">
                    Loading internships...
                </p>
            </div>
        </div>
    `;
}

function showLoadError(
    list: HTMLElement,
    emptyState: HTMLElement | null,
    message: string
) {
    list.innerHTML = `
        <div class="col-span-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <i data-lucide="alert-circle" class="h-5 w-5"></i>
            </div>

            <h3 class="text-base font-semibold text-slate-800">
                Unable to load internships
            </h3>

            <p class="mt-1 text-sm text-slate-500">
                ${escapeHtml(message)}
            </p>

            <button
                type="button"
                id="retry-internships-btn"
                class="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Try Again
            </button>
        </div>
    `;

    emptyState?.classList.add('hidden');

    initializeHomepageIcons();

    document
        .getElementById('retry-internships-btn')
        ?.addEventListener('click', () => {
            loadFeaturedInternships();
        });
}

function showNoInternshipsState(
    list: HTMLElement,
    emptyState: HTMLElement | null
) {
    list.innerHTML = '';
    emptyState?.classList.remove('hidden');
    initializeHomepageIcons();
}

function getSupabaseErrorMessage(error: any) {
    if (!error) {
        return 'Unable to load internships right now.';
    }

    if (error.message) {
        return error.message;
    }

    return 'Unable to load internships right now.';
}

function renderInternshipCard(internship: Internship) {
    const companyName =
        internship.companies?.name ||
        'InternGuide Partner';

    const category =
        internship.categories?.name ||
        'Internship';

    const duration =
        internship.duration ||
        internship.internship_type ||
        'Internship';

    const location =
        internship.location ||
        'Remote';

    const description =
        internship.description ||
        'Build practical experience with a real-world team.';

    const skills = getInternshipSkillTags(internship, category, description);
    const searchableTerms = [
        internship.title,
        companyName,
        category,
        location,
        duration,
        description,
        ...skills
    ].join(' ');
    const applicationUrl = getSafeApplicationUrl(internship.application_url);
    const applicationHref = applicationUrl || 'pages/internships.html';
    const applicationTarget = applicationUrl ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `
        <article
            data-internship-card
            data-category="${escapeHtml(category)}"
            data-skills="${escapeHtml(skills.join(','))}"
            data-search="${escapeHtml(searchableTerms)}"
            class="flex h-80 min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
            <div class="flex items-start justify-between gap-2">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5">
                ${renderCompanyMark(companyName, internship.companies?.logo_url)}
                </div>
                <span data-category-tag class="mt-1 max-w-[60%] truncate rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                    ${escapeHtml(category)}
                </span>
            </div>

            <h3 class="mt-3 line-clamp-2 min-h-10 text-[15px] font-semibold leading-5 text-slate-900">
                ${escapeHtml(internship.title)}
            </h3>

            <p class="mt-0.5 truncate text-[11px] font-medium text-slate-700">
                ${escapeHtml(companyName)}
            </p>

            <div class="mt-2 flex min-w-0 items-center gap-2 text-[10px] font-medium text-slate-500">
                <span class="inline-flex items-center gap-1">
                    <i data-lucide="map-pin" class="h-3 w-3 shrink-0"></i>
                    ${escapeHtml(location)}
                </span>
                <span aria-hidden="true" class="text-slate-300">•</span>
                <span class="inline-flex items-center gap-1 truncate">
                    <i data-lucide="clock-3" class="h-3 w-3 shrink-0"></i>
                    ${escapeHtml(duration)}
                </span>
            </div>

            <p title="${escapeHtml(description)}" class="mt-2 line-clamp-2 min-h-8 text-xs leading-4 text-slate-500">
                ${escapeHtml(description)}
            </p>

            <div class="mt-3 flex min-h-6 flex-wrap gap-1.5 overflow-hidden">
                ${skills.map(skill => `
                    <span data-skill-tag="${escapeHtml(skill)}" class="rounded bg-blue-50 px-2 py-1 text-[9px] font-medium text-blue-700">
                        ${escapeHtml(skill)}
                    </span>
                `).join('')}
            </div>

            <a href="${escapeHtml(applicationHref)}"${applicationTarget}
                class="mt-auto inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-blue-500 text-[10px] font-semibold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white">
                <span>Apply Now</span>
                <i data-lucide="arrow-right" class="h-3 w-3"></i>
            </a>
        </article>
    `;
}

function getInternshipSkillTags(internship: Internship, category: string, description: string) {
    const storedSkills = internship.skills;
    let parsedSkills: string[] = [];

    if (Array.isArray(storedSkills)) {
        parsedSkills = storedSkills.map(String);
    } else if (storedSkills?.trim()) {
        try {
            const parsed = JSON.parse(storedSkills);
            parsedSkills = Array.isArray(parsed)
                ? parsed.map(String)
                : storedSkills.split(/[,;\n]/);
        } catch {
            parsedSkills = storedSkills.split(/[,;\n]/);
        }
    }

    const cleanSkills = [...new Set(parsedSkills.map(skill => skill.trim()).filter(Boolean))];
    if (cleanSkills.length) return cleanSkills.slice(0, 2);

    const searchableText = `${internship.title} ${description}`.toLowerCase();
    if (/marketing|campaign|content|social media|seo/.test(searchableText)) {
        return ['Marketing', 'Content Creation'];
    }
    if (/network|infrastructure|troubleshoot|technical support/.test(searchableText)) {
        return ['Networking', 'Technical Support'];
    }
    if (/business analyst|business research|data-driven/.test(searchableText)) {
        return ['Business Analysis', 'Data Analysis'];
    }
    if (/ui\/ux|user interface|user research|product design/.test(searchableText)) {
        return ['UI Design', 'UX Research'];
    }
    if (/data analyst|data analytics|data analysis|dashboard|reporting/.test(searchableText)) {
        return ['Data Analysis', 'Data Visualization'];
    }
    if (/software engineer|software development|programming|development project/.test(searchableText)) {
        return ['Software Development', 'Programming'];
    }

    const categoryDefaults: Record<string, string[]> = {
        business: ['Business Analysis', 'Data Analysis'],
        design: ['UI Design', 'UX Research'],
        engineering: ['Engineering', 'Problem Solving'],
        marketing: ['Marketing', 'Content Creation'],
        science: ['Research', 'Data Analysis'],
        technology: ['Data Analysis', 'Problem Solving']
    };

    return categoryDefaults[category.trim().toLowerCase()] || ['Research', 'Communication'];
}

function renderCompanyMark(companyName: string, logoUrl?: string | null) {
    const normalized = companyName.trim().toLowerCase();
    const initials = companyName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase();

    const safeLogoUrl = getSafeApplicationUrl(logoUrl);
    if (safeLogoUrl) {
        return `
            <img data-company-logo src="${escapeHtml(safeLogoUrl)}" alt=""
                class="h-full w-full object-contain">
            <span data-company-initials class="hidden text-xs font-bold text-blue-700">${escapeHtml(initials || 'IG')}</span>
        `;
    }

    const companyDomains: Record<string, string> = {
        'aba bank': 'ababank.com',
        'smart axiata': 'smart.com.kh',
        'wing bank': 'wingbank.com.kh',
        grab: 'grab.com',
        google: 'google.com',
        microsoft: 'microsoft.com',
        shopee: 'shopee.com'
    };
    const domain = companyDomains[normalized];

    if (!domain) {
        return `<span class="text-xs font-bold text-blue-700">${escapeHtml(initials || 'IG')}</span>`;
    }

    return `
        <img data-company-logo src="https://www.google.com/s2/favicons?domain=${domain}&amp;sz=128"
            alt="" class="h-full w-full object-contain">
        <span data-company-initials class="hidden text-xs font-bold text-blue-700">${escapeHtml(initials || 'IG')}</span>
    `;
}

function initializeCompanyLogoFallbacks(container: HTMLElement) {
    container.querySelectorAll<HTMLImageElement>('[data-company-logo]').forEach(image => {
        image.addEventListener('error', () => {
            image.classList.add('hidden');
            image.nextElementSibling?.classList.remove('hidden');
        }, { once: true });
    });
}

function getSafeApplicationUrl(value?: string | null) {
    if (!value) return '';

    try {
        const url = new URL(value, window.location.href);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
        return '';
    }
}

function escapeHtml(value: string) {
    return String(value).replace(/[&<>'"]/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[character] || character));
}
