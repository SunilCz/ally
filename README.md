# Ally Widget

A lightweight, framework-free accessibility widget for any website. Drop it in with a single `<script>` tag or import it as an npm package — it adds a floating panel of accessibility controls that users can customize per-session.

- **No dependencies** — vanilla JS, ~154 KB minified
- **Three delivery formats** — CDN (IIFE), ESM (bundlers), CJS (Node/SSR)
- **Languages** — English and Nepali built-in
- **WCAG 2.x aligned** — focus trapping, ARIA roles, keyboard navigation throughout

---

## Installation

### CDN / Direct script tag

```html
<script src="https://cdn.jsdelivr.net/npm/ally-widget/dist/ally-widget.min.js"></script>
```

Or download `dist/ally-widget.min.js` and host it yourself.

### npm

```bash
npm install ally-widget
```

```js
// ESM bundler (Vite, webpack, Rollup…)
import AllyWidget from 'ally-widget';

// CommonJS (Node / SSR)
const AllyWidget = require('ally-widget');
```

---

## Quick Start

### Script tag (zero config)

The widget auto-initialises on `DOMContentLoaded`. Just include the script:

```html
<script src="dist/ally-widget.min.js"></script>
```

A button appears at the bottom-right corner. Press **Alt + A** to toggle the panel.

### Configure before loading

Set `window.AllyWidgetOptions` **before** the script tag:

```html
<script>
  window.AllyWidgetOptions = {
    position: 'bottom-right',
    lang: 'ne',                      // 'en' | 'ne'
    primaryColor: '#e11d48',
    poweredByText: 'My Company',
    poweredByUrl: 'https://mycompany.com'
  };
</script>
<script src="dist/ally-widget.min.js"></script>
```

### ESM / npm

```js
import AllyWidget from 'ally-widget';

const widget = new AllyWidget({
  position: 'bottom-left',
  primaryColor: '#0ea5e9',
  disableFeatures: ['hide-images', 'annotations'],
  onFeatureToggle(key, enabled) {
    analytics.track('a11y_toggle', { key, enabled });
  }
});

widget.startAccessibleWebWidget();
```

---

## All Options

| Option | Type | Default | Description |
|---|---|---|---|
| `position` | `string` | `'bottom-right'` | `'bottom-right'` \| `'bottom-left'` \| `'top-right'` \| `'top-left'` |
| `offset` | `[number, number]` | `[20, 20]` | `[horizontal, vertical]` px from edge |
| `size` | `string` | `'52px'` | Toggle button size — px, em, rem, or % |
| `lang` | `string` | browser lang | `'en'` or `'ne'` |
| `storageKey` | `string` | `'ally-wgt'` | localStorage key — change to avoid collisions when multiple instances share a domain |
| `keyboardShortcut` | `boolean` | `true` | `Alt+A` toggles the panel. Set `false` to disable |
| `showViolationBubble` | `boolean` | `true` | Red badge on the toggle button showing the axe-core violation count. Set `false` to hide it |
| `icon` | `string` | `'default'` | Built-in variant name or a raw SVG string for the toggle button icon |
| `icons` | `object` | — | Override any icon in the full icon set (see [Icon Keys](#icon-keys)) |
| `poweredByText` | `string` | `'Ally Widget'` | Footer link label |
| `poweredByUrl` | `string` | widget repo URL | Footer link href |
| `disableFeatures` | `string[]` | `[]` | Feature keys to hide from the panel (see [Feature Keys](#feature-keys)) |
| `featureOverrides` | `object` | `{}` | Override `label`, `icon`, `iconColor`, or `iconInnerColor` per feature key (use `'*'` as wildcard) |
| `theme` | `object` | — | All theme tokens nested under one key (alternative to passing tokens at the top level) |
| `ttsNativeVoiceName` | `string` | — | Exact browser voice name to prefer for TTS |
| `ttsNativeVoiceLang` | `string` | — | BCP-47 language tag for TTS voice selection (e.g. `'ne-NP'`) |
| `ttsRate` | `number` | `1` | Speech rate — `0.5` to `2` |
| `ttsPitch` | `number` | `1` | Speech pitch — `0` to `2` |
| `onOpen` | `function` | — | Called when the panel opens |
| `onClose` | `function` | — | Called when the panel closes |
| `onFeatureToggle` | `function(key, enabled)` | — | Called on every feature toggle |
| `onReset` | `function` | — | Called when the user resets all settings |

---

## Theme Customization

Pass any of these tokens directly in options, or group them under `theme: { … }`:

```js
window.AllyWidgetOptions = {
  // Option A — flat
  primaryColor: '#e11d48',
  borderRadius: '8px',

  // Option B — grouped (same result)
  theme: {
    primaryColor: '#e11d48',
    borderRadius: '8px'
  }
};
```

### Theme tokens

| Token | Default | Notes |
|---|---|---|
| `primaryColor` | `#1976d2` | Main brand color — fallback for any unset granular key |
| `primaryColorLight` | `#42a5f5` | Lighter tint |
| `primaryColorDark` | `#0d47a1` | Darker shade |
| `backgroundColor` | `#f5f7fa` | Panel background |
| `textColor` | `#222222` | Panel text |
| `textColorInverted` | `#ffffff` | Text on primary background |
| `cardBackground` | `#ffffff` | Feature card background |
| `borderColor` | `#d1d5db` | Dividers and borders |
| `focusRingColor` | `#1976d2` | Keyboard focus ring |
| `hoverColor` | `#42a5f5` | Button hover border/shadow color |
| `activeColor` | `#0d47a1` | Legacy active color |
| `borderRadius` | `8px` | Panel corner radius |
| `buttonBorderRadius` | `0.4rem` | Toggle button shape |
| `headerHeight` | `54px` | Panel header height |
| `focusBorderWidth` | `3px` | Focus ring width |
| `focusOutlineOffset` | `2px` | Focus ring offset |
| `zIndex` | `100000` | Stacking context |
| `buttonSize` | `52px` | Alias for `size` |

### Granular color tokens

Each element of the widget can be independently colored. Unset keys fall back to `primaryColor`.

**Toggle button (floating launcher)**

| Token | Default | Controls |
|---|---|---|
| `toggleButtonBg` | `primaryColor` | Floating button background |
| `toggleButtonRingColor` | `primaryColor` | Inset ring color |
| `toggleButtonIconColor` | `#ffffff` | SVG fill on the toggle icon |
| `toggleButtonBorderRadius` | `50%` | Button corner radius (e.g. `'16px'` for rounded-square) |
| `toggleButtonShadow` | `0 4px 14px rgba(0,0,0,0.22)` | Resting drop shadow |
| `toggleButtonShadowHover` | `0 8px 22px rgba(0,0,0,0.22)` | Shadow on hover / focus |
| `toggleButtonLabel` | `'Accessibility'` | Text revealed on hover-expand |
| `toggleButtonShortcut` | `''` | Shortcut hint revealed on hover-expand (e.g. `'Ctrl+F2'`) |
| `toggleLabelFontSize` | `1rem` | Font size of the hover label |
| `toggleLabelFontWeight` | `700` | Font weight of the hover label |
| `toggleShortcutFontSize` | `0.7rem` | Font size of the shortcut hint |
| `toggleShortcutFontWeight` | `600` | Font weight of the shortcut hint |

**Menu header bar**

| Token | Default | Controls |
|---|---|---|
| `menuHeaderBg` | `primaryColor` | Header background |
| `menuHeaderColor` | `#ffffff` | Header title text and icon fill |

**Feature buttons (inside the menu)**

| Token | Default | Controls |
|---|---|---|
| `featureIconColor` | `#222222` | Default icon fill for all feature buttons |
| `featureIconActiveColor` | `#ffffff` | Icon fill when a feature is ON |
| `featureButtonActiveBg` | `primaryColor` | Button background when feature is ON |
| `featureButtonActiveBorderColor` | `primaryColor` | Button border when feature is ON |
| `featureButtonHoverBg` | `#f3f4f6` | Button hover background |

**Section headings**

| Token | Default | Controls |
|---|---|---|
| `sectionTitleColor` | `#6b7280` | Section heading text color |

---

## Feature Keys

Use these keys with `disableFeatures` and `featureOverrides`.

### Text

| Key | Label |
|---|---|
| `text-scale` | Font Size (slider) |
| `bold-text` | Font Weight |
| `line-spacing` | Line Height |
| `letter-spacing` | Letter Spacing |
| `readable-text` | Dyslexia Font |

### Color & Contrast

| Key | Label |
|---|---|
| `contrast-toggle` | Contrast (cycles light → dark) |
| `saturation-toggle` | Saturation (cycles low → high) |
| `invert-colors` | Invert Colors |

### Reading Aids

| Key | Label |
|---|---|
| `highlight-links` | Highlight Links |
| `highlight-title` | Highlight Titles |
| `reading-aid` | Reading Guide |
| `simple-layout` | Simplify Layout |

### Interaction

| Key | Label |
|---|---|
| `large-pointer` | Big Cursor |
| `pause-motion` | Stop Animations |
| `hide-images` | Hide Images |
| `high-contrast-mode` | High Contrast |

### Speech

| Key | Label |
|---|---|
| `text-to-speech` | Text to Speech |

### Dev mode only (`?ally-dev=true`)

| Key | Label |
|---|---|
| `annotations` | Annotations (axe-core overlays) |
| `accessibility-report` | Accessibility Report |

---

## Disabling Features

```js
window.AllyWidgetOptions = {
  disableFeatures: [
    'hide-images',
    'readable-text',   // remove Dyslexia Font button
    'annotations',
    'accessibility-report'
  ]
};
```

---

## Feature Label, Icon & Color Overrides

Override any feature button's label, icon SVG, or icon colors — per feature key, without touching the source.

```js
window.AllyWidgetOptions = {
  featureOverrides: {
    // Rename a button
    'bold-text': {
      label: 'Bold'
    },

    // Rename + swap icon SVG
    'text-to-speech': {
      label: 'Read Aloud',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>'
    },

    // Color overrides — no SVG rewrite needed
    'reading-aid': {
      iconColor: '#0369a1'            // main icon fill
    },
    'contrast-toggle': {
      iconColor: '#6d28d9',           // outer path color
      iconInnerColor: '#c4b5fd'       // inner/secondary path color
    },

    // Wildcard — applies to all features not individually overridden
    '*': {
      iconColor: '#374151'
    }
  }
};
```

`iconColor` sets the main SVG fill. `iconInnerColor` targets secondary paths on compound icons (contrast, high-contrast, saturation, invert-colors). Both override `featureIconColor` from the theme. Per-feature values always beat the wildcard.

---

## Icon Keys

Pass a partial `icons` object to swap out any icon in the set:

```js
window.AllyWidgetOptions = {
  icons: {
    largePointer:      '<svg>…</svg>',
    pauseMotion:       '<svg>…</svg>',
    readingAid:        '<svg>…</svg>',
    textToSpeech:      '<svg>…</svg>',
    highContrast:      '<svg>…</svg>',
    simplifyLayout:    '<svg>…</svg>',
    boldText:          '<svg>…</svg>',
    lineSpacing:       '<svg>…</svg>',
    letterSpacing:     '<svg>…</svg>',
    hideImages:        '<svg>…</svg>',
    dyslexiaFont:      '<svg>…</svg>',
    highlightLinks:    '<svg>…</svg>',
    highlightTitle:    '<svg>…</svg>',
    adjustFontSize:    '<svg>…</svg>',
    contrast:          '<svg>…</svg>',
    invertColors:      '<svg>…</svg>',
    saturation:        '<svg>…</svg>',
    annotations:       '<svg>…</svg>',
    accessibilityReport: '<svg>…</svg>',
    reset:             '<svg>…</svg>',
    accessibility:     '<svg>…</svg>'  // toggle button default icon
  }
};
```

---

## Language

The widget ships with English (`en`) and Nepali (`ne`).

```js
window.AllyWidgetOptions = { lang: 'ne' };
```

The language picker in the panel footer lets users switch at runtime. The selection is persisted to localStorage.

---

## Text to Speech

The widget uses the browser's native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — no external service or API key required.

When TTS is enabled, click any text element on the page to hear it read aloud.

**Nepali TTS** — modern browsers (Chrome, Edge) include a `ne-NP` voice. To force a specific voice:

```js
window.AllyWidgetOptions = {
  ttsNativeVoiceLang: 'ne-NP',
  ttsNativeVoiceName: 'Google नेपाली',  // optional — exact voice name
  ttsRate: 0.9,
  ttsPitch: 1.0
};
```

If the requested voice is unavailable the widget falls back to the browser's default voice.

---

## Event Callbacks

```js
window.AllyWidgetOptions = {
  onOpen() {
    console.log('Panel opened');
  },

  onClose() {
    console.log('Panel closed');
  },

  onFeatureToggle(key, enabled) {
    // key   — feature key string (e.g. 'bold-text')
    // enabled — boolean (true = on, false = off)
    analytics.track('a11y_feature', { key, enabled });
  },

  onReset() {
    console.log('All settings cleared');
  }
};
```

---

## Data Attributes

You can configure the widget via attributes on the script tag instead of `window.AllyWidgetOptions`:

```html
<script
  src="dist/ally-widget.min.js"
  data-ally-lang="ne"
  data-ally-position="bottom-left"
  data-ally-size="60px"
  data-ally-offset="24,24"
></script>
```

Supported attributes: `data-ally-lang`, `data-ally-position`, `data-ally-offset`, `data-ally-size`, `data-ally-icon`.

---

## Framework Integration

The widget is browser-only. `AllyWidget.init()` returns `null` when called server-side, so it is always safe to import — but you must ensure it mounts after the DOM is ready.

| Stack | Approach |
|---|---|
| Plain HTML | Script tag — just works |
| React / Vite | `useEffect` dynamic import |
| Next.js App Router | `'use client'` component + `useEffect` |
| Next.js Pages Router | `useEffect` in `_app.jsx` |
| Vue 3 | `onMounted` in `App.vue` |
| Nuxt 3 | `.client.js` plugin |
| SvelteKit | `onMount` in `+layout.svelte` |
| Astro | `<script>` with `is:inline` in Layout |
| WordPress | `wp_enqueue_script` in `functions.php` |
| Laravel / Blade | Script tag in layout |
| Angular | `ngAfterViewInit` in `AppComponent` |
| PHP (plain) | Script tag before `</body>` |

---

### Plain HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>
  <!-- your content -->

  <script>
    window.AllyWidgetOptions = {
      position: 'bottom-right',
      primaryColor: '#6366f1',
      lang: 'en'
    };
  </script>
  <script src="https://cdn.jsdelivr.net/npm/ally-widget/dist/ally-widget.min.js"></script>
</body>
</html>
```

---

### React (Vite / CRA)

```jsx
// src/components/AllyWidget.jsx
import { useEffect } from 'react'

export default function AllyWidget() {
  useEffect(() => {
    import('ally-widget').then(({ default: AllyWidget }) => {
      AllyWidget.init({ primaryColor: '#6366f1' })
    })
  }, [])

  return null
}
```

```jsx
// src/App.jsx
import AllyWidget from './components/AllyWidget'

export default function App() {
  return (
    <>
      <YourApp />
      <AllyWidget />
    </>
  )
}
```

---

### Next.js (App Router)

```jsx
// components/AllyWidget.jsx
'use client'
import { useEffect } from 'react'

export default function AllyWidget() {
  useEffect(() => {
    import('ally-widget').then(({ default: AllyWidget }) => {
      AllyWidget.init({ primaryColor: '#6366f1', lang: 'en' })
    })
  }, [])

  return null
}
```

```jsx
// app/layout.jsx
import AllyWidget from '@/components/AllyWidget'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AllyWidget />
      </body>
    </html>
  )
}
```

**Or — CDN via `next/script` (zero npm install):**

```jsx
// app/layout.jsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="ally-cfg" strategy="beforeInteractive">{`
          window.AllyWidgetOptions = { primaryColor: '#6366f1' };
        `}</Script>
        <Script
          src="https://cdn.jsdelivr.net/npm/ally-widget/dist/ally-widget.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

---

### Next.js (Pages Router)

```jsx
// pages/_app.jsx
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import('ally-widget').then(({ default: AllyWidget }) => {
      AllyWidget.init({ primaryColor: '#6366f1' })
    })
  }, [])

  return <Component {...pageProps} />
}
```

---

### Vue 3 (Vite)

```js
// src/App.vue
<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const { default: AllyWidget } = await import('ally-widget')
  AllyWidget.init({ primaryColor: '#6366f1' })
})
</script>
```

---

### Nuxt 3

```js
// plugins/ally-widget.client.js
// The .client suffix tells Nuxt this is browser-only — no SSR guard needed
import AllyWidget from 'ally-widget'

export default defineNuxtPlugin(() => {
  AllyWidget.init({ primaryColor: '#6366f1' })
})
```

---

### SvelteKit

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte'

  onMount(async () => {
    const { default: AllyWidget } = await import('ally-widget')
    AllyWidget.init({ primaryColor: '#6366f1' })
  })
</script>

<slot />
```

---

### Astro

```astro
<!-- src/layouts/Layout.astro -->
---
// server-side — nothing here
---
<html lang="en">
  <head>...</head>
  <body>
    <slot />

    <script>
      // This block runs in the browser only
      import AllyWidget from 'ally-widget'
      AllyWidget.init({ primaryColor: '#6366f1' })
    </script>
  </body>
</html>
```

---

### WordPress

```php
// functions.php (child theme or plugin)
function enqueue_ally_widget() {
    wp_enqueue_script(
        'ally-widget',
        'https://cdn.jsdelivr.net/npm/ally-widget/dist/ally-widget.min.js',
        [],
        '1.0.0',
        true   // load in footer
    );

    wp_add_inline_script(
        'ally-widget',
        "window.AllyWidgetOptions = {
            position: 'bottom-right',
            primaryColor: '#6366f1',
            poweredByText: '" . get_bloginfo('name') . "'
        };",
        'before'
    );
}
add_action('wp_enqueue_scripts', 'enqueue_ally_widget');
```

---

### Laravel / Blade

```html
{{-- resources/views/layouts/app.blade.php --}}
<script>
  window.AllyWidgetOptions = {
    position: 'bottom-right',
    primaryColor: '#6366f1',
    poweredByText: '{{ config("app.name") }}'
  };
</script>
<script src="{{ asset('vendor/ally-widget/ally-widget.min.js') }}"></script>
{{-- or CDN: src="https://cdn.jsdelivr.net/npm/ally-widget/dist/ally-widget.min.js" --}}
```

---

### Angular

```ts
// src/app/app.component.ts
import { Component, AfterViewInit } from '@angular/core'

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent implements AfterViewInit {
  ngAfterViewInit() {
    import('ally-widget').then(({ default: AllyWidget }) => {
      AllyWidget.init({ primaryColor: '#6366f1' })
    })
  }
}
```

---

### PHP (plain)

```php
<!-- footer.php or before </body> -->
<script>
  window.AllyWidgetOptions = {
    position: 'bottom-right',
    primaryColor: '#6366f1'
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/ally-widget/dist/ally-widget.min.js"></script>
```

---

### `AllyWidget.init()` reference

```js
const instance = AllyWidget.init(options)
// Returns the widget instance, or null when called server-side.
// Handles DOMContentLoaded automatically — safe to call at any time.
```

### Disabling auto-init

Suppress the automatic CDN init when you are calling `AllyWidget.init()` yourself:

```html
<script>
  window.AllyWidgetOptions = { autoInit: false };
</script>
```

---

## Customization Guide

### Minimal setup — just the essentials

Hide features your site doesn't need to keep the panel focused:

```js
AllyWidget.init({
  disableFeatures: [
    'readable-text',       // remove Dyslexia Font
    'hide-images',         // remove Hide Images
    'annotations',         // hide dev tools in prod
    'accessibility-report'
  ]
})
```

---

### Custom colour theme

Pass any CSS value. Use `primaryColor` as a single fallback, or override each element independently with the granular tokens:

```js
AllyWidget.init({
  // Single fallback — all granular keys derive from this if not set
  primaryColor: '#e11d48',

  // ── Toggle button ────────────────────────────────────────
  toggleButtonBg:       '#0f172a',     // dark button
  toggleButtonRingColor:'#e11d48',     // red ring
  toggleButtonIconColor:'#f8fafc',     // near-white icon

  // ── Menu header ──────────────────────────────────────────
  menuHeaderBg:         '#1e293b',     // dark header
  menuHeaderColor:      '#ffffff',

  // ── Feature buttons ──────────────────────────────────────
  featureIconColor:     '#374151',     // default icon fill
  featureIconActiveColor: '#ffffff',   // icon color when ON
  featureButtonActiveBg:  '#e11d48',  // active button bg
  featureButtonHoverBg:   '#f1f5f9',  // hover bg

  // ── Section titles ───────────────────────────────────────
  sectionTitleColor:    '#9ca3af',

  // ── Panel ────────────────────────────────────────────────
  backgroundColor:      '#0f172a',
  cardBackground:       '#1e293b',
  borderColor:          '#334155',
  borderRadius:         '8px',
  buttonBorderRadius:   '12px',
  zIndex:               99999
})
```

---

### Expanding FAB toggle button

The toggle button expands on hover to reveal a label and optional keyboard shortcut. All aspects are configurable:

```js
AllyWidget.init({
  size:                    '58px',
  toggleButtonBg:          '#C5161D',     // button background
  toggleButtonIconColor:   '#ffffff',     // icon color
  toggleButtonBorderRadius:'16px',        // rounded-square (use '50%' for circle)
  toggleButtonShadow:      '0 4px 14px rgba(0,0,0,0.25)',
  toggleButtonShadowHover: '0 8px 22px rgba(0,0,0,0.28)',

  // Text revealed on hover
  toggleButtonLabel:       'Accessibility',
  toggleButtonShortcut:    'Ctrl+F2',     // omit or set '' to hide
  toggleLabelFontSize:     '1.1rem',
  toggleLabelFontWeight:   '700',
  toggleShortcutFontSize:  '0.7rem',
  toggleShortcutFontWeight:'600',
})
```

The button animates from its square size to roughly 3× its width on hover, then snaps back when the menu is open.

---

### Custom branding

Replace the footer link with your own, or pass an empty string to hide it entirely:

```js
AllyWidget.init({
  poweredByText: 'My Company',      // shown in the menu footer
  poweredByUrl:  'https://mycompany.com'
})

// Hide the branding link completely:
AllyWidget.init({ poweredByText: '' })
```

---

### Rename, re-icon, or recolor any button

```js
AllyWidget.init({
  featureOverrides: {
    // Rename
    'text-to-speech': { label: 'Read Page Aloud' },
    'reading-aid':    { label: 'Focus Line' },

    // Rename + custom SVG
    'bold-text': {
      label: 'Bold',
      icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>'
    },

    // Color only — no SVG required
    'contrast-toggle':  { iconColor: '#6d28d9', iconInnerColor: '#c4b5fd' },
    'highlight-links':  { iconColor: '#0369a1' },

    // Wildcard — all others
    '*': { iconColor: '#374151' }
  }
})
```

---

### Custom toggle button icon

```js
AllyWidget.init({
  // Built-in variants: 'default' | 'person' | 'eye' | 'universal'
  icon: 'universal',

  // Or pass any SVG string:
  icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>'
})
```

---

### Position and size

```js
AllyWidget.init({
  position: 'bottom-left',   // bottom-right | bottom-left | top-right | top-left
  offset:   [24, 32],        // [horizontal, vertical] px from edge
  size:     '60px'           // toggle button size
})
```

---

### Event callbacks for analytics

```js
AllyWidget.init({
  onOpen()  { analytics.track('ally_open') },
  onClose() { analytics.track('ally_close') },

  onFeatureToggle(key, enabled) {
    analytics.track('ally_feature', { key, enabled })
    // key examples: 'bold-text', 'contrast-toggle', 'text-to-speech'
  },

  onReset() { analytics.track('ally_reset') }
})
```

---

### Full example — everything configured

```js
window.AllyWidgetOptions = {
  // Placement
  position:         'bottom-right',
  offset:           [20, 20],
  size:             '56px',
  keyboardShortcut: true,            // Alt+A

  // Language
  lang:             'ne',            // 'en' | 'ne'

  // Storage
  storageKey:       'myapp-ally',

  // Branding
  poweredByText:    'My Company',
  poweredByUrl:     'https://mycompany.com',

  // Theme — base
  primaryColor:     '#6366f1',
  borderRadius:     '12px',
  buttonBorderRadius: '50%',
  zIndex:           9999,

  // Theme — toggle button FAB
  toggleButtonBg:           '#6366f1',
  toggleButtonIconColor:    '#ffffff',
  toggleButtonBorderRadius: '50%',
  toggleButtonShadow:       '0 4px 14px rgba(0,0,0,0.22)',
  toggleButtonShadowHover:  '0 8px 22px rgba(0,0,0,0.22)',
  toggleButtonLabel:        'Accessibility',
  toggleButtonShortcut:     'Ctrl+F2',
  toggleLabelFontSize:      '1rem',
  toggleLabelFontWeight:    '700',
  toggleShortcutFontSize:   '0.7rem',
  toggleShortcutFontWeight: '600',

  // Theme — menu
  menuHeaderBg:           '#4f46e5',
  featureIconColor:       '#374151',
  featureIconActiveColor: '#ffffff',
  featureButtonActiveBg:  '#6366f1',
  sectionTitleColor:      '#6b7280',

  // Features
  disableFeatures:  ['annotations', 'accessibility-report'],

  featureOverrides: {
    'text-to-speech': { label: 'Read Aloud' },
    '*':              { iconColor: '#374151' },
    'contrast-toggle':{ iconColor: '#6366f1', iconInnerColor: '#a5b4fc' }
  },

  // TTS
  ttsNativeVoiceLang: 'ne-NP',
  ttsRate:            0.9,
  ttsPitch:           1.0,

  // Callbacks
  onOpen()  { console.log('opened') },
  onClose() { console.log('closed') },
  onFeatureToggle(key, enabled) { console.log(key, enabled) },
  onReset() { console.log('reset') }
}
```

---

## Dev Mode

Append `?ally-dev=true` to any URL to enable the Annotations and Accessibility Report tools. These run an axe-core scan and overlay issue markers on the page — useful during development, hidden in production.

```
https://yoursite.com/page?ally-dev=true
```

The axe-core library is loaded on demand in dev mode only — zero weight in production.

### Hiding the violation badge

When violations are found, a red number badge appears on the toggle button. To hide it:

```js
AllyWidget.init({
  showViolationBubble: false
});
```

---

## Keyboard Shortcut

**Alt + A** toggles the panel on any page. Disable it with `keyboardShortcut: false`.

---

## Publishing to npm

```bash
# Set your token
export NPM_TOKEN=your_token_here   # or put it in .env

# Build then publish
npm run build
npm publish
```

The `.npmrc` at the project root reads `NPM_TOKEN` automatically:

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

---

## License

MIT — see [LICENSE](LICENSE)
