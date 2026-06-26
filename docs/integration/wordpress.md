# WordPress Integration Guide

Integrate ally-widget into any WordPress site using the CDN build — no npm or bundler required.

---

## Quick Start

### Method 1 — `functions.php` (Recommended)

Add to your child theme's `functions.php` or a site-specific plugin:

```php
<?php
function ally_widget_enqueue() {

    // Detect language (works with WPML, Polylang, or plain get_locale())
    $locale    = get_locale(); // e.g. 'ne_NP' or 'en_US'
    $ally_lang = ( strpos( $locale, 'ne' ) === 0 ) ? 'ne' : 'en';

    // 1. Set options BEFORE the script loads
    wp_add_inline_script(
        'ally-widget',
        "window.AllyWidgetOptions = {
            position: 'bottom-left',
            lang:     '" . esc_js( $ally_lang ) . "'
        };",
        'before'
    );

    // 2. Load the widget in the footer
    wp_enqueue_script(
        'ally-widget',
        'https://cdn.jsdelivr.net/npm/ally-widget@1.1.9/dist/ally-widget.min.js',
        [],
        '1.1.9',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ally_widget_enqueue' );
```

### Method 2 — Hardcoded in `footer.php`

If you cannot edit `functions.php`, paste this before `</body>` in your theme's `footer.php`:

```html
<script>
  window.AllyWidgetOptions = { position: 'bottom-left', lang: 'en' };
</script>
<script src="https://cdn.jsdelivr.net/npm/ally-widget@1.1.9/dist/ally-widget.min.js"></script>
```

---

## GIBL (Global IME Bank) Configuration

This is the exact configuration used on the Global IME Bank website. Copy it as a starting point for any GIBL-branded WordPress site.

### `functions.php`

```php
<?php
function gibl_enqueue_ally_widget() {

    $locale    = get_locale();
    $ally_lang = ( strpos( $locale, 'ne' ) === 0 ) ? 'ne' : 'en';

    wp_add_inline_script(
        'ally-widget',
        "window.AllyWidgetOptions = {
            position:                 'bottom-left',
            size:                     '58px',
            lang:                     '" . esc_js( $ally_lang ) . "',

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
            poweredByText:            ''
        };",
        'before'
    );

    wp_enqueue_script(
        'ally-widget',
        'https://cdn.jsdelivr.net/npm/ally-widget@1.1.9/dist/ally-widget.min.js',
        [],
        '1.1.9',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'gibl_enqueue_ally_widget' );
```

### `footer.php` equivalent (no `functions.php` access)

```html
<script>
  window.AllyWidgetOptions = {
    position:                 'bottom-left',
    size:                     '58px',
    lang:                     'en',

    toggleButtonBg:           '#C5161D',
    toggleButtonIconColor:    '#ffffff',
    toggleButtonBorderRadius: '16px',
    toggleButtonLabel:        'Accessibility',
    toggleButtonShortcut:     'Ctrl+F2',
    toggleLabelFontSize:      '1.6rem',
    toggleLabelFontWeight:    '700',
    toggleShortcutFontSize:   '1rem',
    toggleShortcutFontWeight: '600',

    primaryColor:             '#044189',
    menuHeaderBg:             '#044189',
    featureButtonActiveBg:    '#044189',

    poweredByText:            ''
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/ally-widget@1.1.9/dist/ally-widget.min.js"></script>
```

---

## Configuration Reference

### What each GIBL setting does

| Option | Value | Effect |
|---|---|---|
| `position` | `'bottom-left'` | Widget anchors to bottom-left corner |
| `size` | `'58px'` | Toggle button is 58 × 58 px |
| `toggleButtonBg` | `'#C5161D'` | GIBL red button background |
| `toggleButtonIconColor` | `'#ffffff'` | White accessibility icon |
| `toggleButtonBorderRadius` | `'16px'` | Rounded square (not a full circle) |
| `toggleButtonLabel` | `'Accessibility'` | Label shown when button expands on hover |
| `toggleButtonShortcut` | `'Ctrl+F2'` | Keyboard shortcut hint below label |
| `toggleLabelFontSize` | `'1.6rem'` | Label text size |
| `toggleShortcutFontSize` | `'1rem'` | Shortcut hint text size |
| `primaryColor` | `'#044189'` | GIBL blue — base fallback for unset tokens |
| `menuHeaderBg` | `'#044189'` | Menu header bar background |
| `featureButtonActiveBg` | `'#044189'` | Active feature button fill |
| `poweredByText` | `''` | Empty string hides the branding link |
| `lang` | `'ne'` or `'en'` | Switches widget UI language |

---

## Multilingual WordPress (WPML / Polylang)

### WPML

```php
function gibl_enqueue_ally_widget() {
    $wpml_lang = apply_filters( 'wpml_current_language', 'en' );
    $ally_lang = ( $wpml_lang === 'ne' ) ? 'ne' : 'en';

    wp_add_inline_script( 'ally-widget', "
        window.AllyWidgetOptions = {
            lang: '" . esc_js( $ally_lang ) . "',
            /* ... rest of GIBL options ... */
        };
    ", 'before' );

    wp_enqueue_script( 'ally-widget',
        'https://cdn.jsdelivr.net/npm/ally-widget@1.1.9/dist/ally-widget.min.js',
        [], '1.1.9', true );
}
add_action( 'wp_enqueue_scripts', 'gibl_enqueue_ally_widget' );
```

### Polylang

```php
$pll_lang  = function_exists( 'pll_current_language' ) ? pll_current_language() : 'en';
$ally_lang = ( $pll_lang === 'ne' ) ? 'ne' : 'en';
```

---

## Using WordPress Customizer (No Code)

If you want site admins to control the widget color without editing code, expose settings via the Customizer:

```php
function gibl_ally_customizer( $wp_customize ) {
    $wp_customize->add_section( 'ally_widget', [
        'title'    => 'Accessibility Widget',
        'priority' => 200,
    ]);

    $wp_customize->add_setting( 'ally_button_color', [
        'default'           => '#C5161D',
        'sanitize_callback' => 'sanitize_hex_color',
    ]);

    $wp_customize->add_control( new WP_Customize_Color_Control(
        $wp_customize, 'ally_button_color', [
            'label'   => 'Button Color',
            'section' => 'ally_widget',
        ]
    ));

    $wp_customize->add_setting( 'ally_menu_color', [
        'default'           => '#044189',
        'sanitize_callback' => 'sanitize_hex_color',
    ]);

    $wp_customize->add_control( new WP_Customize_Color_Control(
        $wp_customize, 'ally_menu_color', [
            'label'   => 'Menu Header Color',
            'section' => 'ally_widget',
        ]
    ));
}
add_action( 'customize_register', 'gibl_ally_customizer' );

function gibl_enqueue_ally_widget() {
    $btn_color  = get_theme_mod( 'ally_button_color', '#C5161D' );
    $menu_color = get_theme_mod( 'ally_menu_color',   '#044189' );

    wp_add_inline_script( 'ally-widget', "
        window.AllyWidgetOptions = {
            toggleButtonBg:        '" . esc_js( $btn_color )  . "',
            primaryColor:          '" . esc_js( $menu_color ) . "',
            menuHeaderBg:          '" . esc_js( $menu_color ) . "',
            featureButtonActiveBg: '" . esc_js( $menu_color ) . "',
            /* ... rest of options ... */
        };
    ", 'before' );

    wp_enqueue_script( 'ally-widget',
        'https://cdn.jsdelivr.net/npm/ally-widget@1.1.9/dist/ally-widget.min.js',
        [], '1.1.9', true );
}
add_action( 'wp_enqueue_scripts', 'gibl_enqueue_ally_widget' );
```

---

## Upgrading

Change the version number in both places:

```php
wp_enqueue_script(
    'ally-widget',
    'https://cdn.jsdelivr.net/npm/ally-widget@1.1.10/dist/ally-widget.min.js',
    [], '1.1.10', true   // <-- update both
);
```

The version string passed to `wp_enqueue_script` is appended as a `?ver=` query param, which busts the browser cache automatically.

---

## Disabling on Specific Pages

```php
function gibl_enqueue_ally_widget() {
    // Skip on WooCommerce checkout (example)
    if ( function_exists('is_checkout') && is_checkout() ) return;

    // Skip on a specific page by slug
    if ( is_page('example-slug') ) return;

    // ... enqueue as normal
}
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Widget appears but ignores `AllyWidgetOptions` | Script loaded before `window.AllyWidgetOptions` was set | Move options to `'before'` in `wp_add_inline_script`, or use `footer.php` ordering |
| Widget doesn't appear | Script blocked by a security plugin | Whitelist the jsDelivr CDN domain in your CSP / script blocker |
| Widget appears twice | `wp_enqueue_scripts` hook called in two places | Remove the duplicate `add_action` |
| Wrong language shown | `get_locale()` returns unexpected value | Use WPML/Polylang filter instead (see Multilingual section) |
| CDN slow or unavailable | jsDelivr propagation delay on new versions | Pin to a specific known-good version, or self-host the file |

### Self-hosting (alternative to CDN)

Download the file and serve it from your own server to avoid CDN dependency:

```
https://cdn.jsdelivr.net/npm/ally-widget@1.1.9/dist/ally-widget.min.js
```

Upload to `/wp-content/themes/your-theme/js/ally-widget.min.js`, then update the URL:

```php
wp_enqueue_script(
    'ally-widget',
    get_stylesheet_directory_uri() . '/js/ally-widget.min.js',
    [], '1.1.9', true
);
```
