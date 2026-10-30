# ProZone Armenia — website

New website for **ProZone Air Conditioning & Heating** (prozone.am): HVAC engineering, chiller specialists, 24/7 service in Yerevan.

A fast static site (plain HTML/CSS/JS, no build step) that replaces the old Ucraft site. Available in **Armenian, Russian and English**.

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Homepage (sections below) |
| `chillers.html` | Chiller types, 8 chiller services, the take-apart animation, service-visit checklist, warning signs, FAQ, chiller photos |
| `services.html` | Every system by category (cooling, heating, ventilation, controls) with a sticky category menu; each system has its own anchor (`#boilers`, `#ahu`…) and each category links to its own page |
| `cooling.html` | Cooling systems, the take-apart **chiller**, pre-summer checklist |
| `heating.html` | Heating systems, the take-apart **gas boiler**, pre-winter checklist |
| `ventilation.html` | Ventilation systems, the take-apart **air handling unit**, service checklist |
| `controls.html` | BMS and controls, the take-apart **BMS control cabinet**, service checklist |
| `projects.html` | All 11 project photos with filters and a lightbox |
| `contact.html` | Giant phone number, phone / WhatsApp / Viber / email cards, "have this ready when you call", call-back form |

Every inner page ends with a "talk to an engineer" call band and never shows prices.

## What's on the homepage

| Section | What it does |
|---|---|
| Header | Transparent ProZone logo on white, red/blue stripe, language switcher (ՀԱՅ / РУС / ENG), **always-visible call button** (+374 96 11 80 11) |
| Hero | "Summer or winter, always 22 °C." + interactive **set-point dial**: summer/winter toggle shows the outside temperature changing while the building stays at 22 °C (cooling = blue, heating = red, the two logo colors) |
| Brands | Marquee that speeds up as you scroll: Trane, Daikin, Carrier, York, Climaveneta, Aermec, Gree, General, Ferroli |
| Services | Cooling · Heating · Ventilation · Controls cards with a two-tone hover fill and 3D tilt; each opens its category page |
| Our work | Gallery of 11 real ProZone site photos, filters and a lightbox |
| For companies | Maintenance contracts, seasonal start-up, 24/7 emergency service, retrofits. **No prices on the site**: a "Pricing after a call" banner sends people to the phone |
| Industries | Kinetic type rows that move with scroll |
| Process | Call → site visit → price by phone → installation/repair → ongoing service |
| Contact | Giant click-to-call number, WhatsApp / Viber / Email, call-back form (opens the visitor's email app pre-filled) |
| Mobile | Sticky bottom bar: **Call 24/7** · WhatsApp · Email |

### Design
Everything is taken from the logo: the exact logo red (`#F4140C` / `#C10102`) and blue (`#0A2791` / `#091F71`), heavy italic capitals with the logo's **two-tone lettering** (lighter top half, darker bottom half), and the red slanted **banner** reused for labels, buttons and the pricing strip. Fonts: Exo 2 (display), Inter (text), Noto Sans Armenian (Armenian), IBM Plex Mono (labels).

### Languages
`assets/js/i18n.js` holds the Armenian and Russian text; English is the HTML itself. Language is picked from `?lang=hy|ru|en`, then the visitor's last choice, then the browser language. **Armenian and Russian copy should be proofread by a native speaker before launch.**

### Motion
GSAP 3.12.5 + ScrollTrigger from cdnjs. Everything still works without JavaScript (the machine is shown fully taken apart), and animations switch off for visitors who prefer reduced motion.

### Take-apart scenes
Each category page has a pinned scroll scene where an isometric machine, drawn in code, comes apart in five labelled steps: a chiller (Cooling and Chillers pages), a gas boiler (Heating), an air handling unit (Ventilation) and a BMS control cabinet (Controls). The page picks the machine with `data-machine` on the `.xp__svg` element; the drawings live in `assets/js/xp.js`.

## Run it locally

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173 (add `?lang=hy` or `?lang=ru`).

The header, footer and icon set are repeated in each page — when you change one, change it in all nine files.

## Structure

```
index.html            — the homepage (English text + data-i18n keys)
chillers.html, services.html, projects.html, contact.html — inner pages
cooling.html, heating.html, ventilation.html, controls.html — category pages
_redirects            — old prozone.am addresses → new pages (Netlify / Cloudflare Pages)
sitemap.xml, robots.txt
CHANGELOG.md          — what changed and when (update it with every change)
assets/css/style.css  — all styles (logo colours and tokens at the top)
assets/js/i18n.js     — Armenian + Russian translations (all pages)
assets/js/xp.js       — the isometric machines (chiller, boiler, AHU, BMS) and their take-apart animation
assets/js/main.js     — interactions + scroll motion
assets/img/           — logo (transparent), favicon, share image
assets/img/work/      — project photos (full size + "-sm" thumbnails)
assets/img/brands/    — partner brand logos
docs/research.md      — market research, old-site audit and plan
```

## Next steps

See [docs/research.md](docs/research.md): open questions for ProZone and the roadmap (separate language URLs for SEO, project case studies, real form backend, analytics, hosting).
