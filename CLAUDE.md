# CLAUDE.md

## Tech Stack
- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files should open directly in a browser.

## Project Structure
Keep things simple as it grows:
- `index.html` — the portal homepage, at the top level
- `tools/` — one page per tool (`tool-1.html` is a placeholder)
- `css/styles.css` — shared styles, including the light and dark theme colours
- `js/theme.js` — shared light/dark theme toggle, loaded on every page

Update this section whenever the structure changes.

## Key Requirements
1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Feature Plan
A web portal where students and learners try small Production Planning tools.

### Portal structure
- **Homepage (`index.html`):** short intro plus one card per tool. Each card links to its tool page.
- **Opening a tool:** the visitor clicks a card and lands on that tool's own page in `tools/`.
- **Getting back:** every tool page has a "Back to all tools" link at the top and a link in the header. Both go to the homepage.
- **Adding a tool later:** put a new page in `tools/`, its script in `js/`, and add one card to the homepage. Shared styles (`css/`) and the theme toggle are reused.

### Phases
1. **Phase 1: portal plus first tool.** The homepage and exactly one tool, the Capacity Planner. Inputs are machines, cycle time, shifts and hours per shift, and efficiency/downtime %. Outputs are units per day and per week, with a plain-language "How it works" explanation.
   - [x] Step 1: portal homepage with one placeholder card ("Tool 1 — coming soon") that opens and closes via the portal navigation. Done.
   - [ ] Step 2: replace the placeholder with the real Capacity Planner.
2. **Phase 2: more tools.** Add further Production Planning tools one at a time, using the steps above.
3. **Phase 3: polish.** Improve the learning side, for example worked examples and a glossary, based on what visitors need.

## Rules for Claude
- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
