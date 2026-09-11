# Warranty landing redesign QA, revision 3

Date: 2026-09-10
Scope: static GitHub Pages previews only. Production site and bot are unchanged.

## Result

Two independent mobile-first concepts remain:

- Monochrome: editorial serif typography, black CTA, monochrome still-life background.
- Coral: modern sans typography, oversized 12-month marker, warm unpacking background.

The former yellow-green third concept and all of its page, preview, image and CSS
assets were removed.

## Source comparison

The implementation was reviewed side by side with the supplied monochrome mobile
reference and with the previously accepted coral palette direction. Comparison
files are stored outside the published repository in `_preview/qa-v3`:

- `compare-mono.jpg`
- `compare-coral.jpg`

Both implementations preserve the intended large warranty message and direct CTA,
while integrating photography as a full hero background instead of a separate
image block. The two pages deliberately use different hierarchy and typography.

## Responsive checks

- Mobile viewports checked at 320x568, 390x844 and 430x932.
- Desktop layout checked in the in-app browser.
- Hero CTA is visible in the first viewport at every tested mobile size.
- `clientWidth` equals `scrollWidth` at 390 px for both pages.
- No missing or broken images in either 390 px page.
- At 390 px, both heroes are 780 px high and expose the following navigation band.
- Activation steps, video carousel, support, FAQ, closing CTA and footer were
  inspected in both themes.
- A grid placement defect that compressed process copy beneath step numbers was
  found during QA, fixed, and rechecked.

## Interaction checks

- FAQ disclosure opens correctly.
- Documents dialog opens and closes correctly.
- Video dialog opens and closes correctly; direct video links remain available.
- Telegram activation CTA points to `@giftsactivate_bot` with `start=landing`.
- Browser error log was empty during local interaction checks.

## Static checks

- `landing.js` passes `node --check`.
- `git diff --check` passes.
- No duplicate HTML IDs or missing local `href`/`src` references were found.
- The generated hero assets are 941x1672 and 1672x941; gallery previews are
  390x844.
- The deleted third concept is no longer linked or present as a page.

## Scope limits

This is a visual preview release. No bot activation or customer record was created.
Videos and legal pages remain hosted on `giftsactivate.ru`; their legal content was
not audited in this pass.

## Published verification

- Commit: `3b3f8ead7f898fa305ddfc43402471c80a47dbc4`.
- GitHub Pages run `34458149671` completed successfully.
- The public gallery contains exactly the monochrome and coral directions.
- Both public hero pages were opened and visually checked after deployment with a
  commit-specific cache buster.
- The old `sage.html` route returns 404; both new monochrome hero assets return 200.
- Public FAQ, documents dialog and video dialog were exercised; browser logs were
  empty.

final result: passed

---

# Three full warranty concepts, revision 7

Date: 2026-09-11
Scope: three complete mobile-first GitHub Pages concepts sharing one verified
content and interaction layer. The existing branded preview remains unchanged.

## Visual directions

- Flow: a continuous orange-lilac-violet light ribbon connects the hero,
  editorial benefit rows and video section.
- Editorial: a restrained typographic layout uses a diagonal image field,
  compact rectangular CTA and asymmetric benefit matrix.
- Bold: a deep-violet campaign hero, coral CTA, oversized shield and angled
  section changes create the strongest high-contrast direction.
- Generated placeholder content was not carried into code: `Lifestore`, product
  renders, generic video tiles and invented copy are absent.

## Product content

- All concepts use the approved warranty headline, Telegram verification copy,
  three warranty benefits, five FAQ answers, closing CTA and legal documents.
- All `12 months` claims are absent; the wording is consistently `расширенная
  гарантия`.
- The three instruction cards use the real auto-installation, phone-film and
  tablet-glass posters and MP4 files hosted on `giftsactivate.ru`.
- Both activation CTAs point to `@giftsactivate_bot` with `start=landing`.

## Visual comparison and responsive checks

- Each generated direction and its coded implementation were inspected together
  in a side-by-side in-app-browser comparison.
- First screens and section transitions were visually checked at 320x568,
  390x844 and 430x932, plus the desktop browser viewport.
- Measured `clientWidth / scrollWidth` is `320 / 320`, `390 / 390` and
  `430 / 430` for all three concepts.
- CTA labels, hero copy and benefit text remain readable at 320px; no button,
  heading, media card or section creates horizontal overflow.
- No unresolved P0, P1 or P2 visual issues remain in the selected scope.

## Interaction and static checks

- FAQ disclosure opens correctly.
- Documents dialog opens and closes correctly and exposes all four legal links.
- Video dialog opens with the correct real poster and direct MP4 fallback.
- All three local pages, all six remote video assets and all four legal pages
  returned HTTP 200.
- HTML has no duplicate IDs or missing local asset references.
- CSS opening and closing brace counts match, and forbidden placeholder or
  `12 months` copy is absent.

final result: passed

---

# Operator feedback revision, revision 6

Date: 2026-09-11
Scope: branded warranty GitHub Pages preview only. Production site and Telegram
bot are unchanged.

## Evidence

- Source visual truth: `_preview/qa-v6/source-operator-mobile.png` (591x1280,
  including mobile browser chrome).
- Implementation capture: `_preview/qa-v6/implementation-mobile-390x844.png`
  (390x844 CSS viewport).
- The source and implementation were inspected together in one side-by-side
  comparison view, with the hero CTA and phone image treated as the critical
  comparison region.

## Findings and fixes

- Removed the in-hero header links `Гарантия покупки` and `Помощь`.
- Removed the outer mobile shell inset so the hero begins at the top edge.
- Tightened the mobile hero copy and limited the CTA to 318px so the button sits
  above the phone instead of covering its camera area.
- Removed the requested activation-steps, confirmed-state and support sections.
- Reduced the remaining section spacing and replaced the obsolete three-item
  quick navigation with links to video instructions and warranty terms.
- Updated the gallery thumbnail to represent the current first screen.
- No unresolved P0, P1 or P2 visual issues remain in the requested scope.

## Responsive and interaction checks

- First viewport visually checked side by side at 320, 390 and 430px widths.
- Measured client/scroll widths were 320/320, 390/390 and 430/430.
- Desktop hero was checked after scoping the compact CTA rule to mobile only.
- FAQ disclosure opens, video dialog opens and closes, and the documents dialog
  opens and closes.
- Telegram activation CTA remains `@giftsactivate_bot?start=landing`.
- Browser error log was empty during local interaction checks.

## Static checks

- `landing.js` passes `node --check`.
- `git diff --check` passes.
- No duplicate IDs or missing local `href`/`src` references were found.
- The removed sections and their obsolete fragment links are absent from HTML.

## Published verification

- Commit: `0f68335f17bf4fa2b5e68d33a4bb4dd2f66ae59e`.
- GitHub Pages run `34561445124` completed successfully.
- The public page was reloaded with a commit-specific cache buster at 390px.
- Public viewport measured 390px client width and 390px scroll width.
- The public FAQ and documents dialog were exercised; browser error log was empty.

final result: passed

---

# Mobile typography refinement, revision 5

Date: 2026-09-10
Scope: branded warranty preview only.

- Increased mobile body copy from 12-13px to 14px and key controls to 14-15px.
- Increased FAQ, card, support, dialog and footer text sizes.
- Relaxed heading and body line-height and increased section/card spacing.
- Removed the low-contrast Telegram helper line from mobile while retaining it on desktop.
- Strengthened the mobile hero readability overlay and preserved live HTML copy over the image.
- Checked 320x568, 390x844 and 430x932: CTA remains in the first viewport and no horizontal overflow was detected.
- Checked activation, instructions and FAQ sections at 375px.
- Compared the pre-change and post-change mobile states side by side.

final result: passed

---

# Warranty landing redesign QA, revision 4

Date: 2026-09-10
Scope: new branded concept for the static GitHub Pages preview. Production site
and Telegram bot are unchanged.

## Visual direction

- Matched the supplied MPSALES design system: white base, deep purple surfaces,
  the orange-magenta-purple brand gradient, rounded panels and luminous product
  imagery.
- The new product visual is a full hero background with live HTML copy and CTA.
- The complete landing remains present below the hero: activation flow, confirmed
  state, video instructions, support, FAQ, final CTA and legal documents.
- The reference hero and the implementation were inspected together in a single
  side-by-side comparison view.

## Responsive checks

- First viewport inspected at 320x568, 390x844 and 430x932.
- CTA is visible at every tested mobile size, with the next navigation band
  visible at the bottom of the viewport.
- Browser layout checks report `clientWidth == scrollWidth` at 320, 390 and 430 px.
- Activation, video and FAQ sections were inspected at 375 px.
- Hero, activation cards and result panel were inspected at the desktop viewport.

## Interaction and static checks

- FAQ expands and collapses.
- Documents dialog opens and closes.
- Video dialog opens, and the remote poster and MP4 both return HTTP 200.
- Telegram CTA retains `@giftsactivate_bot` and `start=landing`.
- `landing.js` passes `node --check`.
- No duplicate IDs or missing local references were found.
- `git diff --check` passes.

final result: passed
