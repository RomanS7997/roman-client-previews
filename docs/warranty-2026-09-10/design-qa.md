# Design QA: final mobile warranty landing

## Evidence

- Source visual truth: `C:\Users\romas\AppData\Local\Temp\codex-clipboard-84e419a8-d05b-4f8b-b72b-f45e664da003.png`.
- Source dimensions: `581 x 1280 px`.
- Implementation: `docs/warranty-2026-09-10/folded.html` with `folded-final.css` and `landing.js`.
- Implementation screenshot evidence: Codex in-app browser captures displayed during QA. The capture API did not expose a filesystem path.
- Reproducible local URL: `http://127.0.0.1:4173/warranty-2026-09-10/folded.html`.
- Primary comparison viewport: `390 x 844 CSS px`, `devicePixelRatio: 1`.
- Rendered document size at the primary viewport: `390 x 1840 CSS px`.
- Additional responsive captures: `320 x 700` and `430 x 932`.
- State: public unauthenticated landing, collapsed FAQ, first carousel slide.

## Full-view comparison

- The implementation preserves the selected sequence: light hero, three stacked benefits, dark video chapter, light FAQ, and luminous closing CTA.
- The abstract Folded Light artwork is used as a real WebP asset in all illustrated regions; no CSS gradient or placeholder illustration replaces it.
- The page is implemented as a genuine scrolling mobile layout instead of compressing the full concept into one viewport.
- Curved full-width section boundaries carry the source's flowing transitions without introducing nested cards or abrupt blue cutoffs.
- At `390 px`, the video rail shows one `286 px` card and a controlled glimpse of the next slide.

## Focused-region comparison

- Hero: title, lead, and CTA begin at `20 px`; title renders at `41.73 px`, lead at `14 px`, and CTA at `241.45 x 52 px`.
- Benefits: all three items use the same icon column and text rhythm. A stable light surface prevents the third item from crossing the dark artwork.
- Video: label and all supporting copy are white on a controlled deep-violet field; real supplied video posters are used.
- FAQ: five full-width accordion rows use violet plus controls and preserve the approved copy.
- Closing: white statement and CTA remain on a darkened artwork crop; footer links are readable and aligned to the same `20 px` gutter.

## Required fidelity surfaces

- Fonts and typography: local Onest 400/500/600/700 files load. Display text uses realistic mobile sizing, zero letter spacing, and natural Cyrillic wrapping at `320`, `390`, and `430 px`.
- Spacing and layout rhythm: the hero, CTA, video copy, FAQ, closing copy, and footer share the `20 px` mobile guide. The `320 px` breakpoint changes it to `16 px`. No horizontal page overflow was found.
- Colors and visual tokens: ink is used only on stable light surfaces and white only on controlled saturated surfaces. Violet, coral, lavender, and warm white stay consistent with the selected visual.
- Image quality and asset fidelity: the supplied `folded-flow-bg.webp` and all three real video posters are rendered directly. Existing SVG icon assets are used; no emoji or hand-drawn replacements were introduced.
- Copy and content: approved warranty wording, all three video instructions, five FAQ entries, Telegram destination, and four document links are retained. No `12 месяцев` claim appears.

## Comparison history

### Iteration 1

- P1: the last benefit crossed a dark part of the artwork and lost contrast.
- P2: the top of the video section was too pale for white type.
- P2: the closing copy crossed a bright fold.

Fixes:

- Added one full-width stable light benefit surface while retaining the surrounding raster artwork.
- Reduced the dark artwork opacity over a deep-violet base so the video section remains saturated and readable.
- Darkened the closing artwork crop while preserving its coral-violet color movement.

### Iteration 2

- Post-fix captures at `320`, `390`, and `430 px` show readable text, no clipped controls, and `scrollWidth` equal to the viewport width.
- The hero remains three lines, CTA remains compact, and the video rail retains a visible next-slide cue at every tested width.
- No actionable P0, P1, or P2 visual mismatch remains.

## Primary interaction checks

- Carousel dot 2 moved the rail to `scrollLeft: 298` and updated `aria-current` from slide 1 to slide 2.
- FAQ expanded and exposed the approved marketplace copy, then collapsed again.
- Documents dialog opened with all four production links and restored page scrolling on close.
- The first supplied MP4 opened in the video dialog with the correct title and source URL.
- Telegram CTA remains `https://t.me/giftsactivate_bot?start=landing`.
- Browser console warnings/errors: none.

## Follow-up polish

- P3: an alternate landscape poster frame can be extracted from each MP4 later if the operator wants a different moment from the same videos.

final result: passed
