# Next.js Integration Guide

---

## Pages Router

### 1. Install the package

```bash
npm install ally-widget
# or
yarn add ally-widget
```

### 2. Create `AllyWidgetLoader`

```tsx
// components/AllyWidgetLoader.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AllyWidgetLoader() {
  const { locale } = useRouter();

  useEffect(() => {
    import('ally-widget').then((mod) => {
      const AllyWidget = mod.default;
      const lang = locale === 'np' ? 'ne' : 'en';
      AllyWidget.init({
        // paste your options here (see GIBL config below)
        lang,
      });
    });
  }, []);

  return null;
}
```

### 3. Render in `_app.tsx`

```tsx
// pages/_app.tsx
import AllyWidgetLoader from '../components/AllyWidgetLoader';

const MyApp = (props) => {
  return (
    <>
      <AllyWidgetLoader />
      {/* rest of your app */}
    </>
  );
};
```

---

## App Router

```tsx
// components/AllyWidgetLoader.tsx
'use client';
import { useEffect } from 'react';

export default function AllyWidgetLoader() {
  useEffect(() => {
    import('ally-widget').then(({ default: AllyWidget }) => {
      AllyWidget.init({
        // paste your options here
      });
    });
  }, []);

  return null;
}
```

```tsx
// app/layout.tsx
import AllyWidgetLoader from '@/components/AllyWidgetLoader';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AllyWidgetLoader />
      </body>
    </html>
  );
}
```

---

## GIBL (Global IME Bank) Configuration

This is the exact `AllyWidgetLoader` used on the Global IME Bank Next.js website.

```tsx
// components/Common/AllyWidgetLoader.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AllyWidgetLoader() {
  const { locale } = useRouter();

  useEffect(() => {
    import('ally-widget').then((mod) => {
      const AllyWidget = mod.default;
      // Map Next.js locale ('np') to ally-widget lang code ('ne')
      const lang = locale === 'np' ? 'ne' : 'en';

      AllyWidget.init({
        position:                 'bottom-left',
        size:                     '58px',
        lang,

        /* ── Toggle button (expanding FAB) ──────────── */
        toggleButtonBg:           '#C5161D',
        toggleButtonIconColor:    '#ffffff',
        toggleButtonBorderRadius: '16px',
        toggleButtonLabel:        'Accessibility',
        toggleButtonShortcut:     'Ctrl+F2',
        toggleLabelFontSize:      '1.6rem',
        toggleLabelFontWeight:    '700',
        toggleShortcutFontSize:   '1rem',
        toggleShortcutFontWeight: '600',

        /* ── Menu ───────────────────────────────────── */
        primaryColor:             '#044189',
        menuHeaderBg:             '#044189',
        featureButtonActiveBg:    '#044189',

        /* ── Branding ───────────────────────────────── */
        poweredByText:            '',
      });
    });
  }, []);

  return null;
}
```

Use in `pages/_app.tsx`:

```tsx
import AllyWidgetLoader from '../components/Common/AllyWidgetLoader';

const MyApp = (props) => {
  const { pageProps, router } = props;
  return (
    <>
      <AllyWidgetLoader />
      {/* rest of app */}
    </>
  );
};
```

---

## Notes

- The dynamic `import('ally-widget')` ensures the widget never runs during SSR — it is browser-only.
- `AllyWidget.init()` is idempotent and handles `DOMContentLoaded` automatically.
- The locale mapping (`'np'` → `'ne'`) is specific to GIBL's Next.js i18n config where the locale code is `np` but the ally-widget lang code is the ISO 639-1 `ne`.
- Do not call `new AllyWidget(...).startAccessibleWebWidget()` — use `AllyWidget.init()` which wraps both steps.
