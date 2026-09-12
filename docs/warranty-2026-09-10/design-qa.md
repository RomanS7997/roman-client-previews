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
- The abstract Folded Light artwork and the integrated luminous-shield artwork are used as real WebP assets; no CSS gradient or placeholder illustration replaces them.
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
- Colors and visual tokens: ink is used only on stable light surfaces and white only on controlled saturated surfaces. The deep plum action color, softened violet field, coral accents, lavender, and warm white create clear separation between background art and controls.
- Image quality and asset fidelity: the supplied `folded-flow-bg.webp`, `shield-flow-bg.webp`, and all three real video posters are rendered directly. Existing SVG icon assets are used; no emoji or hand-drawn replacements were introduced.
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

### Iteration 3

- P2: the rounded bottom of the video section exposed white side wedges before the FAQ.
- P2: the saturated lower fold of the light artwork appeared as a separate ribbon and ended abruptly above the video heading.

Fixes:

- Kept the video background full-width beneath the overlapping FAQ, so the white section now enters as one continuous curve without side gaps.
- Extended the light artwork above its clipped section and anchored it to the top, keeping the hero texture while removing the isolated lower ribbon.
- Rechecked the two boundaries at `390 x 844` and `320 x 780`; the page width remained equal to the viewport and browser logs stayed empty.

### Iteration 4

- P2: both gradient CTA buttons blended into the surrounding raster artwork and did not establish a strong action hierarchy.
- P2: the three benefit icons used inconsistent light and warm fills, which made them look unrelated.
- P2: the hero lacked the previously approved glass-shield warranty signal.

Fixes:

- Rebuilt the hero CTA as a compact solid deep-plum control and the closing CTA as a solid white inverse control.
- Unified all benefit icons as dark plum circles with white line icons and consistent borders, shadows, and sizing.
- Extracted the existing glass shield into a transparent `760 x 811` WebP asset and positioned it behind the right edge of the hero CTA without covering copy or increasing horizontal width.
- Softened the saturated dark-section palette toward plum while preserving the original raster artwork and white-text contrast.
- Rechecked at `320 x 780`, `390 x 844`, and `430 x 932`: no clipped text or controls, `scrollWidth` equals the viewport width, and browser warnings/errors remain empty.

### Iteration 5

- P2: the transparent 3D shield was a separate foreground object, while the selected reference uses a large luminous shield drawn directly into the flowing background.

Fixes:

- Replaced the foreground cutout with the existing `shield-flow-bg.webp` artwork used by the selected reference.
- Anchored the raster to the upper-right so the complete glowing shield remains visible beside the hero copy while the left side stays quiet enough for reading.
- Restored the compact hero height and retained the approved solid CTA and unified dark benefit icons.
- At `320 px`, the lead is constrained to `220 px`; at `390` and `430 px`, it is `255 px`, preventing the copy from crossing the shield's brightest checkmark.
- Rechecked `320 x 780`, `390 x 844`, and `430 x 932`: the hero background loaded, browser logs remained empty, and `scrollWidth` matched every viewport.

### Iteration 6

- P2: the solid action controls and benefit icons read as nearly black against the luminous peach-violet artwork.

Fixes:

- Shifted the shared action color from black-plum to a lighter deep blue (`#3d5296`) while preserving white-label contrast.
- Applied the same blue to all three benefit circles, the closing CTA text, and its shield icon so both action areas now belong to one color system.
- Retained the solid fills and compact button geometry so the CTAs remain distinct from the gradient background.
- Rechecked the updated palette at `320 x 780` and `390 x 844`: labels remain readable, the three icons are consistent, and the closing CTA uses the same blue accent.

### Iteration 7

- P2: a pale grey strip remained between the curved benefits panel and the dark video section.

Fixes:

- Removed the unused light-background space below the benefits panel so the dark artwork now begins directly beneath its lower curve.
- Increased the video section's top padding by the same amount, preserving the established position of the video heading and carousel.
- Rechecked the transition at `320 x 780`, `390 x 844`, and `430 x 932`: the pale strip is gone and the dark artwork now meets the white curve cleanly at every width.

### Iteration 8

- P2: the large circular icon badges, bright rim, and heavy shadow felt visually dated next to the cleaner page typography.

Fixes:

- Reworked the three benefit icons as compact `46 px` squircles with a calmer blue fill, restrained highlight, and softer shadow.
- Reduced the pictograms to `23 px` so the line work has more breathing room.
- Simplified both CTA icon chips by removing the outlined inset frame and reducing the shield to `21 px`.
- Rechecked the hero, benefit rows, and closing CTA at `320 x 780` and `390 x 844`: every label fits, icon alignment is consistent, and no surrounding layout shifted.

### Iteration 9

- P2: the FAQ plus icons shifted toward bright pink on mobile, while the closing CTA used a separate white treatment.

Fixes:

- Applied the same deterministic deep-blue color treatment to every FAQ plus icon.
- Removed the closing-only CTA overrides so the bottom action now matches the hero CTA in fill, typography, shield chip, border, shadow, and interaction states.
- Rechecked the FAQ and closing action at `320 x 780`, `390 x 844`, and `430 x 932`: the plus icons remain blue, the CTA label fits, and the button stays visually distinct from the dark artwork.

### Iteration 10

- P2: the closing CTA still retained a modifier class and a one-pixel spacing override, allowing it to be perceived as a separate button variant.

Fixes:

- Removed the closing modifier from both HTML and CSS. The hero and closing actions now use the exact same class, dimensions, spacing, colors, shield treatment, shadow, and interaction states.
- Compared both rendered actions at `320 x 780` and `390 x 844`: their geometry and visual treatment now match exactly.

### Iteration 11

- P3: the inherited white one-pixel outer highlight was too visible around the closing CTA on the darker background.

Fixes:

- Removed only the white outer highlight from the closing CTA in its default and hover states, retaining its blue border, fill, geometry, shield chip, and primary shadow.
- Rechecked the closing CTA at `320 x 780` and `390 x 844`: no white rim remains around the button or its shadow.

### Iteration 12

- P2: the darkened multicolor artwork made the video section feel heavy and visually competed with the brighter hero.

Fixes:

- Changed only the video section to a calm solid iris (`#6269b8`) and removed its decorative background image.
- Made the supporting copy and video-card captions fully white; the white-to-iris contrast ratio is `4.96:1`, passing WCAG AA for their body-size text.
- Left the hero, buttons, benefit block, FAQ, closing section, spacing, and interactions unchanged for an isolated color comparison.
- Rechecked the isolated change at `320 x 780`, `390 x 844`, and `430 x 932`: the section transitions remain clean, all white copy is readable, and the carousel geometry is unchanged.

### Iteration 13

- P2: the deep blue action controls and benefit icons sat outside the warm violet palette of the shield artwork.
- P2: the space between the curved benefits panel and the video heading felt larger than the spacing rhythm used elsewhere on the page.

Fixes:

- Recolored both activation buttons to a muted warm violet and the three benefit badges to a related lighter violet, preserving white-label contrast and the existing compact geometry.
- Matched the FAQ plus icons and violet action shadows to the same accent family so the page no longer mixes unrelated blue and purple controls.
- Reduced only the video section's top padding by `31 px`, moving the heading and carousel upward while retaining a deliberate gap beneath the curved white panel.
- Rechecked at `320 x 780`, `390 x 844`, and `430 x 932`: the curve-to-heading gap is consistently `45 px`, page width matches every viewport, and both button labels remain unbroken.
- White text on the default violet button is `6.25:1`; carousel, video dialog, FAQ, documents dialog, and both Telegram links still work, with no browser warnings or errors.

### Iteration 14

- P3: the small shield chip inside the activation CTA duplicated the much stronger shield artwork in the hero and made the compact button feel busier than necessary.

Fixes:

- Removed the shield chip from both activation buttons so their shared style remains identical.
- Rebalanced the controls as centered text-only buttons with equal horizontal padding, retaining the existing height, violet fill, label weight, and interaction states.
- Rechecked at `320 x 780` and `390 x 844`: both labels stay on one line, the buttons remain `52 px` high, no unused icon nodes remain, and page width matches the viewport.
- Confirmed the closing CTA uses the same `205.45 x 52 px` geometry as the hero CTA at `390 px`; browser warnings and errors remain empty.

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
