## Dynamisk content (Metaobjects)

Appen bruger Shopify Metaobjects som CMS til homescreen.

### Eksempler

- home_slide
- monthly_drop_overlay

### Felter

home_slide:
- title
- image
- cta_label
- product_handle
- sort_order
- active

monthly_drop_overlay:
- title
- image
- drop_date
- active

### Fordele

- Content kan ændres uden app update
- Ingen ekstern CMS nødvendig

### Ulemper

- Kræver mapping i frontend
- Begrænset struktur sammenlignet med dedikeret CMS

## Product variants (udvidelse)

Produktvarianter henter nu selectedOptions fra Shopify:

- name
- value

Eksempel:
- Color: Black
- Size: M

Dette muliggør:

- korrekt variantvalg
- separation af color og size i UI

Mapping håndteres i frontend:
- color → ProductVariant.color
- size → ProductVariant.size