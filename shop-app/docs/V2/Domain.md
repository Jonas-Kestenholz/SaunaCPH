# Domain Model (V2)

## Nye domæner

---

┌──────────────────────┐
│     HomeSlide        │
├──────────────────────┤
│ id                   │
│ title                │
│ imageUrl             │
│ ctaLabel             │
│ productHandle        │
│ sortOrder            │
│ active               │
└──────────────────────┘


┌──────────────────────┐
│ MonthlyDropOverlay   │
├──────────────────────┤
│ id                   │
│ title                │
│ imageUrl             │
│ dropDate             │
│ active               │
│ ctaLabel?            │
│ productHandle?       │
└──────────────────────┘

┌──────────────────────┐
│   ProductVariant     │
├──────────────────────┤
│ id                   │
│ title                │
│ price                │
│ available            │
│ color?               │
│ size?                │
└──────────────────────┘

---

## Relation til eksisterende domæner

- HomeSlide → Product (via productHandle)
- Overlay → Product (valgfrit)

---

## Bemærkninger

- Domænerne er content-drevne
- Data kommer fra Shopify Metaobjects
- Mapping sker i frontend

## Bemærkninger (tilføj)

- color og size udledes fra Shopify selectedOptions
- variant title bruges ikke længere som primær datakilde