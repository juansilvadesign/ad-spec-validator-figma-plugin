# Tasks

The living implementation checklist. Strategy, release boundaries, and the fixed
frame live in **[`ROADMAP.md`](ROADMAP.md)**.

_Last reviewed: 2026-08-05_

> Milestone **A** is shipped. **B is the only execution-ready milestone.** Items
> under C–E are deliberately coarse and must be re-planned after the preceding
> retrospective.

---

## Next — Milestone B: defensible single-creative verdicts ▶

**Capacity ceiling:** 10 maintainer-days.

**Exit outcome:** one selected creative receives a source-aware, scale-correct,
regression-tested verdict. A user can distinguish a hard platform requirement
from a recommendation or local heuristic without leaving the offline plugin.

### 0. Start the fixed frame

- [ ] Record the implementation kickoff date and the resulting six-week end date
      in [`ROADMAP.md`](ROADMAP.md#fixed-frame); keep the 30-day total and B's
      10-day ceiling fixed.
- [ ] Capture a clean git baseline and record the starting commit in the B release
      notes. Preserve unrelated work if the tree is not clean.
- [ ] Create a small fixture inventory covering exact size, accepted alternate
      ratio, undersized art, safe-zone overlap, overlapping text, hidden text, no
      text, and invalid selection before changing verdict semantics.

### 1. Define what a verdict means

- [ ] Define three rule classes in one source of truth:
      **requirement** (may fail), **recommendation** (may warn), and **heuristic**
      (informational or warning only).
- [ ] Define overall-grade precedence when a report mixes requirements,
      recommendations, heuristics, and unavailable checks.
- [ ] Replace the implicit `width`/`height` contract with explicit size semantics:
      exact, minimum, recommended, accepted alternatives, and unsupported.
- [ ] Model ratios as exact values, accepted sets, or ranges instead of forcing
      every format through one target plus tolerance.
- [ ] Define inclusive boundary behavior for dimensions, ratio tolerance, text
      thresholds, and safe-zone edge contact.
- [ ] Treat text coverage as an estimate, not platform-policy compliance. A
      deprecated or unsourced threshold must not produce a compliance failure.
- [ ] Add an **unknown/unverified** state rather than converting missing evidence
      into a pass.

### 2. Audit and version the catalog

- [ ] Check every one of the current 18 format entries against first-party
      platform documentation; do not use aggregator articles as authority.
- [ ] For every user-facing rule, store its source URL, source title, checked date,
      rule class, and a short interpretation note.
- [ ] Reconcile UI format names with the platform's current terminology. Rename,
      split, or retire presets when the evidence requires it; preserving the number
      18 is not a goal.
- [ ] Separate platform constraints from recommended production sizes. Do not
      assume that a common template size is a required minimum or maximum.
- [ ] Convert safe zones to normalized coordinates or pair canonical pixel values
      with an explicit canonical canvas so they scale predictably.
- [ ] Support top, right, bottom, and left zones in the schema even if the audited
      catalog does not yet need every edge.
- [ ] Assign a catalog version and `lastReviewed` date, visible in the plugin and
      testable without network access.
- [ ] Document disputed or unavailable values instead of filling gaps with false
      precision.

### 3. Create a testable, dependency-free core

- [ ] Add a zero-runtime-dependency source layout that separates the spec catalog,
      frame geometry, pure validation, and UI rendering.
- [ ] Add a deterministic build script that emits the checked-in `code.js` and
      self-contained `ui.html`; `manifest.json` must remain directly importable.
- [ ] Make generated-file headers identify their source and forbid hand edits to
      generated regions.
- [ ] Add a drift check that fails when source and checked-in plugin artifacts do
      not agree.
- [ ] Use Node's built-in test runner so contributors can run the core suite without
      installing runtime libraries.
- [ ] Keep Figma main-thread APIs behind a small adapter so geometry and verdict
      rules can be tested with plain objects.

### 4. Correct geometry and lifecycle behavior

- [ ] Scale each safe zone from its canonical/normalized definition to the actual
      selected frame before testing text overlap.
- [ ] Check the full text rectangle against every configured edge; report a stable
      layer identifier plus the human-readable name for each violation.
- [ ] Skip text beneath an effectively hidden ancestor and clip text to the selected
      frame bounds.
- [ ] Compute the union of clipped visible text rectangles so overlapping boxes are
      not counted twice; retain a documented bounding-box limitation for glyph
      shape, rotation, masks, and effects that cannot be measured reliably.
- [ ] Handle zero-area or unavailable bounding boxes as an unavailable check, not a
      numeric pass.
- [ ] Keep frame dimensions at useful precision for calculations and round only at
      presentation boundaries.
- [ ] Ensure the close button and Figma's native close event produce at most one
      thank-you notification.
- [ ] Confirm revalidation cannot use stale selection data after an invalid or empty
      selection.

### 5. Lock the regression matrix

- [ ] Add schema tests for unique preset keys, valid rule classes, valid source
      metadata, positive dimensions, normalized zones, and coherent thresholds.
- [ ] Add at least one canonical passing fixture for every audited preset.
- [ ] Add boundary tests immediately below, on, and above each dimension and ratio
      threshold.
- [ ] Add accepted-alternate and accepted-range cases so valid non-canonical ratios
      do not regress to warnings or failures.
- [ ] Prove safe-zone results are invariant when the same composition is scaled to
      0.5×, 1×, and 2×.
- [ ] Prove hidden text is excluded and overlapping text rectangles contribute
      their union area.
- [ ] Prove requirement failures dominate the grade while recommendations and
      heuristics use their defined non-failing states.
- [ ] Cover empty selection, unsupported node, missing spec, missing geometry, no
      text, HTML-sensitive layer names, and zero-area input.
- [ ] Run syntax checks for both emitted JavaScript contexts and parse the manifest
      in the automated verification command.

### 6. Make trust visible in the UI

- [ ] Show the catalog version and review date without crowding the 480 × 640px
      window.
- [ ] Label each result as requirement, recommendation, heuristic, or unavailable;
      keep status understandable without color alone.
- [ ] Provide an offline source-detail affordance with source title and URL that can
      be copied when direct navigation is unavailable.
- [ ] Explain accepted alternatives/ranges in the spec hint instead of displaying a
      misleading single target.
- [ ] Rename **Text Coverage** to make its approximate nature explicit and surface
      the most important measurement limitation.
- [ ] Announce selection and grade changes accessibly and preserve logical keyboard
      focus order.
- [ ] Keep report details escaped and readable for long or duplicated layer names.

### 7. Accept and release B

- [ ] Import the checked-in manifest in the Figma desktop app and run the fixture
      matrix in both light and dark themes.
- [ ] Verify selection change, platform change, manual revalidation, invalid
      selection, empty selection, both close paths, and plugin reopen.
- [ ] Verify the plugin makes no network request and does not mutate the document.
- [ ] Have at least one real creative's result manually cross-checked against every
      cited first-party rule used for its selected preset.
- [ ] Update `README.md` with the rule taxonomy, catalog version, build/test command,
      limitations, and the revised project structure.
- [ ] Add `CHANGELOG.md` and record the behavior changes, especially any preset that
      was renamed, removed, or changed from fail to warning/informational.
- [ ] Bump the release version only after automated and manual evidence is green.
- [ ] Record the release commit/tag and verification evidence in
      [`ROADMAP.md`](ROADMAP.md), mark B shipped, and re-plan C inside the remaining
      capacity.

---

## Later — Milestone C: campaign-set preflight and handoff summary ⬜

Do not expand these items until B's retrospective confirms that users trust the
single-frame result.

- [ ] Define a bounded multi-selection contract, including unsupported nodes,
      mixed sizes, maximum batch size, cancellation, and stable ordering.
- [ ] Validate every supported selected frame and show a campaign-level summary
      with drill-down to the failing creative and rule.
- [ ] Let the user copy a plain-text/Markdown handoff summary containing frame,
      preset, grade, actionable failures, catalog version, and review date.
- [ ] Keep the document unchanged and keep one-frame behavior as the fast path.
- [ ] Measure the batch on a representative large Figma page and set a responsive
      performance guard before release.
- [ ] Run the checkpoint, record evidence, and decide whether D or E now returns
      more value per remaining day.

---

## Later — Milestone D: guided, non-destructive remediation ⬜

- [ ] Validate demand using B/C failure patterns; pick one recurring, safely
      correctable problem rather than building a general fixer.
- [ ] Prototype an opt-in safe-zone overlay that can be removed cleanly and never
      changes the creative itself.
- [ ] Prototype duplicate-then-resize for one proven preset; preserve the original
      and make crop/fit behavior explicit before execution.
- [ ] Verify undo, naming, page placement, repeated runs, locked content, instances,
      and partial failure.
- [ ] Ship only the remediation that saves time without implying that automated
      layout changes preserve creative intent.

---

## Later — Milestone E: installable release and sustainable catalog ⬜

- [ ] Confirm whether a Figma Community listing already exists; update it if it
      does, otherwise prepare the required icon, cover, description, support,
      privacy, and review material.
- [ ] Add a repeatable release check for generated-artifact drift, tests, manifest,
      version, changelog, and catalog freshness.
- [ ] Define an owner and review interval for first-party spec sources, plus a fast
      path for correcting a harmful stale verdict.
- [ ] Finish keyboard, focus, contrast, zoom, and screen-reader acceptance gaps
      discovered in earlier releases.
- [ ] Publish catalog updates as versioned offline releases; do not add remote
      configuration or telemetry to solve freshness.

---

## Completed — Milestone A: offline single-creative validator v1.0 ✅

- [x] Add a Figma manifest with main/UI entry points, dynamic-page access, and no
      allowed network domains.
- [x] Analyze the first selected frame, component, component set, instance, or
      group and react to selection changes.
- [x] Ship 18 presets across Meta, Google, TikTok, LinkedIn, X, Pinterest, and
      Snapchat.
- [x] Report width, height, aspect ratio, text coverage, and configured safe-zone
      overlap with pass/warning/fail presentation.
- [x] Re-run validation when the selected preset changes or the user requests it.
- [x] Keep the plugin self-contained in `code.js` and `ui.html`, with no runtime
      dependency or network request.
- [x] Document local import, architecture, behavior, and basic syntax/manifest
      verification in `README.md`.
- [x] Record the v1.0 release in commit `f9309de`; latest baseline is `10b34d7`.

---

## Parked — not committed in the current frame

- Exported-file size, codec, bitrate, duration, audio, or upload validation.
- Remote spec fetching, scraping, accounts, telemetry, or cloud history.
- Creative-performance scoring or policy guarantees beyond available evidence.
- Full ad generation, copy rewriting, localization, or non-Figma editors.
