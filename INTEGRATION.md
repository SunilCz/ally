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
https://cdn.jsdelivr.net/npm/ally-widget@1.1.10/dist/ally-widget.min.js
```

Replace `1.1.10` with the latest version when upgrading.

---

## Nepali TTS Proxy

Most desktop browsers do not ship a `ne-NP` voice. When `lang: 'ne'` is set and no native Nepali voice is found, the widget falls back to Google Translate TTS via a **server-side proxy** you host. The proxy calls Google's TTS endpoint server-side (bypassing browser-level blocks) and pipes the audio back to the client.

### How it works

```
Browser → GET /api/tts?text=…&lang=ne → Your server → Google TTS → audio/mpeg → Browser
```

Set `ttsProxyUrl` to your endpoint's path:

```js
AllyWidget.init({
  lang: 'ne',
  ttsProxyUrl: '/api/tts',
});
```

The widget calls `GET <ttsProxyUrl>?text=<encoded-nepali-text>&lang=ne`. Your endpoint must return the raw `audio/mpeg` body.

---

### Next.js — Pages Router

```ts
// pages/api/tts.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text, lang = 'ne' } = req.query;
  if (!text || typeof text !== 'string') return res.status(400).end();

  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=gtx&ttsspeed=1`;
  const upstream = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/',
    },
  });
  if (!upstream.ok) return res.status(upstream.status).end();

  const buffer = await upstream.arrayBuffer();
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(Buffer.from(buffer));
}
```

```js
AllyWidget.init({ lang: 'ne', ttsProxyUrl: '/api/tts' });
```

---

### Next.js — App Router

```ts
// app/api/tts/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') ?? '';
  const lang = searchParams.get('lang') ?? 'ne';

  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=gtx&ttsspeed=1`;
  const upstream = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/',
    },
  });
  if (!upstream.ok) return new Response(null, { status: upstream.status });

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
```

```js
AllyWidget.init({ lang: 'ne', ttsProxyUrl: '/api/tts' });
```

---

### Express / Node.js

```js
// Install: npm install node-fetch  (or use built-in fetch in Node 18+)
app.get('/api/tts', async (req, res) => {
  const { text, lang = 'ne' } = req.query;
  if (!text) return res.status(400).end();

  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=gtx&ttsspeed=1`;
  const upstream = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/',
    },
  });
  if (!upstream.ok) return res.status(upstream.status).end();

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  upstream.body.pipe(res);
});
```

```js
AllyWidget.init({ lang: 'ne', ttsProxyUrl: '/api/tts' });
```

---

### PHP

```php
<?php
// api/tts.php
$text = $_GET['text'] ?? '';
$lang = $_GET['lang'] ?? 'ne';
if (!$text) { http_response_code(400); exit; }

$url = 'https://translate.googleapis.com/translate_tts?ie=UTF-8&q=' . urlencode($text) . '&tl=' . urlencode($lang) . '&client=gtx&ttsspeed=1';
$context = stream_context_create([
  'http' => [
    'header' => implode("\r\n", [
      'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer: https://translate.google.com/',
    ]),
  ],
]);

header('Content-Type: audio/mpeg');
header('Cache-Control: public, max-age=86400');
readfile($url, false, $context);
```

```js
AllyWidget.init({ lang: 'ne', ttsProxyUrl: '/api/tts.php' });
```

---

### Laravel

```php
// routes/web.php
Route::get('/api/tts', function (Illuminate\Http\Request $request) {
    $text = $request->query('text', '');
    $lang = $request->query('lang', 'ne');
    $url = 'https://translate.googleapis.com/translate_tts?ie=UTF-8&q=' . urlencode($text) . '&tl=' . urlencode($lang) . '&client=gtx&ttsspeed=1';

    $response = \Illuminate\Support\Facades\Http::withHeaders([
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer'    => 'https://translate.google.com/',
    ])->get($url);

    return response($response->body(), 200)
        ->header('Content-Type', 'audio/mpeg')
        ->header('Cache-Control', 'public, max-age=86400');
});
```

```js
AllyWidget.init({ lang: 'ne', ttsProxyUrl: '/api/tts' });
```

---

### WordPress

```php
// functions.php
add_action('rest_api_init', function () {
    register_rest_route('ally/v1', '/tts', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $req) {
            $text = $req->get_param('text') ?? '';
            $lang = $req->get_param('lang') ?? 'ne';
            $url  = 'https://translate.googleapis.com/translate_tts?ie=UTF-8&q=' . urlencode($text) . '&tl=' . urlencode($lang) . '&client=gtx&ttsspeed=1';

            $res = wp_remote_get($url, [
                'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'headers'    => ['Referer' => 'https://translate.google.com/'],
            ]);

            return new WP_HTTP_Response(wp_remote_retrieve_body($res), 200, ['Content-Type' => 'audio/mpeg']);
        },
    ]);
});
```

```js
AllyWidget.init({ lang: 'ne', ttsProxyUrl: '/wp-json/ally/v1/tts' });
```

---

## All Options

See the full options reference in [README.md → All Options](README.md#all-options).
