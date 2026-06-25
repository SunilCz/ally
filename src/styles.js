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
