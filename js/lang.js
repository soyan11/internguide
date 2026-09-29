const LANG_KEY = 'app_language';

const LANGUAGES = {
  en: { flag: '🇺🇸', name: 'English' },
  km: { flag: '🇰🇭', name: 'Khmer' }
};

function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || 'en';
}

function updateLangUI(lang) {
  const iconSpan = document.getElementById('currentLangIcon');
  if (iconSpan && LANGUAGES[lang]) {
    iconSpan.textContent = LANGUAGES[lang].flag;
  }
}

function initLanguageSwitcher() {
  const currentLang = getCurrentLang();
  updateLangUI(currentLang);

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.onclick = (e) => {
      e.preventDefault();
      const activeLang = getCurrentLang();
      const newLang = activeLang === 'en' ? 'km' : 'en';
      
      localStorage.setItem(LANG_KEY, newLang);
      updateLangUI(newLang);
      
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));
    };
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
  initLanguageSwitcher();
}