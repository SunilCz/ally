# Ally Widget — Integration Guides

Platform-specific integration guides with copy-paste ready code.

---

## Guides

| Platform | Guide |
|---|---|
| **WordPress** | [docs/integration/wordpress.md](docs/integration/wordpress.md) |
| **Next.js** (Pages & App Router) | [docs/integration/nextjs.md](docs/integration/nextjs.md) |
| React, Vue, Nuxt, SvelteKit, Astro, Angular, PHP | [README.md → Framework Integration](README.md#framework-integration) |

---

## GIBL Theme — Quick Reference

These are the exact values used on the **Global IME Bank** website. Use them as a drop-in starting point for any GIBL-branded integration.

```js
{
  position:                 'bottom-left',
  size:                     '58px',

  // Toggle button — GIBL red, rounded square, expanding FAB
  toggleButtonBg:           '#C5161D',
  toggleButtonIconColor:    '#ffffff',
  toggleButtonBorderRadius: '16px',
  toggleButtonLabel:        'Accessibility',
  toggleButtonShortcut:     'Ctrl+F2',
  toggleLabelFontSize:      '1.6rem',
  toggleLabelFontWeight:    '700',
  toggleShortcutFontSize:   '1rem',
  toggleShortcutFontWeight: '600',

  // Menu — GIBL blue
  primaryColor:             '#044189',
  menuHeaderBg:             '#044189',
  featureButtonActiveBg:    '#044189',

  // Branding
  poweredByText:            '',   // hides "Ally Widget" footer link
}
```

Set `lang: 'ne'` for Nepali, `lang: 'en'` for English.

---

## CDN URL

Always use a pinned version in production:

```
https://cdn.jsdelivr.net/npm/ally-widget@1.1.9/dist/ally-widget.min.js
```

Replace `1.1.9` with the latest version when upgrading.

---

## All Options

See the full options reference in [README.md → All Options](README.md#all-options).
