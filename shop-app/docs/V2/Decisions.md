# Decisions (V2)

## 2026-04-XX – Shopify Metaobjects som CMS

**Beslutning:**
Shopify Metaobjects anvendes som CMS til homescreen content.

**Begrundelse:**
- Undgår ekstern CMS (Firestore)
- Samler content og commerce ét sted
- Lettere for kunden at vedligeholde

**Alternativer:**
- Firestore (fravalgt)
- Headless CMS (fravalgt)

**Konsekvenser:**
- Frontend håndterer mapping
- Begrænset fleksibilitet ift. CMS

---

## 2026-04-XX – Home navigation via scroll

**Beslutning:**
Produktlisten integreres i homescreen via vertikal scroll.

**Begrundelse:**
- Giver mere naturlig brugeroplevelse
- Matcher design/mocks
- Undgår unaturlige navigation transitions

**Alternativer:**
- Separat products screen (fravalgt)

**Konsekvenser:**
- Home screen får flere ansvar
- Scroll og gesture håndtering kræves

## 2026-04-XX – Variant valg via selectedOptions

**Beslutning:**
Variantvalg baseres på Shopify selectedOptions (color + size).

**Begrundelse:**
- Billeder er ikke en stabil source of truth
- Shopify variants er canonical data

**Konsekvenser:**
- Mapper skal udvides
- UI skal håndtere color/size separat

## 2026-04-XX – Conditional bottom bar

**Beslutning:**
Bottom bar vises kun når produktlisten er aktiv.

**Begrundelse:**
- Undgår visuel støj i hero section
- Matcher design

**Konsekvenser:**
- Scroll position styrer UI
- Kræver state i HomeScreen