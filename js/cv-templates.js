(() => {
  const accents = {
    blue: "#3B5BDB",
    navy: "#1E3A5F",
    green: "#2E6B50",
    purple: "#6B4E8E",
    teal: "#167C80",
    gray: "#64748B"
  };

  const sidebarColors = {
    blue: "#173B55",
    navy: "#173B55",
    green: "#244A3B",
    purple: "#45354F",
    teal: "#16484D",
    gray: "#303B49"
  };

  const templates = [
    {
      id: "modern-it-student",
      name: "Modern IT Student",
      category: "IT / Internship / Student",
      description: "A modern, balanced CV layout designed for IT students and junior developers.",
      bestFor: "IT internships, junior developers, students, entry-level technology roles",
      supportsPhoto: true,
      layout: "Balanced sections with projects, skills, and education up front.",
      order: ["profileSection", "skillsSection", "projectsSection", "educationSection", "experienceSection", "leadershipSection", "certificatesSection", "languagesSection", "referencesSection"]
    },
    {
      id: "minimal-professional",
      name: "Minimal Professional",
      category: "Corporate / ATS / Professional",
      description: "A clean, conservative CV layout for professional company applications.",
      bestFor: "Corporate applications, internships, formal roles, ATS-friendly resumes",
      supportsPhoto: false,
      layout: "Single-column, text-first structure with minimal decoration.",
      order: ["profileSection", "skillsSection", "experienceSection", "projectsSection", "educationSection", "leadershipSection", "certificatesSection", "languagesSection", "referencesSection"]
    },
    {
      id: "creative-it",
      name: "Creative IT",
      category: "Web / UI-UX / Creative Technology",
      description: "A professional two-column layout for developers and creative technology students.",
      bestFor: "Web developers, frontend developers, UI/UX students, creative technology roles",
      supportsPhoto: true,
      layout: "Compact skills sidebar paired with a wide project and experience column.",
      order: ["profileSection", "skillsSection", "languagesSection", "certificatesSection", "experienceSection", "projectsSection", "educationSection", "leadershipSection", "referencesSection"]
    },
    {
      id: "project-focus",
      name: "Project Focus",
      category: "Student / Internship / Portfolio",
      description: "A student CV that gives academic and personal projects the space they deserve.",
      bestFor: "Students, internship applicants, early-career developers, limited work experience",
      supportsPhoto: false,
      layout: "Projects are emphasized after education, with skills and activities close behind.",
      order: ["profileSection", "educationSection", "projectsSection", "skillsSection", "leadershipSection", "experienceSection", "certificatesSection", "languagesSection", "referencesSection"]
    },
    {
      id: "premium-one-page",
      name: "Premium One-Page",
      category: "Professional / Modern / Career",
      description: "A polished, compact CV for a complete professional profile on one page.",
      bestFor: "Internship applications, junior positions, professional and general-purpose CVs",
      supportsPhoto: true,
      layout: "Compact typography and prioritized sections keep concise profiles on one page.",
      order: ["profileSection", "skillsSection", "projectsSection", "educationSection", "experienceSection", "leadershipSection", "certificatesSection", "languagesSection", "referencesSection"]
    },
    {
      id: "professional-sidebar",
      name: "Professional Sidebar",
      category: "Professional / Corporate / Modern",
      description: "Classic two-column CV with a dark professional sidebar and clean experience-focused content area.",
      bestFor: "Professional roles, corporate applications, experienced candidates, business careers",
      supportsPhoto: true,
      layout: "Dark compact sidebar for contact, education, skills, and languages; white experience-led content area.",
      order: ["profileSection", "experienceSection", "projectsSection", "leadershipSection", "certificatesSection", "referencesSection", "educationSection", "skillsSection", "languagesSection"]
    }
  ];

  const originalHeadings = {
    profileSection: "PROFESSIONAL SUMMARY",
    skillsSection: "TECHNICAL SKILLS",
    educationSection: "EDUCATION",
    projectsSection: "PROJECTS",
    experienceSection: "EXPERIENCE",
    leadershipSection: "LEADERSHIP & ACTIVITIES",
    certificatesSection: "CERTIFICATIONS & ACHIEVEMENTS",
    languagesSection: "LANGUAGES",
    referencesSection: "REFERENCES"
  };

  const premiumHeadings = {
    profileSection: "PROFILE",
    skillsSection: "CORE SKILLS",
    projectsSection: "SELECTED PROJECTS",
    leadershipSection: "LEADERSHIP & ACTIVITIES"
  };

  const sectionControls = [
    ["profileSection", "pSummary", "Professional profile"],
    ["skillsSection", "pSkills", "Technical skills"],
    ["educationSection", "pEducation", "Education"],
    ["projectsSection", "pProjects", "Projects"],
    ["experienceSection", "pExperience", "Experience"],
    ["leadershipSection", "pLeadership", "Leadership & activities"],
    ["certificatesSection", "pCertificates", "Certificates & achievements"],
    ["languagesSection", "pLanguages", "Languages"],
    ["referencesSection", "pReferences", "References"]
  ];

  let selectedId = templates[0].id;
  let selectedAccent = "blue";
  let initialized = false;
  let ready = false;
  let livePreviewObserver = null;
  let activeDialogPreview = null;
  let splitEntrySequence = 0;
  let hiddenSections = new Set();

  function selectedTemplate() {
    return templates.find((template) => template.id === selectedId) || templates[0];
  }

  function renderCards() {
    const grid = document.getElementById("cvTemplateGrid");
    if (!grid) return;

    grid.innerHTML = templates.map((template, index) => `
      <article class="cv-template-card" data-template-card="${template.id}">
        <div class="cv-template-thumb" data-template="${template.id}" aria-hidden="true">
          <div class="cv-thumb-header"><i></i><b></b><span></span></div>
          <div class="cv-thumb-body">
            <div class="cv-thumb-sidebar"><i></i><i></i><i></i><i></i></div>
            <div class="cv-thumb-main"><b></b><i></i><i></i><b></b><i></i><i></i><b></b><i></i></div>
          </div>
        </div>
        <div class="cv-template-copy">
          <div class="cv-template-topline">
            <span class="cv-template-number">TEMPLATE ${String(index + 1).padStart(2, "0")}</span>
            <span class="cv-template-selected" hidden>Selected</span>
          </div>
          <h3>${escapeHTML(template.name)}</h3>
          <p class="cv-template-category">${escapeHTML(template.category)}</p>
          <p class="cv-template-description">${escapeHTML(template.description)}</p>
          <p class="cv-template-best"><strong>Best suited for</strong> ${escapeHTML(template.bestFor)}</p>
          <div class="cv-template-actions">
            <button type="button" class="cv-template-preview" data-preview-template="${template.id}">Preview</button>
            <button type="button" class="cv-template-use" data-use-template="${template.id}">Use This Template</button>
          </div>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-preview-template]").forEach((button) => {
      button.addEventListener("click", () => openPreview(button.dataset.previewTemplate));
    });
    grid.querySelectorAll("[data-use-template]").forEach((button) => {
      button.addEventListener("click", () => selectTemplate(button.dataset.useTemplate));
    });
    refreshSelection();
  }

  function refreshSelection() {
    document.getElementById("cvCustomization")?.style.setProperty("--cv-accent", accents[selectedAccent]);
    document.querySelectorAll("[data-template-card]").forEach((card) => {
      const isSelected = card.dataset.templateCard === selectedId;
      card.style.setProperty("--cv-accent", accents[selectedAccent]);
      card.classList.toggle("is-selected", isSelected);
      const badge = card.querySelector(".cv-template-selected");
      if (badge) badge.hidden = !isSelected;
    });
    document.querySelectorAll("[data-cv-accent]").forEach((button) => {
      const isSelected = button.dataset.cvAccent === selectedAccent;
      button.setAttribute("aria-pressed", String(isSelected));
      button.classList.toggle("is-selected", isSelected);
    });
    document.querySelectorAll("[data-cv-section]").forEach((checkbox) => {
      checkbox.checked = !hiddenSections.has(checkbox.dataset.cvSection);
    });
  }

  function renderSectionControls() {
    const container = document.getElementById("cvSectionChoices");
    if (!container) return;
    container.innerHTML = sectionControls.map(([id, , label]) => `
      <label class="cv-section-choice">
        <input type="checkbox" data-cv-section="${id}" checked>
        <span>${escapeHTML(label)}</span>
      </label>
    `).join("");
  }

  function applyTemplateToElement(paper, templateId = selectedId, accentId = selectedAccent) {
    if (!paper) return;
    restoreProfessionalSidebarPages(paper);
    const template = templates.find((item) => item.id === templateId) || templates[0];
    arrangeProfessionalSidebar(paper, template.id === "professional-sidebar");
    paper.dataset.template = template.id;
    paper.style.setProperty("--cv-accent", accents[accentId] || accents.blue);
    paper.style.setProperty("--cv-sidebar", sidebarColors[accentId] || sidebarColors.blue);
    paper.dataset.supportsPhoto = String(template.supportsPhoto);

    const content = paper.querySelector(".pro-content");
    if (content) {
      content.style.display = template.id === "creative-it" ? "contents" : "flex";
      content.style.flexDirection = template.id === "creative-it" ? "" : "column";
    }

    template.order.forEach((sectionId, index) => {
      const section = paper.querySelector(`#${sectionId}`);
      if (section) section.style.order = String(index + 1);
    });

    sectionControls.forEach(([sectionId, contentId]) => {
      const section = paper.querySelector(`#${sectionId}`);
      const content = paper.querySelector(`#${contentId}`);
      if (!section || !content) return;
      section.classList.toggle("hidden", hiddenSections.has(sectionId) || !content.textContent.trim());
    });

    Object.entries(originalHeadings).forEach(([sectionId, heading]) => {
      const sectionHeading = paper.querySelector(`#${sectionId} .pro-heading`);
      if (sectionHeading) {
        let label = template.id === "premium-one-page" && premiumHeadings[sectionId]
          ? premiumHeadings[sectionId]
          : heading;

        if (template.id === "professional-sidebar") {
          if (sectionId === "profileSection") label = "PROFILE";
          if (sectionId === "experienceSection") label = "WORK EXPERIENCE";
          if (sectionId === "projectsSection" && !paper.querySelector("#pExperience")?.textContent.trim()) {
            label = "PROJECT EXPERIENCE";
          }
        }

        sectionHeading.textContent = label;
      }
    });

    if (template.id === "professional-sidebar") {
      applySidebarContact(paper);
      const contactSection = paper.querySelector("#contactSection");
      const contactContent = paper.querySelector("#pContact")?.textContent.trim();
      const linksContent = paper.querySelector("#pLinks")?.textContent.trim();
      contactSection?.classList.toggle("hidden", !contactContent && !linksContent);
      formatSidebarEducation(paper);
      sortEducationNewestFirst(paper);
      applySidebarSkills(paper, true);
      fitSidebarContent(paper);
      paginateProfessionalSidebar(paper);
    } else {
      applySidebarSkills(paper, false);
    }
  }

  function arrangeProfessionalSidebar(paper, enabled) {
    const sidebar = paper.querySelector("#cvSidebar");
    const mainHeader = paper.querySelector("#cvMainHeader");
    const headerText = paper.querySelector(".pro-header-text");
    const headerContent = paper.querySelector(".pro-header-content");
    const content = paper.querySelector(".pro-content");
    if (!sidebar || !mainHeader || !headerText || !headerContent || !content) return;

    const sidebarNodes = [
      "cvPhotoWrap", "contactSection", "educationSection", "skillsSection",
      "languagesSection", "certificatesSection"
    ];
    const mainHeaderNodes = ["pName", "pTitle"];
    const mainSectionNodes = [
      "profileSection", "experienceSection", "projectsSection",
      "leadershipSection", "referencesSection"
    ];

    if (enabled) {
      sidebarNodes.forEach((id) => {
        const node = paper.querySelector(`#${id}`);
        if (node) {
          node.classList.remove("cv-sidebar-overflow");
          if (node.parentElement !== sidebar) sidebar.append(node);
        }
      });
      mainHeaderNodes.forEach((id) => {
        const node = paper.querySelector(`#${id}`);
        if (node && node.parentElement !== mainHeader) mainHeader.append(node);
      });
      mainSectionNodes.forEach((id) => {
        const node = paper.querySelector(`#${id}`);
        if (node && node.parentElement !== content) content.append(node);
      });
      return;
    }

    mainHeaderNodes.forEach((id) => {
      const node = paper.querySelector(`#${id}`);
      if (node && node.parentElement !== headerText) headerText.append(node);
    });
    const contactSection = paper.querySelector("#contactSection");
    if (contactSection && contactSection.parentElement !== headerText) headerText.append(contactSection);
    const photo = paper.querySelector("#cvPhotoWrap");
    if (photo && photo.parentElement !== headerContent) headerContent.append(photo);

    [...sidebarNodes, ...mainSectionNodes].forEach((id) => {
      if (id === "cvPhotoWrap" || id === "contactSection") return;
      const node = paper.querySelector(`#${id}`);
      if (node) {
        node.classList.remove("cv-sidebar-overflow");
        if (node.parentElement !== content) content.append(node);
      }
    });
    sidebar.replaceChildren();
    mainHeader.replaceChildren();
  }

  function fitSidebarContent(paper) {
    const sidebar = paper.querySelector(".cv-sidebar");
    const mainContent = paper.querySelector(".cv-main .pro-content");
    if (!sidebar || !mainContent) return;

    ["certificatesSection", "languagesSection", "skillsSection", "educationSection"]
      .forEach((id) => {
        if (sidebar.scrollHeight <= sidebar.clientHeight) return;
        const section = sidebar.querySelector(`#${id}`);
        if (!section || section.classList.contains("hidden")) return;
        section.classList.add("cv-sidebar-overflow");
        mainContent.append(section);
      });
  }

  function applySidebarContact(paper) {
    const contact = paper.querySelector("#pContact");
    if (!contact) return;

    const contactFields = [
      ["☎", "cvPhone"],
      ["✉", "cvEmail"],
      ["⌖", "cvLocation"]
    ].map(([icon, id]) => [icon, document.getElementById(id)?.value.trim() || ""])
      .filter(([, text]) => text && !isPlaceholder(text));

    if (!contactFields.length) {
      if (paper.id === "cvPreview" || contact.querySelector(".cv-sidebar-contact-row")) {
        contact.replaceChildren();
      }
      return;
    }

    contact.innerHTML = contactFields.map(([icon, text]) => `
      <span class="cv-sidebar-contact-row">
        <span aria-hidden="true">${icon}</span>
        <span>${escapeHTML(text)}</span>
      </span>
    `).join("");
  }

  function formatSidebarEducation(paper) {
    const education = paper.querySelector("#pEducation");
    const inputText = document.getElementById("cvEducation")?.value.trim() || "";
    if (!education || !inputText) return;

    const entries = inputText.split(/\n\s*\n+/).map((block) => {
      const lines = block.split(/\n+/).map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return "";

      const firstLine = lines.shift().replace(/^[-•*]\s*/, "");
      const firstParts = firstLine.split(/\s+[—–-]\s+/).map((part) => part.trim()).filter((part) => !isPlaceholder(part));
      let institution = "";
      let qualification = "";
      const details = [];

      if (firstParts.length > 1) {
        institution = firstParts[0];
        qualification = firstParts.slice(1).shift() || "";
        details.push(...firstParts.slice(2));
      } else {
        qualification = firstParts[0] || "";
      }

      lines.forEach((line) => {
        const cleanLine = line.replace(/^[-•*]\s*/, "").trim();
        if (isPlaceholder(cleanLine)) return;

        const yearOfStudy = cleanLine.match(/^year\s*(?:of\s*)?study\s*:\s*(.+)$/i);
        const expectedGraduation = cleanLine.match(/^(?:expected\s*)?(?:graduation|graduate)\s*:\s*(.+)$/i);
        if (yearOfStudy && !isPlaceholder(yearOfStudy[1])) {
          details.push(/^year\b/i.test(yearOfStudy[1]) ? yearOfStudy[1] : `Year ${yearOfStudy[1]}`);
        } else if (expectedGraduation && !isPlaceholder(expectedGraduation[1])) {
          details.push(`Expected graduation: ${expectedGraduation[1]}`);
        } else {
          details.push(cleanLine);
        }
      });

      if (!qualification && details.length) qualification = details.shift();
      if (!institution && !qualification && !details.length) return "";

      return `
        <article class="pro-entry">
          ${qualification ? `<div class="pro-entry-title">${escapeHTML(qualification)}</div>` : ""}
          ${institution ? `<div class="pro-entry-subtitle">${escapeHTML(institution)}</div>` : ""}
          ${details.length ? `<div class="pro-entry-date">${details.map(escapeHTML).join(" · ")}</div>` : ""}
        </article>
      `;
    }).filter(Boolean);

    if (entries.length) education.innerHTML = entries.join("");
  }

  function isPlaceholder(value) {
    return /^(?:n\/?a|not applicable|not available|none|null|undefined|[-–—])$/i.test(String(value || "").trim());
  }

  function restoreProfessionalSidebarPages(paper) {
    const pages = [...paper.querySelectorAll(":scope > .cv-page-continuation")];
    if (!pages.length) return;

    const firstPage = paper.querySelector(":scope > .cv-page");
    const firstContent = firstPage?.querySelector(".pro-content");
    if (!firstContent) return;

    pages.forEach((page) => {
      const content = page.querySelector(".pro-content");
      [...(content?.children || [])].forEach((section) => {
        const targetId = section.dataset.continuationFor;
        if (targetId) {
          const original = firstPage.querySelector(`#${targetId}`);
          const originalContent = original?.querySelector(".pro-entries, .pro-summary, .pro-skills, .pro-languages");
          const continuedContent = section.querySelector(".pro-entries, .pro-summary, .pro-skills, .pro-languages");
          if (originalContent && continuedContent) {
            while (continuedContent.firstChild) {
              const item = continuedContent.firstChild;
              const groupId = item.dataset?.cvSplitEntry;
              const originalItem = groupId
                ? originalContent.querySelector(`[data-cv-split-entry="${groupId}"]`)
                : null;
              const originalDescription = originalItem?.querySelector(".pro-entry-description");
              const continuedDescription = item.querySelector?.(".pro-entry-description");

              if (originalDescription && continuedDescription) {
                originalDescription.textContent = `${originalDescription.textContent} ${continuedDescription.textContent}`.trim();
                item.remove();
              } else {
                originalContent.append(item);
              }
            }
          }
          section.remove();
        } else {
          firstContent.append(section);
        }
      });
      page.remove();
    });
  }

  function createSidebarContinuationPage(paper, sourcePage) {
    const page = sourcePage.cloneNode(false);
    page.classList.add("cv-page-continuation");

    const sidebar = sourcePage.querySelector(".cv-sidebar").cloneNode(true);
    sidebar.removeAttribute("id");

    const mainSource = sourcePage.querySelector(".cv-main");
    const main = mainSource.cloneNode(false);
    main.removeAttribute("id");

    const header = mainSource.querySelector(".cv-main-header").cloneNode(true);
    header.removeAttribute("id");

    const content = sourcePage.querySelector(".pro-content").cloneNode(false);
    content.removeAttribute("id");
    content.replaceChildren();

    main.append(header, content);
    page.append(sidebar, main);
    paper.append(page);
    return { page, main, content, header };
  }

  function paginateProfessionalSidebar(paper) {
    const firstPage = paper.querySelector(":scope > .cv-page");
    const main = firstPage?.querySelector(".cv-main");
    const content = main?.querySelector(".pro-content");
    const header = main?.querySelector(".cv-main-header");
    if (!firstPage || !main || !content || !header) return;

    const pageHeight = 1122.52;
    const mainStyle = getComputedStyle(main);
    const topPadding = parseFloat(mainStyle.paddingTop) || 0;
    const bottomPadding = parseFloat(mainStyle.paddingBottom) || 0;
    const pageLimit = pageHeight - bottomPadding;
    let current = { page: firstPage, main, content, used: topPadding + header.getBoundingClientRect().height };
    const sections = [...content.children].filter((section) =>
      section.classList.contains("pro-section") && !section.classList.contains("hidden")
    );

    const addPage = () => {
      current = { ...createSidebarContinuationPage(paper, firstPage), used: topPadding };
      current.used += current.header.getBoundingClientRect().height;
      return current;
    };

    sections.forEach((section) => {
      const sectionContent = section.querySelector(".pro-entries, .pro-summary, .pro-skills, .pro-languages");
      let blocks = [...(sectionContent?.children || [])];
      const marginBottom = parseFloat(getComputedStyle(section).marginBottom) || 0;
      const originalHeadingHeight = section.querySelector(".pro-heading")?.getBoundingClientRect().height || 0;

      if (blocks.length === 1 && section.getBoundingClientRect().height + marginBottom > pageLimit - current.used) {
        const availableHeight = Math.max(140, pageLimit - current.used - originalHeadingHeight - marginBottom);
        const fragments = splitOversizedBlock(blocks[0], availableHeight);
        if (fragments.length > 1) {
          sectionContent.replaceChildren(...fragments);
          blocks = fragments;
        }
      }

      if (blocks.length < 2) {
        const blockHeight = section.getBoundingClientRect().height + marginBottom;
        if (current.used + blockHeight > pageLimit && current.content.children.length) addPage();
        current.content.append(section);
        current.used += blockHeight;
        return;
      }

      const originalContent = sectionContent;
      const heading = section.querySelector(".pro-heading");
      let activeSection = section;
      let activeContent = originalContent;
      let headingHeight = heading?.getBoundingClientRect().height || 0;
      let sectionStarted = false;

      blocks.forEach((block) => {
        const blockStyle = getComputedStyle(block);
        const blockHeight = block.getBoundingClientRect().height +
          (parseFloat(blockStyle.marginTop) || 0) +
          (parseFloat(blockStyle.marginBottom) || 0);
        const sectionOverhead = sectionStarted ? 0 : headingHeight + marginBottom;

        if (current.used + sectionOverhead + blockHeight > pageLimit && current.content.children.length) {
          const page = addPage();
          if (sectionStarted) {
            activeSection = section.cloneNode(false);
            activeSection.removeAttribute("id");
            activeSection.dataset.continuationFor = section.id;
            const continuedHeading = heading.cloneNode(true);
            const continuedContent = originalContent.cloneNode(false);
            continuedContent.removeAttribute("id");
            activeSection.append(continuedHeading, continuedContent);
            page.content.append(activeSection);
            activeContent = continuedContent;
            headingHeight = continuedHeading.getBoundingClientRect().height;
          } else {
            page.content.append(section);
            activeSection = section;
            activeContent = originalContent;
          }
          sectionStarted = false;
        }

        activeContent.append(block);
        current.used += blockHeight + (sectionStarted ? 0 : headingHeight);
        sectionStarted = true;
      });

      current.used += marginBottom;
    });
  }

  function splitOversizedBlock(block, availableHeight) {
    const description = block.matches(".pro-entry-description")
      ? block
      : block.querySelector(".pro-entry-description");
    const textNode = description || block;
    const text = textNode.textContent.trim();
    const characterLimit = Math.max(350, Math.floor((availableHeight / 14) * 42));
    if (!text || text.length <= characterLimit) return [block];

    const words = text.split(/\s+/);
    const chunks = [];
    let chunk = "";
    words.forEach((word) => {
      if (chunk && chunk.length + word.length + 1 > characterLimit) {
        chunks.push(chunk);
        chunk = word;
      } else {
        chunk = chunk ? `${chunk} ${word}` : word;
      }
    });
    if (chunk) chunks.push(chunk);
    if (chunks.length < 2) return [block];

    return chunks.map((part, index) => {
      const fragment = block.cloneNode(true);
      if (fragment.classList.contains("pro-entry")) {
        if (!block.dataset.cvSplitEntry) block.dataset.cvSplitEntry = `cv-split-${++splitEntrySequence}`;
        fragment.dataset.cvSplitEntry = block.dataset.cvSplitEntry;
      }
      const fragmentText = description
        ? (fragment.matches(".pro-entry-description") ? fragment : fragment.querySelector(".pro-entry-description"))
        : fragment;
      if (!fragmentText) return fragment;
      fragmentText.textContent = part;

      if (index > 0 && fragment.classList.contains("pro-entry")) {
        fragment.querySelectorAll(".pro-entry-subtitle, .pro-entry-date, .pro-bullets").forEach((element) => element.remove());
      }
      return fragment;
    });
  }

  function sortEducationNewestFirst(paper) {
    const education = paper.querySelector("#pEducation");
    if (!education) return;

    const entries = [...education.children];
    if (entries.length < 2) return;

    entries.map((element, index) => {
      const years = [...element.textContent.matchAll(/\b(?:19|20)\d{2}\b/g)]
        .map((match) => Number(match[0]));
      return { element, index, newestYear: years.length ? Math.max(...years) : 0 };
    }).sort((a, b) => (b.newestYear - a.newestYear) || (a.index - b.index))
      .forEach(({ element }) => education.append(element));
  }

  function applySidebarSkills(paper, useSidebarLayout) {
    const skillBox = paper.querySelector("#pSkills");
    if (!skillBox) return;

    if (!useSidebarLayout) {
      if (skillBox.dataset.cvCanonicalMarkup !== undefined) {
        skillBox.innerHTML = skillBox.dataset.cvCanonicalMarkup;
      }
      return;
    }

    const skillsText = document.getElementById("cvSkills")?.value.trim() || "";
    const skills = skillsText
      ? skillsText.split(/[,;•\n]+/).map((skill) => skill.trim()).filter(Boolean)
      : [...skillBox.querySelectorAll(".pro-skill-value")]
        .flatMap((value) => value.textContent.split(/[,;•\n]+/))
        .map((skill) => skill.trim())
        .filter(Boolean);
    if (!skills.length) return;

    skillBox.innerHTML = `
      <ul class="cv-sidebar-skill-list">
        ${skills.map((skill) => `<li>${escapeHTML(skill)}</li>`).join("")}
      </ul>
    `;
  }

  function applyToPreview() {
    const paper = document.getElementById("cvPreview");
    if (!paper) return;
    applyTemplateToElement(paper);
    const photo = paper.querySelector(".pro-photo-wrap");
    if (photo) photo.classList.toggle("template-photo-hidden", !selectedTemplate().supportsPhoto);
    refreshSelection();
    fitLivePreview();
  }

  function fitLivePreview() {
    const panel = document.getElementById("previewPanel");
    const paper = document.getElementById("cvPreview");
    const viewport = document.getElementById("cvPreviewViewport");
    if (!panel || !paper || !viewport) return;
    const scale = Math.min(1, panel.clientWidth / 794);
    viewport.style.width = `${794 * scale}px`;
    viewport.style.height = `${Math.max(1123, paper.scrollHeight) * scale}px`;
    paper.style.transform = `scale(${scale})`;
  }

  function prepareForPrint() {
    const paper = document.getElementById("cvPreview");
    const viewport = document.getElementById("cvPreviewViewport");
    if (!paper || !viewport) return;
    viewport.style.setProperty("width", "210mm", "important");
    viewport.style.setProperty("height", "auto", "important");
    paper.style.setProperty("transform", "none", "important");
    paper.style.setProperty("width", "210mm", "important");
    paper.style.setProperty("height", "auto", "important");
    paper.style.setProperty("overflow", "visible", "important");
  }

  function selectTemplate(templateId) {
    if (!templates.some((template) => template.id === templateId)) return;
    selectedId = templateId;
    refreshSelection();
    applyToPreview();
    if (typeof window.updatePreview === "function") window.updatePreview();
    if (ready && typeof window.scheduleAutoSave === "function") window.scheduleAutoSave();
    closePreview();
    document.getElementById("cvPreview")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function setAccent(accentId) {
    if (!Object.hasOwn(accents, accentId)) return;
    selectedAccent = accentId;
    refreshSelection();
    applyToPreview();
    if (ready && typeof window.scheduleAutoSave === "function") window.scheduleAutoSave();
  }

  function openPreview(templateId) {
    const template = templates.find((item) => item.id === templateId) || templates[0];
    const dialog = document.getElementById("cvTemplateDialog");
    const stage = document.getElementById("cvDialogStage");
    if (!dialog || !stage) return;

    document.getElementById("cvDialogTitle").textContent = template.name;
    document.getElementById("cvDialogDescription").textContent = template.description;
    stage.replaceChildren();

    const livePreview = document.getElementById("cvPreview");
    const preview = livePreview.cloneNode(true);
    preview.removeAttribute("id");
    preview.classList.add("cv-dialog-paper");
    preview.style.transform = "none";
    preview.style.maxWidth = "none";
    fillDemoIfEmpty(preview);
    applyTemplateToElement(preview, template.id, selectedAccent);
    const photo = preview.querySelector(".pro-photo-wrap");
    if (photo) photo.classList.toggle("template-photo-hidden", !template.supportsPhoto);
    stage.append(preview);
    activeDialogPreview = preview;

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    fitDialogPreview(preview, stage);
    document.getElementById("cvDialogUse").onclick = () => selectTemplate(template.id);
  }

  function fitDialogPreview(preview, stage) {
    const scale = Math.min(0.82, (window.innerWidth - 48) / 794);
    const fittedScale = Math.max(0.32, scale);
    preview.style.transform = `translateX(-50%) scale(${fittedScale})`;
    stage.style.height = `${Math.max(1123, preview.scrollHeight) * fittedScale}px`;
  }

  function fillDemoIfEmpty(paper) {
    const hasContent = [
      "cvName", "cvTitle", "cvEmail", "cvPhone", "cvLocation",
      "cvGithub", "cvLinkedin", "cvPortfolio", "cvSummary", "cvEducation",
      "cvCareerInterests", "cvSkills", "cvExperience", "cvProjects",
      "cvLeadership", "cvCertificates", "cvReferences", "cvLanguages"
    ]
      .some((id) => (document.getElementById(id)?.value || "").trim());
    if (hasContent) return;

    paper.querySelector("#pName").textContent = "Alex Johnson";
    paper.querySelector("#pTitle").textContent = "Information Technology Student";
    paper.querySelector("#pContact").textContent = "alex@email.com | GitHub | LinkedIn | Portfolio";
    paper.querySelector("#pLinks").textContent = "github.com/alexjohnson | linkedin.com/in/alexjohnson | alexjohnson.dev";
    paper.querySelector("#pSummary").innerHTML = "<p>Information technology student interested in software development and building useful, accessible digital products.</p>";
    paper.querySelector("#pSkills").innerHTML = '<div class="pro-skill-label">Development</div><div class="pro-skill-value">JavaScript, Node.js, PostgreSQL</div><div class="pro-skill-label">Tools</div><div class="pro-skill-value">Git, GitHub, Figma</div>';
    paper.querySelector("#pEducation").innerHTML = '<article class="pro-entry"><div class="pro-entry-title">BSc Information Technology</div><div class="pro-entry-subtitle">Example University</div></article>';
    paper.querySelector("#pProjects").innerHTML = '<article class="pro-entry"><div class="pro-entry-title">ShortURL Web Application</div><div class="pro-entry-subtitle">Node.js, Express.js, PostgreSQL</div><div class="pro-entry-description">Built a URL shortening service with click tracking and a structured database.</div><ul class="pro-bullets"><li>Developed REST API endpoints and authentication.</li><li>Designed relational database tables.</li></ul></article>';
    paper.querySelector("#pExperience").innerHTML = '<article class="pro-entry"><div class="pro-entry-title">Student Developer</div><div class="pro-entry-subtitle">Academic project team</div><div class="pro-entry-description">Collaborated on a responsive student-focused web application.</div></article>';
    paper.querySelector("#pLeadership").innerHTML = '<article class="pro-entry"><div class="pro-entry-title">Technology Club</div><div class="pro-entry-subtitle">Project volunteer</div></article>';
    paper.querySelector("#pCertificates").innerHTML = '<article class="pro-entry"><div class="pro-entry-title">Web Development Foundations</div></article>';
    paper.querySelector("#pLanguages").innerHTML = '<div class="pro-language"><strong>English</strong> — Professional</div>';
    paper.querySelector("#pReferences").innerHTML = '<article class="pro-entry"><div class="pro-entry-title">References available upon request</div></article>';
    paper.querySelectorAll(".pro-section").forEach((section) => section.classList.remove("hidden"));
  }

  function closePreview() {
    const dialog = document.getElementById("cvTemplateDialog");
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    else dialog?.removeAttribute("open");
  }

  function initialize() {
    if (initialized) return;
    initialized = true;
    renderCards();

    const previewPanel = document.getElementById("previewPanel");
    if (previewPanel && window.ResizeObserver) {
      livePreviewObserver = new ResizeObserver(fitLivePreview);
      livePreviewObserver.observe(previewPanel);
    } else {
      window.addEventListener("resize", fitLivePreview);
    }

    document.getElementById("cvAccentChoices")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cv-accent]");
      if (button) setAccent(button.dataset.cvAccent);
    });
    renderSectionControls();
    document.getElementById("cvSectionChoices")?.addEventListener("change", (event) => {
      const checkbox = event.target.closest("input[data-cv-section]");
      if (!checkbox) return;
      if (checkbox.checked) hiddenSections.delete(checkbox.dataset.cvSection);
      else hiddenSections.add(checkbox.dataset.cvSection);
      applyToPreview();
      if (ready && typeof window.scheduleAutoSave === "function") window.scheduleAutoSave();
    });
    document.getElementById("cvDialogClose")?.addEventListener("click", closePreview);
    document.getElementById("cvTemplateDialog")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closePreview();
    });
    document.getElementById("cvTemplateDialog")?.addEventListener("close", () => {
      activeDialogPreview = null;
      document.getElementById("cvDialogStage")?.replaceChildren();
    });

    window.addEventListener("resize", () => {
      if (activeDialogPreview) {
        fitDialogPreview(activeDialogPreview, document.getElementById("cvDialogStage"));
      }
    });

    document.querySelectorAll("[data-cv-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const step = button.dataset.cvStep;
        if (step === "template") document.getElementById("templateChooser")?.scrollIntoView({ behavior: "smooth" });
        if (step === "information") document.getElementById("cvEditor")?.scrollIntoView({ behavior: "smooth" });
        if (step === "customize") document.getElementById("cvCustomization")?.scrollIntoView({ behavior: "smooth" });
        if (step === "preview") openPreview(selectedId);
        if (step === "download" && typeof window.printCV === "function") window.printCV();
      });
    });

    document.getElementById("cvPreviewOpen")?.addEventListener("click", () => openPreview(selectedId));
    applyToPreview();
  }

  function refresh() {
    refreshSelection();
    applyToPreview();
  }

  function getDraftState() {
    return { templateId: selectedId, accentColor: selectedAccent, hiddenSections: [...hiddenSections] };
  }

  function loadDraftState(draft) {
    if (templates.some((template) => template.id === draft?.templateId)) selectedId = draft.templateId;
    if (Object.hasOwn(accents, draft?.accentColor)) selectedAccent = draft.accentColor;
    hiddenSections = new Set(
      Array.isArray(draft?.hiddenSections)
        ? draft.hiddenSections.filter((id) => sectionControls.some(([sectionId]) => sectionId === id))
        : []
    );
    refresh();
  }

  function markReady() {
    ready = true;
    refresh();
  }

  function restorePreviewPages() {
    const paper = document.getElementById("cvPreview");
    if (paper) restoreProfessionalSidebarPages(paper);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  window.cvTemplateSystem = {
    initialize,
    applyToPreview,
    prepareForPrint,
    restoreScreenPreview: fitLivePreview,
    getDraftState,
    loadDraftState,
    restorePreviewPages,
    markReady,
    refresh
  };
})();
