// ====== i18n Translation Engine ======
// Supports: English (en), Hindi (hi), Marathi (mr)
// Stores preference in localStorage, defaults to English

const I18n = {
    translations: {},
    currentLang: 'en',
    langMap: { 'English': 'en', 'Hindi': 'hi', 'Marathi': 'mr' },
    loaded: false,

    // Initialize: load saved language and translations
    async init() {
        const saved = localStorage.getItem('vendorverse_lang');
        if (saved && this.langMap[saved]) {
            this.currentLang = this.langMap[saved];
        }
        await this.loadTranslations(this.currentLang);
        this.loaded = true;
    },

    // Load translation file
    async loadTranslations(langCode) {
        try {
            const response = await fetch(`lang/${langCode}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.warn(`Failed to load ${langCode}.json, falling back to English`);
            if (langCode !== 'en') {
                const response = await fetch('lang/en.json');
                this.translations = await response.json();
            }
        }
    },

    // Set language and reload translations
    async setLanguage(langName) {
        const code = this.langMap[langName] || 'en';
        this.currentLang = code;
        localStorage.setItem('vendorverse_lang', langName);

        // Update AppState
        if (typeof AppState !== 'undefined') {
            AppState.language = langName;
        }

        await this.loadTranslations(code);

        // Re-render the current screen
        if (typeof renderScreen === 'function') {
            renderScreen();
        }
    },

    // Get the display name of the current language
    getLanguageName() {
        for (const [name, code] of Object.entries(this.langMap)) {
            if (code === this.currentLang) return name;
        }
        return 'English';
    }
};

// Translation helper function — use t('key') anywhere
function t(key) {
    return I18n.translations[key] || key;
}

// Get current language name
function getCurrentLanguage() {
    return I18n.getLanguageName();
}
