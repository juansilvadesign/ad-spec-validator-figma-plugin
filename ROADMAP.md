# Roadmap

Where Ad Spec Validator goes after its v1.0 baseline.

**Direction:** turn a useful offline checker into a **defensible creative
preflight**: every verdict is traceable to a dated source or explicitly labeled
as guidance, works at any canvas scale, and helps a designer move from one frame
to a campaign-ready set without leaving Figma.

This file owns strategy, release boundaries, and status. The actionable checklist
lives in **[`TASKS.md`](TASKS.md)**.

_Last reviewed: 2026-08-05_

---

## Fixed frame

No calendar deadline or monetary budget was supplied. To keep this roadmap
responsive rather than open-ended, the planning baseline is fixed as follows:

| Constraint | Fixed planning baseline |
| --- | --- |
| **Outcome** | Before export, a designer can tell whether a selected creative meets the chosen placement's current requirements, distinguish requirements from recommendations, and act on the result with confidence. |
| **Deadline** | End of the sixth calendar week after implementation kickoff. Record the actual kickoff and resulting end date before Milestone B starts; do not extend the six-week window. |
| **Capacity budget** | One maintainer, at most **30 maintainer-days** across Milestones B–E. No paid infrastructure. |
| **Scope** | Open. Milestone B is protected; later capabilities are cut, reordered, or deferred as evidence and capacity change. |

The product constraints remain fixed throughout the window:

- The installed plugin works offline and keeps `networkAccess.allowedDomains` at
  `none`.
- `manifest.json`, `code.js`, and `ui.html` remain directly importable into Figma;
  contributors may use a dependency-free build step, but users do not need one.
- No runtime dependencies, account, telemetry, or remote spec fetch.
- A **fail** is reserved for a violated, sourced platform constraint. Best
  practices and heuristics can inform or warn, but must not masquerade as policy.
- Any future canvas mutation is explicit, reversible, and preserves the original.

If 30 days cannot buy every planned release, ship fewer complete benefits. Do not
trade away verdict trust to preserve Milestones C–E.

---

## Current baseline and why trust comes next

The repository has a working v1.0 release commit (`f9309de`) and a later close
toast change (`10b34d7`). Today it validates the first selected frame against 18
formats on seven platforms and reports dimensions, ratio, text coverage, and
safe-zone overlap. It is a credible MVP; it is not yet a compliance authority.

| Observed v1.0 behavior | Consequence | Roadmap response |
| --- | --- | --- |
| Specs, thresholds, and notes are embedded in `ui.html` without sources or review dates. | A user cannot tell whether a result is a platform rule, recommendation, or local heuristic. | Milestone B introduces provenance and rule classes. |
| Each format has one target ratio, even when its note describes a range such as 1:1–4:5. | A valid alternate can receive a warning or fail. | Model accepted sizes, ratio sets, and ranges explicitly. |
| Safe zones are fixed canonical pixels. | A 2× frame is checked against a half-sized danger area. | Store normalized or canonical zones and scale them to the selected frame. |
| Text coverage sums descendant text bounding boxes. Hidden text and overlaps can inflate the result. | The percentage is useful guidance, but can look more precise than it is. | Count visible clipped regions once and label the measure as an estimate. |
| Validation logic and rendering share one 1,198-line HTML file and have no automated tests. | A catalog edit can silently change verdicts. | Extract a dependency-free, testable core while retaining self-contained output. |
| `selection[0]` is the only node analyzed. | Campaign sets still require one-frame-at-a-time review. | Batch preflight follows only after single-frame trust is proven. |

---

## Milestones

`✅ shipped` · `▶ next` · `⬜ later`

| | Benefit-delivering release | State | Capacity ceiling | Assumption retired |
| --- | --- | --- | --- | --- |
| **A** | Offline single-creative validator v1.0 | ✅ | Shipped | Designers value immediate preflight feedback inside Figma. |
| **B** | Defensible single-creative verdicts | ▶ | 10 days | Sourced, explainable results are trustworthy enough to guide export decisions. |
| **C** | Campaign-set preflight and handoff summary | ⬜ | 8 days | Reviewing many creatives together saves meaningful QA time. |
| **D** | Guided, non-destructive remediation | ⬜ | 7 days | Designers want help fixing failures, not only identifying them. |
| **E** | Installable release and sustainable catalog | ⬜ | 5 days | Easier installation and visible freshness turn repeat use into adoption. |

The current order is **A → B → C → D → E**. Only B is detailed enough to
execute. C–E are option boundaries, not promises; re-plan them after each shipped
release.

### A — Offline single-creative validator v1.0 ✅

The MVP is end-to-end: import the manifest, select a supported frame-like node,
choose one of 18 format presets, and receive a pass/warning/fail report. Selection
changes and format changes re-run validation without a network request. This is
enough product to test; the next release hardens the meaning of its answers.

### B — Defensible single-creative verdicts ▶

**Value shipped:** a designer can inspect one creative and understand not only
what passed, but why, how current the rule is, and whether it is a platform
requirement or a best-practice warning.

**Riskiest assumption:** provenance plus corrected geometry will make the verdict
credible enough for a real pre-export decision. If users still verify every row
elsewhere, expanding the feature set is premature.

The release includes:

1. Audit all 18 formats against first-party platform documentation. Record a
   source, checked date, and rule class for every user-facing constraint; when no
   authoritative rule exists, say so and retain it only as labeled guidance.
2. Replace the single-size model with explicit semantics: exact, recommended,
   minimum, accepted alternatives, ratio sets/ranges, and normalized safe zones.
3. Extract the catalog and pure validation/geometry rules into testable source,
   with a zero-runtime-dependency build that still emits checked-in `code.js` and
   self-contained `ui.html`.
4. Scale safe zones to the selected frame, ignore effectively hidden text, avoid
   double-counting overlapping text rectangles, and define edge-contact behavior.
5. Show rule class, catalog review date, and concise provenance in the UI. Label
   text coverage as an estimate and keep detail available without network access.
6. Prove boundary cases with automated fixtures and a manual Figma acceptance
   matrix before calling the release complete.

**Protected cut line:** provenance, rule classification, accepted-dimension
semantics, scale-correct safe zones, regression tests, and honest UI language all
ship together. Cosmetic refinements, saved preferences, and new formats are cut
first if the 10-day ceiling is threatened.

**Not in B:** multi-selection, report export, automatic resizing, guide creation,
new platforms, live spec updates, or file-level video checks.

### C — Campaign-set preflight and handoff summary ⬜

**Value shipped:** select a set of creatives once, see which placements are ready,
and copy a compact QA summary for handoff.

Keep this release coarse until B's retrospective. The likely slice is bounded
multi-selection, a campaign-level pass/warning/fail summary, drill-down to each
frame, and a clipboard report containing the catalog version and source dates.
The original document remains unchanged.

**Assumption retired:** batch review is materially faster than repeating the
single-frame flow. If real usage remains one-off, prioritize E instead.

### D — Guided, non-destructive remediation ⬜

**Value shipped:** a designer can understand and resolve a failed size or safe-zone
check without reconstructing the target placement by hand.

Candidate scope is an opt-in safe-zone overlay and a duplicate-then-resize action
for one proven format. Never resize the original, and never pretend that an
automatic crop preserves creative intent. The smallest useful remediation wins;
this is not a general ad generator.

**Assumption retired:** guided fixes reduce correction time without creating fear
of document mutation.

### E — Installable release and sustainable catalog ⬜

**Value shipped:** users can install a polished release, identify its catalog
freshness, and receive updates without depending on a development-manifest setup.

Candidate scope is the Figma Community release checklist (or confirmation and
repair of an existing listing), accessible keyboard/focus behavior, version and
changelog discipline, first-party source review cadence, and a repeatable release
check. The plugin remains offline; catalog updates travel with versioned releases.

**Assumption retired:** reduced installation friction and visible maintenance are
enough to support repeat use beyond the maintainer's own files.

---

## Definition of done for every release

A milestone is shipped only when:

- Its end-to-end user benefit works in the Figma desktop app from the checked-in
  manifest.
- Automated syntax, manifest, catalog, validation, and generated-artifact checks
  pass where applicable.
- Light and dark Figma themes, empty/invalid selection, and the release's happy and
  failure paths have been exercised manually.
- No unexpected network request or document mutation occurs.
- `README.md`, `TASKS.md`, this roadmap, and the changelog/version evidence agree
  with the shipped behavior.
- A commit or release identifier is recorded in the milestone table; completion
  is evidence, not intent.

---

## Retrospective and re-plan cadence

Run a short checkpoint after each release, or after five maintainer-days without a
release, whichever comes first.

At each checkpoint:

1. Review incorrect verdicts, confusing labels, manual cross-checks, Figma runtime
   problems, and time spent versus the capacity ceiling.
2. Decide whether the release's risky assumption was supported, contradicted, or
   still untested.
3. Re-cut the remaining scope inside the fixed six-week/30-day frame. Detail only
   the next milestone; leave later ones coarse.
4. Update the milestone table, evidence, capacity remaining, and the review date in
   both roadmap files.

If a first-party platform changes a rule mid-increment, correctness work can
replace planned scope, but the deadline and capacity do not move.

---

## Explicitly parked

These are not part of the six-week frame without new evidence and a new roadmap:

- Validating exported file size, codec, bitrate, duration, audio, or upload
  eligibility—the selected Figma frame does not contain that evidence.
- Remote configuration, automatic policy scraping, accounts, telemetry, or cloud
  history.
- Predicting ad performance or assigning a creative quality score.
- Generating complete ad variants or rewriting creative content.
- Supporting editors other than Figma.
