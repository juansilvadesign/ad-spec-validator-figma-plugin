# Ad Spec Validator

A Figma plugin that validates selected frames against advertising platform specifications.

Select a frame → pick a platform and format → get a pass/warning/fail validation report for
dimensions, aspect ratio, text density, and safe zones.

## What It Does

- Validates frames against 18 ad formats across 7 platforms.
- Checks width, height, aspect ratio, text density, and safe zones.
- Shows a pass/warning/fail report with current vs expected values and fix suggestions.
- Updates automatically when you change the selection or switch platforms.
- Runs without network access.
- Requires no build step.

## Quick Start

1. Open Figma.
2. Go to `Plugins` -> `Development` -> `Import plugin from manifest...`.
3. Select:

```text
knowledge/projects/ad-spec-validator-figma-plugin/manifest.json
```

4. Run `Ad Spec Validator` from the development plugins menu.
5. Select a frame on the canvas and pick a platform from the dropdown.

## Supported Platforms

| Platform | Formats |
|---|---|
| **Meta** | Feed Image, Feed Video, Story / Reel, Carousel, Right Column |
| **Google** | Display Landscape, Display Square, Display Portrait, YouTube Thumbnail |
| **TikTok** | In-Feed, Spark Ad |
| **LinkedIn** | Sponsored Image, Carousel, Video Ad |
| **X (Twitter)** | Image Ad, Carousel |
| **Pinterest** | Standard Pin, Idea Pin |
| **Snapchat** | Snap Ad |

## Validation Checks

| Check | Pass | Warning | Fail |
|---|---|---|---|
| **Width** | Exact or ≥ spec | Within 10% | >10% off |
| **Height** | Exact or ≥ spec | Within 10% | >10% off |
| **Aspect Ratio** | Exact match (≤1%) | Within tolerance | Beyond tolerance |
| **Text Density** | ≤15% area | 15–20% area | >20% area |
| **Safe Zones** | No text in danger zone | — | Text in safe zone area |

### Overall Grade

- **Pass** — all checks green.
- **Warning** — at least one amber, no red.
- **Fail** — at least one red.

## Project Structure

```text
ad-spec-validator-figma-plugin/
├── README.md
├── manifest.json
├── code.js
└── ui.html
```

## Architecture

This plugin follows the standard Figma plugin split:

| File | Role |
|---|---|
| `manifest.json` | Figma plugin metadata and entry points. |
| `code.js` | Main thread. Reads selection, traverses the node tree, calculates text area ratio, sends structured data to the UI. |
| `ui.html` | UI thread. Contains the ad spec database, validation engine, report renderer, and all styling. |

The main thread sends selection data to the UI via `figma.ui.postMessage`. The UI runs all
validation logic client-side against a built-in spec table — no network calls.

## Text Density Calculation

The plugin walks the selected frame's node tree, collects every `TextNode` bounding box,
clips each to the frame bounds, sums the areas, and divides by the frame's total area.
This gives an approximate "percentage of the frame covered by text" — analogous to Meta's
deprecated but still performance-relevant 20% text rule.

## Safe Zone Analysis

For platforms with UI overlays (Meta Stories, TikTok, Snapchat), the plugin checks whether
any text node's bounding box enters the platform's safe zone areas. Each violation is listed
by layer name and distance from the edge.

## Design Notes

- No external dependencies.
- No remote network calls.
- Uses the same design system as the X to Z Operations plugin (Inter font, neutral palette, teal accent).
- Status colors: green (`#10b981`), amber (`#f59e0b`), red (`#ef4444`).
- Plugin window: 480 × 640px.

## Local Verification

Check JavaScript syntax:

```bash
node --check knowledge/projects/ad-spec-validator-figma-plugin/code.js
```

Validate the manifest:

```bash
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('knowledge/projects/ad-spec-validator-figma-plugin/manifest.json','utf8')); console.log('manifest ok')"
```
