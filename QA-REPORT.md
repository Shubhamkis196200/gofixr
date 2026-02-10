# GoFixr.com — QA Report

**QA Date:** February 10, 2026  
**Reviewed By:** QA Agent  
**Site Directory:** /home/ubuntu/.openclaw/workspace/website-farm/gofixr/

---

## Scores

| Category | Score (1-10) | Notes |
|---|---|---|
| **Content Quality** | 4 | Tools are heavily templated; diagnostic tools have nonsensical generic content |
| **Design** | 7 | Clean, professional look with good brand colors; CSS is solid |
| **SEO** | 4 | Meta tags present but no structured data, no canonical, no sitemap, no robots.txt |
| **Functionality** | 5 | Calculators work but many produce generic/wrong outputs; mobile menu broken |
| **Overall** | 5 | Good skeleton, but too many template/placeholder issues to ship as-is |

---

## Critical Issues (Must Fix)

### 1. Double Dollar Signs in Cost Calculators
**File:** `assets/js/tools/bathroom-remodel-cost.js` (and likely all cost calculator JS files)  
**Problem:** Template literals use `$$${variable}` which renders as `$$1,500` instead of `$1,500`.  
**Fix:** Change all `$$${` to `$${` in display strings across all 15 cost calculator JS files.

### 2. Diagnostic Tools Have Generic/Nonsensical Content
**File:** `assets/js/tools/toilet-troubleshooter.js` (and all 10 diagnostic JS files)  
**Problem:** The toilet troubleshooter suggests "Check power supply", "Test circuit breaker", "Inspect bearings" — these are clearly copy-paste template solutions, not toilet-specific. The solutions object uses the same generic checks across all symptoms.  
**Fix:** Write tool-specific diagnostic content. For toilet: running = check flapper valve/fill valve; leaking = check wax ring/supply line; clogged = plunger/auger steps, etc.

### 3. Planning Tools Are Generic Templates
**File:** `assets/js/tools/paint-calculator.js` (and similar)  
**Problem:** Paint calculator asks for "Length", "Width", "Waste Factor" — this is a generic area calculator, not a paint calculator. Should ask for wall height, number of coats, paint coverage rate (sq ft/gallon), number of doors/windows to subtract.  
**Fix:** Each of the 15 planning tools needs tool-specific inputs and calculations, not the same length × width × waste formula.

### 4. Broken Footer Links on Tool Pages
**Files:** All 50 tool HTML files in `tools/`  
**Problem:** Footer links to `../contact.html` and `../disclaimer.html` — neither file exists.  
**Fix:** Either create these pages or update footer links to point to existing pages (about.html, terms.html).

### 5. Mobile Menu Button Shows alert()
**File:** `index.html` (line ~350)  
**Problem:** `alert('Mobile menu - implement dropdown')` — this is a placeholder, not a functioning mobile menu.  
**Fix:** Implement an actual mobile dropdown menu that toggles nav links visibility.

---

## Major Issues (Should Fix)

### 6. No Structured Data (JSON-LD)
**Problem:** Zero structured data on any page. No FAQ schema, no HowTo schema, no WebApplication schema for tools. This is a significant SEO miss for a tool-based site.  
**Fix:** Add JSON-LD structured data to every page. At minimum: `WebSite` on homepage, `WebApplication` or `SoftwareApplication` on tool pages, `FAQPage` where applicable.

### 7. No Canonical Tags
**Problem:** No `<link rel="canonical">` on any page. Risk of duplicate content issues.  
**Fix:** Add canonical tags to all 55 pages.

### 8. No sitemap.xml or robots.txt
**Problem:** Neither file exists. Essential for search engine crawling.  
**Fix:** Generate sitemap.xml listing all 55 pages and create robots.txt allowing all crawlers.

### 9. No Favicon
**Problem:** No favicon file exists. Browser tabs show generic icon.  
**Fix:** Create a favicon (orange wrench or "GF" logo mark) in multiple sizes.

### 10. Logo Inconsistency Between Pages
**Problem:** Homepage shows `<span class="brand-orange">Go</span><span class="text-white">Fixr</span>` (two-tone). Tool pages show `<a class="brand-orange">GoFixr</a>` (all orange).  
**Fix:** Standardize the logo markup across all pages to match the two-tone homepage version.

### 11. Educational Content Is Thin and Generic
**Problem:** Every tool has the same ~100 words of generic "Understanding Project Costs" or "Material Planning Guide" content. The research called for 1,000+ words of educational content per tool.  
**Fix:** Write unique, detailed educational content for each tool (cost factors, regional variations, material comparisons, when to hire a pro, etc.).

---

## Minor Issues (Nice to Fix)

### 12. Duplicate Site Structure
**Problem:** There's both a root-level static site AND an Astro project in `site/` with 64 HTML files (different filenames). Unclear which is canonical.  
**Fix:** Remove the `site/` directory or clarify which build is authoritative.

### 13. No `alt` Text for Images
**Problem:** Emoji placeholders are used instead of real images. When images are added, ensure proper alt text.

### 14. Tailwind CSS v2.2.19 via CDN
**Problem:** Using an old version of Tailwind via CDN. This is fine for now but may cause issues if newer utility classes are needed.  
**Fix:** Consider upgrading to Tailwind v3+ CDN or using the CLI build.

### 15. No `noopener noreferrer` on External Links
**Problem:** External links (if any are added) should have these attributes for security.

### 16. category-filter Buttons Have No CSS in style.css
**Problem:** The filter button styles are in an inline `<style>` block at the bottom of index.html instead of in style.css.  
**Fix:** Move to style.css for consistency.

### 17. Related Tools Always Shows First 3 of Same Category
**Problem:** `loadRelatedTools('cost')` just takes the first 3 tools of the same category. For bathroom-remodel-cost, it always shows itself as a related tool.  
**Fix:** Filter out the current tool and ideally use smarter relevance matching.

---

## Summary

The site has a **solid design foundation** — the brand colors, layout, CSS, and overall structure are professional and well-thought-out. The homepage is compelling with good hero copy, search, and filtering.

However, the **content and functionality are critically undermined by heavy templating**. The diagnostic tools give nonsensical advice (telling users to "check the power supply" on a toilet), the planning calculators all use the same generic length × width formula regardless of tool type, and the educational content is repetitive boilerplate. The double-dollar-sign bug in cost displays is a visible quality issue.

**Recommended priority:**
1. Fix the `$$` display bug (quick win)
2. Fix broken links (contact.html, disclaimer.html)
3. Implement real mobile menu
4. Rewrite all 10 diagnostic tool JS files with tool-specific content
5. Rewrite all 15 planning tool JS files with tool-specific calculations
6. Add structured data, canonical tags, sitemap.xml, robots.txt
7. Expand educational content per tool

**The site is NOT production-ready as-is.** It needs content/functionality fixes before deployment.
