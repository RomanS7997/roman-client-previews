# Design QA: warranty variants 2 and 3

## Evidence

- Source visual truth, Folded Light: `C:\Users\romas\.codex\generated_images\01a09020-d106-7453-8517-519820f346ff\exec-4b782769-e7e4-415f-b185-40d9ba5e8b7e.png`
- Source visual truth, Prism Shield: `C:\Users\romas\.codex\generated_images\01a09020-d106-7453-8517-519820f346ff\exec-18472e6a-dcd7-4be6-933f-7c0d46c886cd.png`
- Source dimensions: `853 x 1844 px`; normalized comparison target: `390 x 844 CSS px`.
- Implementations: `folded.html` and `shield.html`.
- Implementation screenshot path: Codex in-app browser capture for tab 18 at each route. The browser capture API displayed the screenshots during QA but did not expose a filesystem path.
- Reproducible local URLs: `http://127.0.0.1:4173/warranty-2026-09-10/folded.html` and `http://127.0.0.1:4173/warranty-2026-09-10/shield.html`.
- Browser state: public, unauthenticated landing; first viewport and full-page states.
- Viewport and density: `390 x 844`, `devicePixelRatio: 1`, `innerWidth: 390`, `clientWidth: 390`.
- Additional responsive checks: `320 x 740`, `430 x 932`, and `1280 x 900`.

## Full-view comparison

- Both pages preserve the selected three-part composition: compact hero, three stacked benefits, and a gradient-led transition into video instructions.
- Folded Light uses the selected translucent folded sheet and ribbon movement without adding unrelated objects.
- Prism Shield keeps the selected refracted shield in the upper-right and carries its light lines through the transition.
- At `390 x 844`, the next section is clearly visible and the first video card begins at the bottom edge, matching the density and progression of the selected sources.
- Mobile horizontal overflow is absent: `scrollWidth` equals `clientWidth` at the target viewport.

## Focused-region comparison

- Hero and CTA: exact three-line title, exact body copy, compact shield CTA, and a shared `20 px` left coordinate.
- Benefit rows: title and description remain on the global left guide; icons are consistently placed on the far right; separators do not introduce a wrapper card.
- Video rail: the first card is readable and the next card peeks into view to communicate horizontal swipe.
- Video dialog: first MP4 opened, reached `readyState: 4`, and played with controls; close restored the page.
- FAQ: native details state expanded and exposed the approved marketplace copy.
- Documents: modal opened and showed all four production document links.

## Required fidelity surfaces

- Fonts and typography: local Onest weights 400/500/600/700 load correctly; wrapping, line height, optical weight, and zero letter spacing match the selected mobile direction.
- Spacing and layout rhythm: hero, CTA, benefits, lesson heading, cards, FAQ, closing copy, and footer share the same outer grid. Measured hero, CTA, benefit, lesson, and FAQ left coordinates are all `20 px` on mobile.
- Colors and visual tokens: the generated peach, coral, lilac, and electric-violet assets are used directly; no generic crypto/dev palette or unrelated decorative elements were introduced.
- Image quality and asset fidelity: both abstract backgrounds are real generated WebP assets. Video posters come from the three supplied source videos; controls use Lucide-compatible SVG assets.
- Copy and content: approved warranty wording, three video instructions, five FAQ entries, CTA destination, and legal links are present. Legacy `12 месяцев`, old removed sections, and the obsolete film card are absent.

## Comparison history

### Iteration 1

- P1: CTA text and shield were low contrast against a bright crop of the background asset.
- P2: hero and benefit rows were too tall, leaving too little of the video section in the first mobile viewport.
- P2: the video label crossed a bright transition and lost contrast.

Fixes:

- Added a dark multiply blend and solid violet fallback to both asset-backed CTA treatments.
- Reduced hero height, display type, benefit row height, and transition spacing while retaining readable mobile sizes.
- Moved the generated-background transition upward and added controlled text contrast to the video heading.

### Iteration 2

- Post-fix captures at `320`, `390`, and `430 px` show readable text, no clipped CTA, no horizontal overflow, consistent left alignment, and a visible next-section cue.
- No actionable P0, P1, or P2 mismatch remains.

### Iteration 3

- P1: the video heading in Prism Shield crossed a near-white part of the artwork and lost contrast; secondary hero and benefit copy was also too light on pale areas.
- P2: the Folded Light closing statement crossed bright peach and white folds.

Fixes:

- Added a full-width translucent violet scrim to the video section, preserving the generated artwork while keeping every white heading line readable across bright and dark areas.
- Strengthened video-heading shadows, darkened secondary copy in both variants, and locally reduced closing-art brightness behind white copy.
- Rechecked the same responsive widths after the contrast pass; layout geometry and interaction targets are unchanged.

### Iteration 4

- P2: the full-width contrast scrim made the approved background substantially darker and reduced the visibility of its gradient transitions.

Fixes:

- Removed the scrim and restored the original artwork without filters.
- Kept the video copy white over the dark mobile crop and changed only its text color to dark ink at the desktop crop, where the artwork is pale.
- Preserved the darker secondary hero and benefit text on white areas.

## Primary interaction checks

- Telegram CTA destination resolves with HTTP 200.
- All three optimized H.264 MP4 files fully decode without errors.
- Video modal opens, plays, closes, and retains a direct-file fallback.
- FAQ expands and collapses.
- Documents modal opens and all production legal URLs resolve with HTTP 200.
- Browser console warnings/errors: none.

## Follow-up polish

- P3: after stakeholder selection, the unused visual variant can be removed from production while remaining available in preview history.

final result: passed
