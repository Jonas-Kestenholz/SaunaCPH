# Architecture (V2)

## Ændringer siden V1

Arkitekturen er udvidet med et content layer via Shopify Metaobjects.

---

## Content layer

Shopify anvendes nu både til:

- Commerce (produkter, checkout)
- Content (homescreen via metaobjects)

---

## Nye komponenter

- home_slide (metaobject)
- monthly_drop_overlay (metaobject)

---

## Data flow (udvidet)

Shopify → Metaobjects → Mapper → Hooks → UI

---

## Designvalg

- Ingen separat CMS
- Shopify er single source of truth
- Mapping håndteres i frontend

---

## Konsekvenser

Fordele:
- Mindre backend kompleksitet
- Lettere vedligeholdelse

Ulemper:
- Frontend bliver mere kompleks
- Begrænset CMS fleksibilitet

## UI layer (udvidelse)

Homescreen og produktside er udvidet med:

- Gesture handling (swipe navigation)
- Sticky UI elements (CTA + bottom bar)
- Conditional rendering baseret på scroll position

---

## Variant data flow

Shopify → Variants → selectedOptions → Mapper → UI

Dette gør det muligt at:

- vise color og size separat
- styre variantvalg korrekt