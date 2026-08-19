// Language Helper Functions
// This file contains utility functions for the translation system

const LangHelpers = {
  // Language selector HTML component
  getLangSelectorHTML() {
    return `
      <div class="lang-selector" id="lang-selector">
        <button class="lang-trigger" id="lang-trigger" aria-label="Select language">
          <span id="current-lang">EN</span>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <div class="lang-dropdown" id="lang-dropdown">
          <div class="lang-option active" data-lang="en">
            <div class="lang-option-left">
              <div class="lang-flag">🇬🇧</div>
              <div class="lang-name">
                <span class="lang-name-primary">English</span>
                <span class="lang-name-native">English</span>
              </div>
            </div>
            <i class="ri-check-line lang-check"></i>
          </div>
          <div class="lang-option" data-lang="am">
            <div class="lang-option-left">
              <div class="lang-flag">🇪🇹</div>
              <div class="lang-name">
                <span class="lang-name-primary">Amharic</span>
                <span class="lang-name-native">አማርኛ</span>
              </div>
            </div>
            <i class="ri-check-line lang-check"></i>
          </div>
          <div class="lang-option" data-lang="om">
            <div class="lang-option-left">
              <div class="lang-flag">🇪🇹</div>
              <div class="lang-name">
                <span class="lang-name-primary">Afaan Oromo</span>
                <span class="lang-name-native">Afaan Oromoo</span>
              </div>
            </div>
            <i class="ri-check-line lang-check"></i>
          </div>
        </div>
      </div>
    `;
  },

  // Inject language selector if it doesn't exist
  injectLangSelector() {
    // Check if selector already exists
    if (document.getElementById('lang-selector')) {
      return;
    }

    // Find nav-actions container
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) {
      console.warn('Nav actions container not found');
      return;
    }

    // Get theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
      console.warn('Theme toggle not found');
      return;
    }

    // Insert language selector before theme toggle
    themeToggle.insertAdjacentHTML('beforebegin', this.getLangSelectorHTML());
  },

  // Apply translation to dynamically loaded content
  translateElement(element, key, useHTML = false) {
    const translation = Translations.t(key);
    if (useHTML) {
      element.innerHTML = translation;
    } else {
      element.textContent = translation;
    }
  },

  // Translate all data-i18n attributes in a container
  translateContainer(container) {
    container.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const useHTML = element.hasAttribute('data-i18n-html');
      this.translateElement(element, key, useHTML);
    });

    container.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = Translations.t(key);
    });
  }
};

// Auto-inject on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    LangHelpers.injectLangSelector();
  });
} else {
  LangHelpers.injectLangSelector();
}
