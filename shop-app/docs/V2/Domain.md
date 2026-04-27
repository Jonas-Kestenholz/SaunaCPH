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

---

## Relation til eksisterende domæner

- HomeSlide → Product (via productHandle)
- Overlay → Product (valgfrit)

---

## Bemærkninger

- Domænerne er content-drevne
- Data kommer fra Shopify Metaobjects
- Mapping sker i frontend