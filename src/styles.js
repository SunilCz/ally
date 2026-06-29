import menuCSS from './styles/menu.css';
import widgetCSS from './styles/widget.css';
import reportCSS from './styles/report.css';
import readingGuideCSS from './styles/reading-guide.css';
import skipLinkCSS from './styles/skip-link.css';
import annotationsCSS from './styles/annotations.css';

const STATIC_STYLE_ID = 'ally-static-styles';
const STATIC_STYLES = [
  menuCSS,
  widgetCSS,
  reportCSS,
  readingGuideCSS,
  skipLinkCSS,
  annotationsCSS
].join('\n');

/** @typedef {import('./index.js').default} AllyWidget */

/** @type {{ [methodName: string]: (this: AllyWidget, ...args: any[]) => any }} */
export const styleMethods = {

  findElement(selector, parent = document) {
    try {
      return parent.querySelector(selector);
    } catch (e) {
      console.warn(`[AllyWidget] Failed to query selector: ${selector}`, e);
      return null;
    }
  },

  injectStyle(id, css) {
    if (!css || typeof document === 'undefined') return;
    try {
      let style = document.getElementById(id) || document.createElement('style');
      style.innerHTML = css;
      if (!style.id) {
        style.id = id;
        document.head.appendChild(style);
      }
    } catch (e) {
      console.warn('[AllyWidget] Error adding stylesheet:', e);
    }
  },

  createCSS(styles) {
    let css = '';
    if (!styles) return css;
    const browserPrefixes = ['-o-', '-ms-', '-moz-', '-webkit-', ''];
    const prefixedProperties = ['filter'];
    for (let key in styles) {
      if (!Object.prototype.hasOwnProperty.call(styles, key)) continue;
      let prefixes = prefixedProperties.includes(key) ? browserPrefixes : [''];
      prefixes.forEach(prefix => {
        css += `${prefix}${key}:${styles[key]} !important;`;
      });
    }
    return css;
  },

  wrapCSS(selector, childrenSelector, css) {
    let output = '';
    childrenSelector.forEach(child => {
      output += `${selector} ${child}{${css}}`;
    });
    return output;
  },

  buildCSS(config) {
    if (!config) return '';
    let output = '';
    output += this.createCSS(config.styles || {});
    if (output.length && config.selector) {
      output = this.wrapCSS(config.selector, config.childrenSelector || [''], output);
    }
    output += config.css || '';
    return output;
  },

  applyToolStyle(config) {
    let { id = '', enable = false } = config;
    let styleId = `acc-${id}`;
    if (enable) {
      let css = this.buildCSS(config);
      this.injectStyle(styleId, css);
    } else {
      let style = document.getElementById(styleId);
      if (style) style.remove();
    }
    document.documentElement.classList.toggle(styleId, enable);
  },

  applyThemeVariables() {
    if (typeof document === 'undefined') return;
    const t = this.widgetTheme;
    const p = t.primaryColor || '#1976d2';
    const vars = {
      '--acc-primary-color': p,
      '--acc-primary-color-light': t.primaryColorLight,
      '--acc-primary-color-dark': t.primaryColorDark,
      '--acc-bg-color': t.backgroundColor,
      '--acc-text-color': t.textColor,
      '--acc-text-color-inverted': t.textColorInverted,
      '--acc-card-bg': t.cardBackground,
      '--acc-border-color': t.borderColor,
      '--acc-focus-ring-color': t.focusRingColor || p,
      '--acc-hover-color': t.hoverColor,
      '--acc-active-color': t.activeColor,
      '--acc-border-radius': t.borderRadius,
      '--acc-button-border-radius': t.buttonBorderRadius,
      '--acc-header-height': t.headerHeight,
      '--acc-focus-outline-width': t.focusBorderWidth,
      '--acc-focus-outline-offset': t.focusOutlineOffset,
      '--acc-widget-z-index': String(t.zIndex),
      '--acc-button-size': t.buttonSize,

      // ── Granular theme vars ─────────────────────────────────────────────────
      '--acc-toggle-btn-border-radius':   t.toggleButtonBorderRadius  || '50%',
      '--acc-toggle-btn-padding-x':       t.toggleButtonPaddingX      || '0px',
      '--acc-toggle-btn-shadow':          t.toggleButtonShadow        || '0 4px 14px rgba(0,0,0,0.22)',
      '--acc-toggle-btn-shadow-hover':    t.toggleButtonShadowHover   || '0 8px 22px rgba(0,0,0,0.22)',
      '--acc-toggle-label-font-size':     t.toggleLabelFontSize       || '1rem',
      '--acc-toggle-label-font-weight':   t.toggleLabelFontWeight     || '700',
      '--acc-toggle-shortcut-font-size':  t.toggleShortcutFontSize    || '0.7rem',
      '--acc-toggle-shortcut-font-weight':t.toggleShortcutFontWeight  || '600',
      '--acc-toggle-btn-bg':              t.toggleButtonBg            || p,
      '--acc-toggle-ring-color':          t.toggleButtonRingColor     || p,
      '--acc-toggle-icon-color':          t.toggleButtonIconColor     || '#ffffff',
      '--acc-menu-header-bg':             t.menuHeaderBg              || p,
      '--acc-menu-header-color':          t.menuHeaderColor           || '#ffffff',
      '--acc-feature-icon-color':         t.featureIconColor          || '#222222',
      '--acc-feature-icon-active-color':  t.featureIconActiveColor    || '#ffffff',
      '--acc-feature-btn-active-bg':      t.featureButtonActiveBg     || p,
      '--acc-feature-btn-active-border':  t.featureButtonActiveBorderColor || p,
      '--acc-feature-btn-hover-bg':       t.featureButtonHoverBg      || '#f3f4f6',
      '--acc-section-title-color':        t.sectionTitleColor         || '#6b7280',
      '--acc-menu-max-width':             t.menuMaxWidth              || undefined,
      '--acc-menu-font-size':             t.menuFontSize              || undefined,
      '--acc-menu-scale':                 t.menuScale                 || undefined,
      '--acc-menu-border-radius':         t.menuBorderRadius          || undefined,
      '--acc-content-inline-padding':     t.menuContentPadding        || undefined,
      '--acc-section-gap':                t.menuSectionGap            || undefined,
      '--acc-category-gap':               t.menuCategoryGap           || undefined,
      '--acc-section-title-font-size':    t.sectionTitleFontSize      || undefined,
      '--acc-feature-btn-gap':            t.featureButtonGap          || undefined,
      '--acc-feature-btn-padding':        t.featureButtonPadding      || undefined,
      '--acc-feature-btn-font-size':      t.featureButtonFontSize     || undefined,
      '--acc-feature-btn-label-size':     t.featureButtonLabelSize    || undefined,
      '--acc-feature-icon-size':          t.featureIconSize           || undefined,
      '--acc-header-icon-size':           t.headerIconSize            || undefined,
    };
    Object.entries(vars).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        document.documentElement.style.setProperty(key, value);
      }
    });
  },

  injectIconColorStyles() {
    if (typeof document === 'undefined') return;
    const overrides = (this.options && this.options.featureOverrides) || {};
    let css = '';

    // Global featureIconColor from theme (lowest specificity — base layer)
    const globalIconColor = this.widgetTheme && this.widgetTheme.featureIconColor;
    if (globalIconColor) {
      css += `.acc-btn svg path:not(.acc-icon-inner){fill:${globalIconColor};}`;
    }

    // Wildcard override from featureOverrides (mid specificity)
    const wildcard = overrides['*'];
    if (wildcard && wildcard.iconColor) {
      css += `.acc-btn svg path:not(.acc-icon-inner){fill:${wildcard.iconColor};}`;
    }
    if (wildcard && wildcard.iconInnerColor) {
      css += `.acc-btn svg path.acc-icon-inner{fill:${wildcard.iconInnerColor};}`;
    }

    // Per-feature overrides (highest specificity — attribute selector wins)
    for (const key of Object.keys(overrides)) {
      if (key === '*') continue;
      const val = overrides[key];
      if (!val) continue;
      if (val.iconColor) {
        css += `.acc-btn[data-key="${key}"] svg path:not(.acc-icon-inner){fill:${val.iconColor};}`;
      }
      if (val.iconInnerColor) {
        css += `.acc-btn[data-key="${key}"] svg path.acc-icon-inner{fill:${val.iconInnerColor};}`;
      }
    }

    if (css) this.injectStyle('ally-icon-colors', css);
  },

  registerStaticStyles() {
    if (this.staticStylesRegistered) return;
    this.injectStyle(STATIC_STYLE_ID, STATIC_STYLES);
    this.staticStylesRegistered = true;
  }

};
