# Changelog

## 2026-10-30 — Category pages and copy edits

### New pages
- `cooling.html`, `heating.html`, `ventilation.html`, `controls.html`: one page per service category, each with a take-apart scroll scene (chiller, gas boiler, air handling unit, BMS control cabinet), its systems and a service checklist. All three languages.
- `assets/js/xp.js` replaces `assets/js/chiller.js` and draws all four machines; a page picks one with `data-machine` on `.xp__svg`.
- Footer links, the homepage service cards and `services.html` category headers now open the category pages. Added to `sitemap.xml`; old prozone.am addresses in `_redirects` now point to them.

### Homepage copy
- Hero headline changed from "We hold the set point." to:
  - EN: **Summer or winter, always 22 °C.**
  - HY: **Ամառ թե ձմեռ՝ միշտ 22 °C։**
  - RU: **Летом и зимой — всегда 22 °C.**
- Removed the "What we do" intro paragraph ("One accountable contractor…") — key `svc.lead`.
- Removed the "Planning a similar project? Ask us for a reference site" line under the projects gallery — keys `work.more`, `work.moreLink` and the `.work__more` styles.
- Removed the "For companies" intro paragraph ("The most expensive chiller repair is the one in mid-July…") — key `biz.lead`.
- The pinned chiller scene moved off the homepage onto the Cooling and Chillers pages.

### Other copy
- Dropped "across Armenia" / "serving all of Armenia" from page descriptions, the footer and the contact details.
- Chillers page: the take-apart section is now titled "A chiller, part by part."
- Long Armenian card titles (e.g. "Օդափոխություն") shrink to fit their card instead of breaking.

## 2026-10 — Inner pages
- Added `chillers.html`, `services.html`, `projects.html`, `contact.html`.

## 2026-10 — Initial site
- Logo-based design, homepage with set-point dial and chiller animation, Armenian / Russian / English.
