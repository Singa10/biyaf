# Multi-Language Translation System

## Overview
The Biyaf Architecture Studio website now supports 3 languages:
- 🇬🇧 **English** (EN) - Default
- 🇪🇹 **Amharic** (አማርኛ) - AM  
- 🇪🇹 **Afaan Oromo** (Afaan Oromoo) - OM

## Features

### 1. Modern Language Selector
- **Location**: Header navigation (right side, before theme toggle)
- **Design**: Elegant dropdown with flag icons, native language names, and smooth animations
- **Persistence**: Selected language is stored in localStorage and persists across sessions
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### 2. Comprehensive Translations
All website content is translated including:
- Navigation menu
- Hero section (title, description, buttons)
- Statistics labels
- Featured projects section
- Services descriptions
- Call-to-action banners
- Footer content
- About page content
- Projects page filters
- Services page details
- Contact page form labels

### 3. Technical Implementation

#### Files Created:
1. **`js/translations.js`** (Main translation system)
   - Translation data for all 3 languages
   - Translation function (`t()`)
   - Language switching logic
   - Auto-initialization

2. **`js/lang-helpers.js`** (Helper functions)
   - Auto-injects language selector into pages
   - Provides utility functions for dynamic content translation
   - Handles translation containers

3. **CSS Additions** (in `css/style.css`)
   - `.lang-selector` - Main container
   - `.lang-trigger` - Button styles
   - `.lang-dropdown` - Dropdown menu
   - `.lang-option` - Language options with hover effects
   - Full responsive design for mobile devices

#### Modified Files:
- `index.html` - Added translation attributes and scripts
- `about.html` - Added translation system
- `projects.html` - Added translation system
- `services.html` - Added translation system
- `contact.html` - Added translation system  
- `js/script.js` - Added language selector event handlers

## How It Works

### For Users:
1. Click the language selector button in the header (shows current language: EN, አማ, or OM)
2. Select desired language from dropdown
3. Page content instantly updates to selected language
4. Language preference is saved automatically

### For Developers:

#### Adding Translations to HTML Elements:
```html
<!-- Basic text translation -->
<h1 data-i18n="hero.title">We design buildings</h1>

<!-- HTML content translation (with <br>, <em> tags) -->
<h1 data-i18n="hero.title" data-i18n-html>We design<br>buildings</h1>

<!-- Placeholder translation -->
<input placeholder="Your name" data-i18n-placeholder="contactPage.formName">
```

#### Adding New Translation Keys:
Edit `js/translations.js` and add to all three language objects:
```javascript
en: {
  newSection: {
    title: 'English Title',
    description: 'English description'
  }
},
am: {
  newSection: {
    title: 'አማርኛ ርዕስ',
    description: 'አማርኛ መግለጫ'
  }
},
om: {
  newSection: {
    title: 'Mata-duree Afaan Oromoo',
    description: 'Ibsa Afaan Oromoo'
  }
}
```

#### Translating Dynamic Content:
```javascript
// Translate a single element
LangHelpers.translateElement(element, 'hero.title', useHTML);

// Translate all elements in a container
LangHelpers.translateContainer(containerElement);

// Get translation programmatically
const translation = Translations.t('hero.title');
```

## Responsive Design

The language selector is fully responsive:
- **Desktop**: Full dropdown with flags and native names
- **Tablet**: Optimized spacing
- **Mobile**: Compact view, smaller flags, optimized touch targets

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Language Coverage

### English (EN)
- Full coverage of all website sections
- Professional architecture terminology
- Clear, concise descriptions

### Amharic (አማርኛ)
- Native Ethiopian language
- Professional translations
- Culturally appropriate terminology
- Proper Ge'ez script rendering

### Afaan Oromo (OM)
- Second most widely spoken language in Ethiopia
- Professional architectural terms
- Latin script (Qubee)
- Culturally relevant translations

## Performance

- **No Page Reload**: Instant language switching using JavaScript
- **Lightweight**: Translation data is ~30KB total
- **Cached**: Selected language persists in localStorage
- **Fast**: No server requests needed for language changes

## Future Enhancements

Potential improvements:
1. Add more languages (Tigrinya, Somali, etc.)
2. Right-to-left (RTL) support if needed
3. Automatic language detection based on browser settings
4. Translation management system for admin dashboard
5. Export/import translation files

## Testing

To test the translation system:
1. Open any page on the website
2. Click the language selector in the header
3. Select each language and verify:
   - All text content updates correctly
   - Layout remains intact
   - Special characters render properly (አማርኛ characters)
   - Language preference persists on page reload
   - Mobile view works correctly

## Support

For translation updates or issues:
1. Check `js/translations.js` for missing keys
2. Verify HTML elements have correct `data-i18n` attributes
3. Ensure scripts are loaded in correct order:
   - `translations.js` (first)
   - `lang-helpers.js` (second)
   - `script.js` (third)

## Credits

- Translation system developed for Biyaf Architecture Studio
- Native translations verified for accuracy
- UI/UX designed for modern, professional appearance
- Mobile-first responsive design approach
