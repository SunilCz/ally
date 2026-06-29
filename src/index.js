/*!
 * Ally Widget v1.0.2
 * Released under the MIT License
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 * This widget does not guarantee accessibility compliance.
 *
 * ─── Developer Options Reference ─────────────────────────────────────────────
 *
 * window.AllyWidgetOptions = {
 *   // ── Position & Size ──────────────────────────────────────────────────────
 *   position:        'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
 *   offset:          [20, 20]       // [horizontal, vertical] px from edge
 *   size:            '52px'         // toggle button size (px / em / rem / %)
 *   keyboardShortcut: true          // Alt+A to toggle (set false to disable)
 *   showViolationBubble: true       // red badge on toggle button (set false to hide)
 *
 *   // ── Language ─────────────────────────────────────────────────────────────
 *   lang:            'en' | 'ne'
 *
 *   // ── Storage ──────────────────────────────────────────────────────────────
 *   storageKey:      'ally-wgt'     // localStorage key (change to avoid collisions)
 *
 *   // ── Branding / Footer ────────────────────────────────────────────────────
 *   poweredByText:   'Ally Widget'  // footer link label
 *   poweredByUrl:    'https://...'  // footer link href
 *
 *   // ── Toggle Button Icon ───────────────────────────────────────────────────
 *   icon:            'default' | 'person' | 'eye' | 'universal'  (built-in variants)
 *                    OR any SVG string for a fully custom icon
 *
 *   // ── Color Theme ──────────────────────────────────────────────────────────
 *   primaryColor:         '#4f46e5'
 *   primaryColorLight:    '#818cf8'
 *   primaryColorDark:     '#3730a3'
 *   backgroundColor:      '#ffffff'
 *   textColor:            '#1f2937'
 *   textColorInverted:    '#ffffff'
 *   cardBackground:       '#f9fafb'
 *   borderColor:          '#e5e7eb'
 *   focusRingColor:       '#4f46e5'
 *   hoverColor:           '#f3f4f6'
 *   activeColor:          '#ede9fe'
 *   borderRadius:         '12px'
 *   buttonBorderRadius:   '50%'
 *   headerHeight:         '56px'
 *   focusBorderWidth:     '2px'
 *   focusOutlineOffset:   '2px'
 *   zIndex:               9999
 *   buttonSize:           '52px'    // alias for size
 *
 *   // ── OR pass all theme keys nested under `theme: {}` ──────────────────────
 *   theme: { primaryColor: '#e11d48', borderRadius: '8px', ... }
 *
 *   // ── Granular Color Theme ─────────────────────────────────────────────────
 *   // Each key is independent; unset keys fall back to primaryColor or a safe default.
 *   toggleButtonBg:               '#1976d2'   // floating button background
 *   toggleButtonRingColor:        '#1976d2'   // button inset ring color
 *   toggleButtonIconColor:        '#ffffff'   // icon fill on the toggle button
 *   menuHeaderBg:                 '#1976d2'   // menu header bar background
 *   menuHeaderColor:              '#ffffff'   // menu header text + icon color
 *   featureIconColor:             '#222222'   // default icon fill for all features
 *   featureIconActiveColor:       '#ffffff'   // icon fill when a feature is ON
 *   featureButtonActiveBg:        '#1976d2'   // button background when feature is ON
 *   featureButtonActiveBorderColor: '#1976d2' // button border when feature is ON
 *   featureButtonHoverBg:         '#f3f4f6'   // button hover background
 *   sectionTitleColor:            '#6b7280'   // section heading color
 *
 *   // ── Features: disable specific features ──────────────────────────────────
 *   disableFeatures: ['hide-images', 'dyslexia-font', 'annotations']
 *   // All feature keys: 'bold-text' | 'line-spacing' | 'letter-spacing' |
 *   //   'hide-images' | 'readable-text' | 'highlight-links' | 'highlight-title' |
 *   //   'text-scale' | 'contrast-toggle' | 'invert-colors' | 'saturation-toggle' |
 *   //   'large-pointer' | 'pause-motion' | 'reading-aid' | 'text-to-speech' |
 *   //   'high-contrast-mode' | 'simple-layout' | 'annotations' | 'accessibility-report'
 *
 *   // ── Features: override label, icon, or icon colors for any feature ─────────
 *   featureOverrides: {
 *     '*':              { iconColor: '#333' },                          // wildcard
 *     'bold-text':      { label: 'Bold', icon: '<svg>...</svg>',
 *                         iconColor: '#e11d48', iconInnerColor: '#fca5a5' },
 *     'text-to-speech': { label: 'Read Aloud' }
 *   }
 *
 *   // ── TTS voice configuration ───────────────────────────────────────────────
 *   ttsNativeVoiceName: ''    // exact voice name to prefer (e.g. 'Google हिन्दी')
 *   ttsNativeVoiceLang: ''    // BCP-47 lang tag override (e.g. 'ne-NP')
 *   ttsRate:            1     // speech rate 0.5–2
 *   ttsPitch:           1     // speech pitch 0–2
 *
 *   // ── Event Callbacks ───────────────────────────────────────────────────────
 *   onOpen()                         // widget menu opened
 *   onClose()                        // widget menu closed
 *   onFeatureToggle(key, enabled)    // a feature was toggled
 *   onReset()                        // all settings reset
 * };
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { WIDGET_THEME } from './constants/theme.js';
import { WIDGET_ICONS } from './constants/icons.js';
import { TARGET_SELECTORS, PAGE_CONTENT_SELECTOR } from './constants/selectors.js';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from './constants/translations.js';
import { stateMethods } from './state.js';
import { styleMethods } from './styles.js';
import { featureMethods } from './features.js';
import { uiMethods } from './ui.js';

class AllyWidget {
  constructor(options = {}) {
    this.widgetTheme = { ...WIDGET_THEME };

    // Allow full icon override via options.icons
    this.widgetIcons = options.icons && typeof options.icons === 'object'
      ? { ...WIDGET_ICONS, ...options.icons }
      : { ...WIDGET_ICONS };

    this.targetSelectors = TARGET_SELECTORS;

    this.visualFilters = {
      'dark-contrast': {
        styles: { 'filter': 'contrast(150%) brightness(0.8)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'light-contrast': {
        styles: { 'filter': 'contrast(125%) brightness(1.2)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'invert-colors': {
        styles: { 'filter': 'invert(100%)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'low-saturation': {
        styles: { 'filter': 'saturate(50%)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'high-saturation': {
        styles: { 'filter': 'saturate(200%)' },
        selector: PAGE_CONTENT_SELECTOR
      }
    };

    this.translations = TRANSLATIONS;
    this.supportedLanguages = SUPPORTED_LANGUAGES.map((language) => ({ ...language }));

    // Build the disabled-features set for quick lookup
    const disabledSet = new Set(
      Array.isArray(options.disableFeatures) ? options.disableFeatures : []
    );

    // Per-feature label/icon overrides: { 'bold-text': { label: '...', icon: '...' } }
    const featureOverrides = (options.featureOverrides && typeof options.featureOverrides === 'object')
      ? options.featureOverrides
      : {};

    const applyOverride = (item) => {
      const override = featureOverrides[item.key];
      if (!override) return item;
      return {
        ...item,
        ...(override.label ? { label: override.label } : {}),
        ...(override.icon ? { icon: override.icon } : {})
      };
    };

    const filterAndOverride = (items) =>
      items
        .filter(item => !disabledSet.has(item.key))
        .map(applyOverride);

    this.accessTools = filterAndOverride([
      { label: 'Big Cursor', key: 'large-pointer', icon: this.widgetIcons.largePointer },
      { label: 'Stop Animations', key: 'pause-motion', icon: this.widgetIcons.pauseMotion },
      { label: 'Reading Guide', key: 'reading-aid', icon: this.widgetIcons.readingAid },
      {
        label: 'Text to Speech',
        key: 'text-to-speech',
        icon: this.widgetIcons.textToSpeech,
        requiresSpeechSynthesis: true
      },
      { label: 'High Contrast', key: 'high-contrast-mode', icon: this.widgetIcons.highContrast },
      { label: 'Simplify Layout', key: 'simple-layout', icon: this.widgetIcons.simplifyLayout }
    ]);

    if (this.isDevMode()) {
      if (!disabledSet.has('annotations')) {
        this.accessTools.push(applyOverride(
          { label: 'Annotations', key: 'annotations', icon: this.widgetIcons.annotations }
        ));
      }
      if (!disabledSet.has('accessibility-report')) {
        this.accessTools.push(applyOverride(
          { label: 'Accessibility Report', key: 'accessibility-report', icon: this.widgetIcons.accessibilityReport, isAction: true }
        ));
      }
    }

    // axe-core state
    this.axeCoreLoaded = false;
    this.axeCoreLoading = false;
    this.axeCorePromise = null;
    this.axeScanResults = null;
    this.axeScanPromise = null;
    this.violationBubble = null;

    // Accessibility report modal state
    this.reportPreviousFocus = null;
    this.reportKeyListener = null;

    // System preference state
    this.systemPreferenceListeners = [];
    this.systemPreferenceMediaQueries = {};

    // Annotation state
    this.annotationLayer = null;
    this.annotationItems = [];
    this.annotationPopup = null;
    this.annotationRepositionHandler = null;
    this.annotationOutsideHandler = null;
    this.annotationRequestId = 0;

    // Text-to-speech state
    this.ttsUtterance = null;
    this.ttsClickListener = null;
    this.ttsActiveTarget = null;
    this.ttsTextCache = '';
    this.ttsStatus = 'stopped';
    this.ttsQueue = [];
    this.ttsQueueIndex = 0;
    this.ttsSessionId = 0;
    this.ttsVoice = null;

    // Simple layout state
    this.simpleLayoutRoot = null;
    this.simpleLayoutHiddenElements = [];

    this.userInitiatedToggleKey = null;

    // Font size / multi-level state
    this.textScaleIndex = 0;
    this.textScaleValues = [1.2, 1.4, 1.6];
    this.textScaleMinPercent = 80;
    this.textScaleMaxPercent = 150;
    this.textScaleStepPercent = 5;
    this.contrastFilterValues = ['light-contrast', 'dark-contrast'];
    this.saturationFilterValues = ['low-saturation', 'high-saturation'];

    this.contentOptions = filterAndOverride([
      { label: 'Font Weight', key: 'bold-text', icon: this.widgetIcons.boldText },
      { label: 'Line Height', key: 'line-spacing', icon: this.widgetIcons.lineSpacing },
      { label: 'Letter Spacing', key: 'letter-spacing', icon: this.widgetIcons.letterSpacing },
      { label: 'Hide Images', key: 'hide-images', icon: this.widgetIcons.hideImages },
      { label: 'Dyslexia Font', key: 'readable-text', icon: this.widgetIcons.dyslexiaFont },
      { label: 'Highlight Links', key: 'highlight-links', icon: this.widgetIcons.highlightLinks },
      { label: 'Highlight Title', key: 'highlight-title', icon: this.widgetIcons.highlightTitle },
      {
        label: 'Font Size',
        key: 'text-scale',
        icon: this.widgetIcons.adjustFontSize,
        multiLevel: true,
        levels: this.textScaleValues.length
      }
    ]);

    this.multiLevelFeatures = {
      'text-scale': {
        levels: this.textScaleValues.length,
        currentIndex: -1,
        values: this.textScaleValues
      },
      'contrast-toggle': {
        levels: this.contrastFilterValues.length,
        currentIndex: -1,
        values: this.contrastFilterValues
      },
      'saturation-toggle': {
        levels: this.saturationFilterValues.length,
        currentIndex: -1,
        values: this.saturationFilterValues
      }
    };

    this.readingAidTemplate = `
      <div class="acc-rg acc-rg-top" role="presentation"> </div>
      <div class="acc-rg acc-rg-bottom" role="presentation"> </div>
    `;

    this.colorOptions = filterAndOverride([
      {
        label: 'Contrast',
        key: 'contrast-toggle',
        icon: this.widgetIcons.contrast,
        multiLevel: true,
        levels: this.contrastFilterValues.length
      },
      { label: 'Invert Colors', key: 'invert-colors', icon: this.widgetIcons.invertColors },
      {
        label: 'Saturation',
        key: 'saturation-toggle',
        icon: this.widgetIcons.saturation,
        multiLevel: true,
        levels: this.saturationFilterValues.length
      }
    ]);

    this.colorFilterKeys = Object.keys(this.visualFilters);
    this.activeColorFilterKey = null;

    this.textScaleSelectors = 'h1,h2,h3,h4,h5,h6,p,a,dl,dt,li,ol,th,td,span,blockquote,.acc-text';
    this.textScaleObserver = null;
    this.currentTextScaleMultiplier = 1;

    this.widgetConfig = {};

    // Configurable storage key
    this.storageKey = (typeof options.storageKey === 'string' && options.storageKey.trim())
      ? options.storageKey.trim()
      : 'ally-wgt';

    this.readingAidVisible = false;
    this.readableFontLoaded = false;

    // Menu state
    this.activeMenuContainer = null;
    this.activeMenuToggle = null;
    this.menuKeyListener = null;
    this.previousFocus = null;
    this.widgetToggleButton = null;
    this.skipLinkElement = null;
    this.menuContainer = null;

    this.staticStylesRegistered = false;

    this.dataOptions = this.getDataAttributeOptions();

    this.options = {
      lang: this.getDefaultLanguage(),
      position: 'bottom-right',
      ...this.dataOptions,
      ...options
    };

    this.applyThemeOverrides(this.options);

    const normalizeTtsRate = (value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return 1;
      return Math.min(2, Math.max(0.5, numeric));
    };

    const normalizeTtsPitch = (value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return 1;
      return Math.min(2, Math.max(0, numeric));
    };

    this.nativeTtsConfig = {
      preferredVoiceName: (
        typeof options.ttsNativeVoiceName === 'string' &&
        options.ttsNativeVoiceName.trim()
      ) ? options.ttsNativeVoiceName.trim() : '',
      preferredVoiceLang: (
        typeof options.ttsNativeVoiceLang === 'string' &&
        options.ttsNativeVoiceLang.trim()
      ) ? options.ttsNativeVoiceLang.trim() : '',
      rate: normalizeTtsRate(options.ttsRate),
      pitch: normalizeTtsPitch(options.ttsPitch)
    };

    if (this.options.offset) {
      this.options.offset = this.normalizeOffset(this.options.offset);
    }

    if (this.options.size) {
      this.widgetTheme.buttonSize = this.normalizeButtonSize(this.options.size);
      this.options.size = this.widgetTheme.buttonSize;
    }

    this.applyThemeVariables();
    this.registerStaticStyles();
  }

  applyThemeOverrides(options = {}) {
    if (!options || typeof options !== 'object') return;

    const mergedOptions = {
      ...(options.theme && typeof options.theme === 'object' ? options.theme : {}),
      ...options
    };

    const themeKeys = [
      'primaryColor', 'primaryColorLight', 'primaryColorDark',
      'backgroundColor', 'textColor', 'textColorInverted',
      'cardBackground', 'borderColor', 'focusRingColor',
      'hoverColor', 'activeColor', 'borderRadius', 'buttonBorderRadius',
      'headerHeight', 'focusBorderWidth', 'focusOutlineOffset', 'zIndex',
      'toggleButtonBg', 'toggleButtonRingColor', 'toggleButtonIconColor', 'toggleButtonBorderRadius',
      'toggleButtonPaddingX', 'toggleButtonShadow', 'toggleButtonShadowHover',
      'toggleButtonLabel', 'toggleButtonShortcut',
      'toggleLabelFontSize', 'toggleLabelFontWeight',
      'toggleShortcutFontSize', 'toggleShortcutFontWeight',
      'menuHeaderBg', 'menuHeaderColor',
      'featureIconColor', 'featureIconActiveColor', 'featureButtonActiveBg',
      'featureButtonActiveBorderColor', 'featureButtonHoverBg', 'sectionTitleColor',
      'menuMaxWidth', 'menuFontSize', 'menuScale', 'menuBorderRadius',
      'menuContentPadding', 'menuSectionGap', 'menuCategoryGap', 'sectionTitleFontSize',
      'featureButtonGap', 'featureButtonPadding', 'featureButtonFontSize', 'featureButtonLabelSize',
      'featureIconSize', 'headerIconSize'
    ];

    themeKeys.forEach((key) => {
      const value = mergedOptions[key];
      if (value === undefined || value === null) return;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return;
        this.widgetTheme[key] = trimmed;
        return;
      }
      this.widgetTheme[key] = value;
    });

    if (mergedOptions.buttonSize !== undefined && mergedOptions.buttonSize !== null && mergedOptions.buttonSize !== '') {
      this.widgetTheme.buttonSize = this.normalizeButtonSize(mergedOptions.buttonSize);
    }
  }
}

/** @typedef {typeof stateMethods & typeof styleMethods & typeof featureMethods & typeof uiMethods} AllyWidgetMixedMethods */
/** @typedef {AllyWidget & AllyWidgetMixedMethods} AllyWidgetInstance */

/** @type {AllyWidget['prototype'] & AllyWidgetMixedMethods} */
const widgetPrototype = AllyWidget.prototype;

Object.assign(
  widgetPrototype,
  stateMethods,
  styleMethods,
  featureMethods,
  uiMethods
);

/**
 * AllyWidget.init(options) — programmatic initialisation.
 *
 * Use this instead of the auto-init in frameworks (Next.js, Nuxt, SvelteKit…)
 * where you control when the widget mounts:
 *
 *   // Next.js app router component (use client)
 *   useEffect(() => { AllyWidget.init({ primaryColor: '#6366f1' }); }, []);
 *
 *   // CDN
 *   AllyWidget.init({ lang: 'ne' });
 *
 * Returns the widget instance, or null when called server-side.
 */
AllyWidget.init = function init(options = {}) {
  if (typeof document === 'undefined') return null;
  const instance = new AllyWidget(options);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    instance.startAccessibleWebWidget();
  } else {
    document.addEventListener('DOMContentLoaded', () => instance.startAccessibleWebWidget(), { once: true });
  }
  return instance;
};

if (typeof window !== 'undefined') {
  window.AllyWidget = AllyWidget;
}

// Auto-init only in IIFE/CDN builds (__ALLY_AUTO_INIT__ is replaced at build time).
// ESM and CJS builds set this to false so importing the module never triggers
// a default-themed widget that would conflict with AllyWidget.init() calls.
if (__ALLY_AUTO_INIT__ && typeof document !== 'undefined') {
  const globalAutoInitOptions = (
    typeof window !== 'undefined' &&
    window.AllyWidgetOptions &&
    typeof window.AllyWidgetOptions === 'object'
  ) ? window.AllyWidgetOptions : {};

  if (globalAutoInitOptions.autoInit !== false) {
    /** @type {AllyWidgetInstance} */
    const widgetInstance = new AllyWidget(globalAutoInitOptions);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      widgetInstance.startAccessibleWebWidget();
    } else {
      document.addEventListener('DOMContentLoaded', () => widgetInstance.startAccessibleWebWidget(), { once: true });
    }
  }
}

export default AllyWidget;
