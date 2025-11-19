# Zilap Ehnia Font Integration

This folder holds the tribal display font used for the hero title.

## 1. Add / Extract Font Files
Unzip `zilap-ehnia-font.zip` and place the usable font files here. Prefer `.woff2` for production; convert from `.otf`/`.ttf` if needed.

Recommended naming (rename if different):
- `ZilapEhnia-Regular.woff2`
- (Optional) `ZilapEhnia-Medium.woff2`
- (Optional) `ZilapEhnia-Bold.woff2`

Use an online converter or locally:
```
# Example local conversion (requires fonttools + brotli)
pyftsubset ZilapEhnia-Regular.ttf --output-file=ZilapEhnia-Regular.woff2 --flavor=woff2 --layout-features='*' --drop-tables+=GSUB,GPOS --desubroutinize
```
Adjust dropped tables only if size is critical; keep GSUB/GPOS if the font needs advanced shaping.

## 2. Verify File Names
The CSS expects `ZilapEhnia-Regular.woff2`. If your file names differ, update `fonts.css` accordingly.

## 3. Adding More Weights
Duplicate the `@font-face` block, change `font-weight` and file name:
```css
@font-face {
  font-family: 'ZilapEhnia';
  src: url('./ZilapEhnia-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

## 4. Usage
Only the hero title currently uses this font via the selector:
```css
.hero-title.desia-display { font-family: 'ZilapEhnia', 'DesiaDisplay', 'Noto Serif Oriya', serif; }
```

## 5. Fallbacks
Keep a culturally appropriate Odia fallback (e.g. `Noto Serif Oriya`). Final cascade already includes it.

## 6. Performance Tips
- Include only required weights initially (Regular).
- Use `font-display: swap` to avoid invisible text.
- Subset the font if file size > 100KB and it causes layout shift.

## 7. Testing
Open DevTools → Network → filter "Zilap" and confirm the `.woff2` loads.
Use DevTools Elements panel to inspect the hero title and confirm computed `font-family` resolves to `ZilapEhnia`.

## 8. Troubleshooting
| Issue | Fix |
|-------|-----|
| Font not applied | Check class names `hero-title desia-display` on `<h1>` and file path correctness. |
| 404 on font file | Ensure fonts are inside `src/assets/fonts` and path in CSS uses `./`. |
| FOUC (flash of unstyled text) | Keep `font-display: swap`; consider preloading: `<link rel="preload" href="/src/assets/fonts/ZilapEhnia-Regular.woff2" as="font" type="font/woff2" crossorigin>` in `index.html`. |

## 9. Extending Beyond Hero Title
If you decide later to apply this font to section headings, add:
```css
.section-header h2.desia-display { font-family: 'ZilapEhnia', 'DesiaDisplay', 'Noto Serif Oriya', serif; }
```
(Keep scope narrow to retain body readability.)

---
Edit this README once real file names differ.
