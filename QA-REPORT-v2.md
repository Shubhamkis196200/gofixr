# GoFixr.com — QA Report v2

**Date:** February 10, 2026  
**Reviewer:** Automated QA Critic  
**Overall Score: 5.6 / 10**

---

## Category Scores

| Category | Score | Notes |
|---|---|---|
| HTML Quality | 5/10 | Two competing design systems still coexist (46 white-nav, 51 blue-nav); 15 pages have JS syntax errors |
| JavaScript Tools | 5/10 | 9 external JS files rewritten well, but HTML pages don't load them (0 references); 15 pages still have `includeLab or` bug |
| Design/UX | 5/10 | Two completely different nav/footer designs still present; no consolidation done |
| SEO | 6/10 | robots.txt fixed; sitemap has 59 URLs (better but still incomplete); 17 duplicate page pairs cause cannibalization |
| Content Quality | 5/10 | Toilet troubleshooter still has "What Affects the Cost?" and labor boilerplate; guides remain good |
| Navigation | 5/10 | Footer still has 4+ `href="#"` links; privacy/terms/contact created in wrong directory (root, not `site/`) so not deployed |
| Tool Count | 6/10 | 96 HTML files but 17 duplicate pairs → ~79 unique URLs; however many share identical broken templates |

**Overall: 5.3 / 10**

---

## V1 → V2 Delta: What Actually Changed

### ✅ Improvements Confirmed
1. **robots.txt** — Fixed. No longer duplicated. Clean single block.
2. **9 external JS files rewritten** — `assets/js/tools/paint-calculator.js` etc. contain real, domain-specific calculators with proper formulas.
3. **404, contact, disclaimer pages created** — But in `/gofixr/` root, NOT in `/gofixr/site/` (the deploy directory). **These pages are not deployed.**

### ❌ Issues NOT Fixed
1. **Duplicate pages still exist** — All 17 pairs remain (e.g., `bathroom-remodel-cost.html` + `bathroom-remodel-cost-calculator.html`). None deleted.
2. **Broken JS (`includeLab or`)** — Still present in 15 white-nav pages. Zero fixes applied to HTML files.
3. **Two design systems** — 46 white-nav + 51 blue-nav pages still coexist. No consolidation.
4. **Generic boilerplate on diagnostic tools** — Toilet troubleshooter still says "What Affects the Cost?" and mentions labor costs.
5. **Footer `href="#"` links** — Still broken on blue-nav pages (privacy, terms, contact, social links all point to `#`).
6. **External JS never loaded** — The 9 rewritten JS files in `assets/js/tools/` are not referenced by any HTML page. All tool pages use inline `<script>` blocks. The rewrites are orphaned.
7. **Sitemap incomplete** — 59 URLs listed but 96+ tool pages + guides exist. New pages (contact, disclaimer) not in sitemap.

---

## TOP 5 Most Impactful Issues to Fix

### 1. 🔴 DELETE 17 DUPLICATE PAGE PAIRS (Critical — same as v1 #1)
The 17 white-nav `-calculator.html` duplicates must be removed. They have broken JS, different design, and cause SEO cannibalization. This single action fixes ~30% of all issues: removes 15 broken-JS pages, eliminates design inconsistency, and stops duplicate content penalties.

**Files to delete:** `bathroom-remodel-cost-calculator.html`, `concrete-patio-cost-calculator.html`, `deck-building-cost-calculator.html`, `diy-vs-hire-calculator.html`, `drywall-repair-cost-calculator.html`, `electrical-work-cost-calculator.html`, `fence-installation-cost-calculator.html`, `flooring-cost-calculator.html`, `garage-door-replacement-cost-calculator.html`, `home-value-impact-calculator.html`, `hvac-replacement-cost-calculator.html`, `kitchen-remodel-cost-calculator.html`, `painting-cost-calculator.html`, `plumbing-repair-cost-calculator.html`, `roof-replacement-cost-calculator.html`, `siding-installation-cost-calculator.html`, `window-replacement-cost-calculator.html`

### 2. 🔴 MOVE NEW PAGES INTO `site/` DIRECTORY (Critical — deployment broken)
`contact.html`, `disclaimer.html`, `privacy.html`, `terms.html`, `404.html` were created in `/gofixr/` root instead of `/gofixr/site/`. They are not being deployed. Move them and fix all footer `href="#"` links to point to these pages.

### 3. 🔴 INTEGRATE REWRITTEN JS INTO HTML PAGES (Critical — wasted work)
The 9 rewritten JS files (paint-calculator, btu-calculator, concrete-calculator, etc.) exist in `assets/js/tools/` but zero HTML pages reference them. Either: (a) add `<script src>` tags to the corresponding HTML pages, or (b) replace the inline `<script>` blocks with the new calculator code.

### 4. 🟡 FIX GENERIC BOILERPLATE ON NON-CALCULATOR TOOLS (High)
Toilet troubleshooter, HVAC troubleshooter, and other diagnostic tools still show cost-calculator boilerplate ("What Affects the Cost?", "labor costs", "demo work"). Each tool type needs appropriate educational content.

### 5. 🟡 UPDATE SITEMAP WITH ALL LEGITIMATE PAGES (Medium)
Sitemap has 59 URLs but site has 79+ unique pages plus guides. Add all non-duplicate tool pages, all 5 guide pages, and the new utility pages (contact, privacy, terms, disclaimer). Remove any references to deleted duplicates.

---

## Summary

**v2 scored 5.3/10 — essentially no improvement from v1 (5.4/10).** The improvement work was done but deployed incorrectly:
- New pages landed in the wrong directory
- Rewritten JS files are orphaned (not loaded by any HTML)
- The #1 recommendation (delete duplicates) was not executed

The fixes themselves are good quality — the rewritten JS calculators are professional and domain-specific. They just need to be wired up correctly. **One focused round of file operations (delete duplicates, move pages, integrate JS) would likely push this to 7+/10.**

---

*Report generated for improvement iteration v3 planning.*
