# Home Flow (V2)

## Formål

Beskrive hvordan homescreen fungerer som entry point til appen.

---

## Struktur

Homescreen består af to sektioner:

1. Hero section
2. Product section

---

## Hero section

Hero section kan være i to modes:

### 1. Slides mode

- Op til 5 slides
- Styret via Shopify metaobjects
- Sorteres via sort_order
- Kun active = true vises

---

### 2. Drop mode (overlay)

Aktiveres når:

- active = true
- drop_date er indenfor defineret tidsvindue

Når aktiv:

- Slides skjules
- Overlay vises
- Countdown vises

---

## Navigation

- Swipe left/right → skift slide
- Swipe up → scroll til produkter
- CTA → navigér til produkt

---

## Data source

Shopify Metaobjects:

- home_slide
- monthly_drop_overlay

---

## Designvalg

- Scroll i stedet for navigation
- Hero + produktliste i samme screen

---

## Trade-offs

Fordele:
- Mere flydende UX
- Mindre navigation

Ulemper:
- Mere kompleks home screen
- Flere concerns i én screen

- Sticky CTA (pil op) vises når produktlisten er aktiv
- Bottom bar vises kun når produktlisten fylder skærmen