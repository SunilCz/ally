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
| `icon` | `string` | `'default'` | Built-in variant name or a raw SVG string for the toggle button icon |
| `icons` | `object` | — | Override any icon in the full icon set (see [Icon Keys](#icon-keys)) |
| `poweredByText` | `string` | `'Ally Widget'` | Footer link label |
| `poweredByUrl` | `string` | widget repo URL | Footer link href |
| `disableFeatures` | `string[]` | `[]` | Feature keys to hide from the panel (see [Feature Keys](#feature-keys)) |
| `featureOverrides` | `object` | `{}` | Override `label` or `icon` for any feature button |
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
| `primaryColor` | `#4f46e5` | Main brand color — button, active states |
| `primaryColorLight` | `#818cf8` | Lighter tint |
| `primaryColorDark` | `#3730a3` | Darker shade |
| `backgroundColor` | `#ffffff` | Panel background |
| `textColor` | `#1f2937` | Panel text |
| `textColorInverted` | `#ffffff` | Text on primary background |
| `cardBackground` | `#f9fafb` | Feature card background |
| `borderColor` | `#e5e7eb` | Dividers and borders |
| `focusRingColor` | `#4f46e5` | Keyboard focus ring |
| `hoverColor` | `#f3f4f6` | Button hover background |
| `activeColor` | `#ede9fe` | Active/selected button background |
| `borderRadius` | `12px` | Panel corner radius |
| `buttonBorderRadius` | `50%` | Toggle button shape |
| `headerHeight` | `56px` | Panel header height |
| `focusBorderWidth` | `2px` | Focus ring width |
| `focusOutlineOffset` | `2px` | Focus ring offset |
| `zIndex` | `9999` | Stacking context |
| `buttonSize` | `52px` | Alias for `size` |

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

## Feature Label & Icon Overrides

```js
window.AllyWidgetOptions = {
  featureOverrides: {
    'bold-text': {
      label: 'Bold'
    },
    'text-to-speech': {
      label: 'Read Aloud',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>'
    }
  }
};
```

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

### Next.js (App Router)

The widget is browser-only. Use `AllyWidget.init()` inside `useEffect` so it never runs on the server.

```jsx
// components/AllyWidgetLoader.jsx
'use client'
import { useEffect } from 'react'

export default function AllyWidgetLoader() {
  useEffect(() => {
    import('ally-widget').then(({ default: AllyWidget }) => {
      AllyWidget.init({
        position: 'bottom-right',
        primaryColor: '#6366f1',
        lang: 'en'
      })
    })
  }, [])

  return null
}
```

```jsx
// app/layout.jsx
import AllyWidgetLoader from '@/components/AllyWidgetLoader'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AllyWidgetLoader />
      </body>
    </html>
  )
}
```

### Next.js (Pages Router / `_document`)

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

### Next.js — CDN via `next/script` (zero npm install)

```jsx
// app/layout.jsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="ally-config" strategy="beforeInteractive">{`
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

### Nuxt 3

```js
// plugins/ally-widget.client.js  ← the .client suffix means browser-only
import AllyWidget from 'ally-widget'

export default defineNuxtPlugin(() => {
  AllyWidget.init({
    position: 'bottom-right',
    primaryColor: '#6366f1'
  })
})
```

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
<script src="{{ asset('js/ally-widget.min.js') }}"></script>
```

### `AllyWidget.init()` reference

```js
// Returns the widget instance (or null when called server-side)
const instance = AllyWidget.init(options)
```

Accepts the same options object as the constructor. Handles `DOMContentLoaded` automatically — safe to call before the document is ready.

### Disabling auto-init

When importing via npm in a framework, the CDN auto-init still fires if the module loads in a browser context. Suppress it with `autoInit: false`:

```html
<script>
  window.AllyWidgetOptions = { autoInit: false };
</script>
```

Or when the module is loaded purely programmatically (e.g. inside `useEffect`), auto-init is already skipped because the module executes after `DOMContentLoaded` has already fired and you're calling `AllyWidget.init()` yourself.

---

## Dev Mode

Append `?ally-dev=true` to any URL to enable the Annotations and Accessibility Report tools. These run an axe-core scan and overlay issue markers on the page — useful during development, hidden in production.

```
https://yoursite.com/page?ally-dev=true
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
