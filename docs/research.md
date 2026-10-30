# ProZone website — research, audit & plan

_October 2026 · first-pass research for the new prozone.am_

## 1. What ProZone is (from the old site + brief)

- **ProZone Armenia** — Air Conditioning & Heating, Yerevan. 15+ years in the market.
- Phone **+374 96 11 80 11** · **info@prozone.am** · 24/7.
- Services on the old site:
  - **Cooling:** chillers, rooftop package units, ducted ACs, ductless split ACs
  - **Heating:** boilers, heat pumps, gas furnaces
  - **Other:** BMS, air handling units (AHU), fan coils, exhaust fans
  - **Chiller service:** installations, inspection & repair, retrofits, water treatment, oil & refrigerant analysis and change, customized preventive maintenance, chiller cleaning. Types: centrifugal, air-cooled, water-cooled, rotary screw.
- **Brands on the old partner slider:** Trane, Daikin, Carrier, York, Climaveneta, Aermec, Gree, General (Fujitsu General), Ferroli.
- **Gallery:** 12 photos of real sites (Carrier AquaForce chillers, AHUs, VFD/BMS cabinets, chilled-water piping). One file was a duplicate → 11 unique photos.

## 2. Armenian competitor scan

| Company | Positioning | What their site does well | Gaps we can beat |
|---|---|---|---|
| **Consel** (since 2001) — consel.am | Distributor (Mitsubishi Electric, Carrier, Toshiba…) + installer | Big named portfolio (Government complex, Dilijan International School, Ameriabank), ~20 brand logos, 3 languages | Abstract hero ("Perfection as a cornerstone"), phone numbers not clickable, no WhatsApp/Viber, no quote form, copyright 2015, portfolio = names + photos only |
| **HVAC Group** — hvacgroup.am | Design + install, "official partner" of Carrier, Toshiba, Mitsubishi, TROX, VTS… | Clear service menu, named bank clients (Evoca, Mellat, Ameria) | No phone visible on the homepage, no stats, placeholder links (`#`), generic "Why us" |
| **Ventservice** (since 2019) — ventservice.am | Importer / distributor (Galletti, Carrier, Mitsubishi…) | Clean layout, client list, founder shown | No lead form, phone as plain text, empty social links, Gmail address |
| **Termoros Armenia** (since 2020) | Engineering solutions, part of the Russian Termoros group | Group backing | No public portfolio found |
| Others in the "chillers" category on Spyur | Climapro, Clima Control, Euroterm, Artclima, Kanayan & Co, Clima Lux… | — | Mostly directory listings; little web presence |

**Key insight:** almost every competitor is a **distributor with a product catalogue**. Nobody owns the position *"the service & chiller specialists who keep your plant running, whatever brand it is."* That is ProZone's opening: brand-agnostic, service-first, 24/7, for companies.

**Common mistakes on competitor sites (we avoid all of them):**
1. Phone numbers not clickable / not visible on mobile.
2. No WhatsApp or Viber, even though most Armenians use them.
3. Portfolios are name walls without photos, scope or results.
4. No numbers (years, projects, response time).
5. No quote / request form.
6. Broken or placeholder links, outdated copyright years.

## 3. Audit of the old prozone.am

| Problem | Why it matters |
|---|---|
| Phone only in the footer; header is just a burger menu | The phone is the #1 conversion — it must be one tap away everywhere |
| `format-detection telephone=no` meta | Turns off automatic phone-number linking on iPhones |
| Google Analytics **UA-145083411-1** | Universal Analytics stopped processing data in July 2023 → **the site has had no analytics since then** |
| Facebook / Twitter icons link to facebook.com and twitter.com, not ProZone pages | Looks unfinished, loses trust |
| "Learn More" buttons are `javascript:void(0)` | Dead buttons |
| Gallery has no captions; alt text = file names | No proof of what was done, poor SEO |
| Partner logos hidden inside auto-fading sliders | Visitors barely see the brands |
| "Best customer reviews" claim with no reviews; typos ("We are there were is convenient") | Hurts credibility |
| No address, empty map, contact form without fields | Hard to reach, no local SEO |
| `user-scalable=0` | Blocks zoom — an accessibility problem |
| "Copyright 2021", "Created by Ucraft Shop" | Looks abandoned |
| No structured data for the business | Google can't show hours, phone, area served |
| Stock photos (Shutterstock) in hero | Real site photos are far more convincing |

## 4. Positioning & what ProZone can offer companies

**Message:** *We hold the set point.* — outside, Yerevan swings from −15 °C to +40 °C; inside a ProZone-maintained building it doesn't.

**Audience:** facility managers and owners of business centers, hotels, hospitals, malls, production sites, server rooms, residential complexes.

**Services shown to companies** (no tiers, no prices):
1. **Maintenance contracts** — scheduled visits for chillers, AHUs, boilers and controls.
2. **Seasonal start-up** — spring cooling start-up + autumn heating start-up, written report.
3. **24/7 emergency service.**
4. **Retrofits & upgrades** — controls, drives, components (e.g. ageing R-22 equipment), BMS upgrades.

**Pricing policy (ProZone decision, 30 Oct 2026):** no prices or price tiers on the website. Prices are given **after a call**. The site says so ("Pricing after a call") and every call-to-action leads to the phone.

## 5. Proposed site map

1. **Home** (this concept)
2. **Chillers** — deep page: types, services, brands, FAQ
3. **Services** — Cooling / Heating / Ventilation / Controls (one page each, for SEO)
4. **Projects** — case studies: client/sector, location, equipment, capacity, year, photos
5. **For companies** — service plans + request form
6. **About** — team, certifications, 15+ years story
7. **Contact** — phone, WhatsApp, Viber, email, address + map
8. Languages: **Armenian (main), Russian, English**

## 6. Open questions for ProZone

1. Exact founding year (for "since 20XX").
2. Which of the 9 brands are official partnerships/certifications vs. "brands we service"?
3. Real project list: client names you're allowed to show, locations, equipment, capacity, year.
4. Is +374 96 11 80 11 on **WhatsApp and Viber**? Any second number or Telegram?
5. Office address (for the map and Google Business Profile).
6. Real numbers: projects completed, chillers serviced, team size, typical emergency response time.
7. Are the four services shown for companies right (maintenance contracts, seasonal start-up, 24/7 emergency, retrofits)?
8. Real Facebook / Instagram / LinkedIn pages.
9. Hosting & domain access (prozone.am is on Ucraft today).
10. Where should form requests go (email only, or also Telegram/WhatsApp)?

## 7. Roadmap

1. ✅ Homepage concept (this repo)
2. ✅ Design rebuilt around the logo (colours, two-tone italic lettering, red banner); transparent logo
3. ✅ Armenian + Russian versions (client-side switcher) — **needs native proofreading**
4. ✅ Scroll animation: chiller taken apart part by part
5. Feedback round on the design direction
6. Separate URLs per language (/hy/, /ru/) pre-rendered for SEO, with hreflang
7. Vector (SVG) version of the logo from the original designer, if one exists
8. Inner pages (Chillers, Services, Projects, Contact)
9. Real form backend (e.g. Formspree or a small serverless function) + spam protection
10. Google Analytics 4 / Search Console, Google Business Profile, schema markup per page
11. Hosting (Netlify / Vercel / Cloudflare Pages) and DNS switch from Ucraft

## Sources

- [prozone.am](https://www.prozone.am) — Home, Chillers, Gallery, Contacts pages
- [Spyur — HVAC Group](https://www.spyur.am/en/companies/hvac-group/43310) · [hvacgroup.am](https://www.hvacgroup.am)
- [Spyur — Ventservice](https://www.spyur.am/en/companies/ventservice/44609) · [ventservice.am](https://ventservice.am)
- [consel.am](https://www.consel.am) · [Consel on CB Insights](https://www.cbinsights.com/company/consel) · [Consel on staff.am](https://staff.am/company/consel-llc)
- [Termoros Armenia on staff.am](https://staff.am/company/termoros-armenia) · [Spyur — Termoros Armenia](https://www.spyur.am/en/companies/termoros-armenia---engineering-solutions/46766)
- [Spyur — Chillers (trade) category](https://www.spyur.am/en/business_directory/bd/7044/)
