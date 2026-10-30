# Changelog

## 2026-10-30 — Copy review: no prices, no report promises

### Homepage copy
- Hero paragraph under the headline replaced: the Yerevan −15 / +40 °C text repeated the headline. New text (key `hero.lead`):
  - EN: Chillers, boilers, ventilation and BMS — installed, serviced and repaired by one team. 15+ years of experience and every major brand.
  - HY: Չիլերներ, կաթսաներ, օդափոխություն և BMS՝ տեղադրում, սպասարկում և վերանորոգում մեկ թիմի կողմից։ 15+ տարվա փորձ և բոլոր առաջատար բրենդները։
  - RU: Чиллеры, котлы, вентиляция и BMS — монтаж, обслуживание и ремонт одной командой. Более 15 лет опыта и все ведущие бренды.
- "What we do" section title changed from "Everything that cools, heats and moves air." (key `svc.title`):
  - EN: Everything from chillers to BMS.
  - HY: Ամեն ինչ՝ չիլերից մինչեվ BMS։ (written "եվ", not "և": the title is uppercase and "և" would show as "ԵՒ")
  - RU: Всё — от чиллера до BMS.
- Ventilation card text changed from "Clean, balanced air for the people and processes inside." (key `svc.air.p`):
  - EN: Ventilation that meets every standard.
  - HY: Օդափոխություն՝ բոլոր նորմերին համապատասխան։
  - RU: Вентиляция по всем нормам.
- Removed "Exhaust & fresh-air systems" from the Ventilation card list (key `svc.air.3`).
- "For companies" first card: title "Maintenance contracts" and its text replaced (keys `b1.t`, `b1.p`):
  - EN: Planned maintenance — We keep track of when your equipment needs service and show up on time.
  - HY: Պլանային սպասարկում — Մենք ինքներս ենք հետևում սպասարկման ժամկետներին և գալիս ենք ժամանակին։
  - RU: Плановое обслуживание — Мы сами следим за сроками обслуживания и приезжаем вовремя.
- "Seasonal start-up" card: removed "with a written report" (key `b2.p`); HY also fixed "ջեռուցմանը" → "ջեռուցման".
- Removed the "Retrofits & upgrades" card from "For companies" (keys `b4.t`, `b4.p`); the remaining three cards sit in one row of three (one column below 760px).
- Red call banner under "For companies": no longer talks about price (keys `biz.priceT`, `biz.priceP`; the call button is unchanged):
  - EN: Get in touch — Tell us about your building and we’ll suggest the right solution.
  - HY: Կապվեք մեզ հետ — Պատմեք ձեր շենքի մասին, և մենք կառաջարկենք ճիշտ լուծումը։
  - RU: Свяжитесь с нами — Расскажите о вашем здании, и мы предложим правильное решение.
- "Why ProZone" first point: "All brands, one contract" → "Any brand" (keys `w1.t`, `w1.p`):
  - EN: Any brand — Trane, Daikin, Carrier, York, Gree and more — we work with every make.
  - HY: Ցանկացած բրենդ — Trane, Daikin, Carrier, York, Gree և այլն․ աշխատում ենք բոլոր մակնիշների հետ։
  - RU: Любой бренд — Trane, Daikin, Carrier, York, Gree и другие — работаем со всеми марками.
- "Why ProZone" third point: "Documented work" (readings, photos and recommendations after every visit) replaced with "Tailored approach", building icon instead of document (keys `w3.t`, `w3.p`):
  - EN: Tailored approach — Every building gets its own solution.
  - HY: Անհատական մոտեցում — Յուրաքանչյուր շենքի համար՝ իր լուծումը։
  - RU: Индивидуальный подход — Для каждого здания — своё решение.

### Other pages
- Armenian take-apart scene intros (keys `ch.lead`, `bo.lead`, `ah.lead`, `bm.lead`): "Ոլորեք ներքև" → "Թերթեք ներքև". In the chiller and air handling unit intros, "ապամոնտաժելու" → "քանդելու". The four screen-reader descriptions of the scenes (keys `ch.svg`, `bo.svg`, `ah.svg`, `bm.svg`): "ապամոնտաժված" → "քանդված". The word "ապամոնտաժ…" is no longer used anywhere.
- Removed the "what we check" checklist section (heading, intro, photo and list) from all five pages that had one: Chillers, Cooling, Heating, Ventilation and Controls. Their translations (`cp.chk.*`, `cp.c*`, `pc.*`, `ph.*`, `pv.*`, `pb.*` checklist keys) and the checklist styles are removed too.

### Report promises removed everywhere
The site no longer promises written reports, readings or photos after visits (the checklists that also promised them are removed above).
- Chillers page FAQ: removed "Will we get a report after the visit?" (keys `cp.q6`, `cp.a6`) and its structured-data entry.

### Price removed everywhere
The site no longer talks about price; it asks people to get in touch instead.
- Call band at the bottom of the inner pages (key `ctab.p`): "Describe your system or the problem, and we’ll suggest the right solution." / «Պատմեք ձեր համակարգի կամ խնդրի մասին, և մենք կառաջարկենք ճիշտ լուծումը։» / «Опишите систему или проблему, и мы предложим правильное решение.»
- Homepage process step 03 (keys `s3.t`, `s3.p`): "Price by phone" → "A clear plan" / «Հստակ պլան» / «Понятный план», agreeing the plan instead of the price before work starts.
- Call-back form on Home and Contact (key `f.sub`): no longer mentions discussing the price.
- Contact page intro (key `cx.lead`): removed "Prices are agreed by phone."
- Chillers page FAQ: removed "How much does chiller service cost?" (keys `cp.q4`, `cp.a4`) and its structured-data entry.

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
