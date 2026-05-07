# Analysis (V2)

## Formål

Denne version dokumenterer ændringer og udvidelser siden V1.

---

## Overordnet ændring

Projektet er udvidet fra en simpel produktkatalog-app til en content-drevet commerce app.

---

## Nye funktioner

- Dynamisk homescreen
- Hero slides (op til 5)
- CTA koblet til produkter
- Monthly drop overlay med countdown
- Tidsstyret content (active + drop_date)

---

## Begrundelse

- Stakeholder ønskede større kontrol over visuelt content
- Understøtter kampagner og månedlige drops
- Giver mulighed for ændringer uden app release

---

## Teknisk ændring

- Shopify anvendes nu også som CMS via Metaobjects
- Ingen ekstern CMS løsning (fx Firestore)
- Frontend håndterer mapping og logik

---

## Konsekvenser

- Øget kompleksitet i frontend
- Introduktion af tidsbaseret UI-logik
- Større ansvar i homescreen

## Nye UI/UX forbedringer

- Vertikal swipe navigation fra hero til produktliste
- Sticky CTA (scroll-to-top) på produktlisten
- Conditional bottom bar (vises kun når produktlisten er aktiv)
- Produktside opdateret til full-screen billeder

## Variant system (udvidelse)

- Produktvarianter udvidet med color og size via Shopify selectedOptions
- Grundlag for korrekt variantvalg (ikke længere baseret på billeder)