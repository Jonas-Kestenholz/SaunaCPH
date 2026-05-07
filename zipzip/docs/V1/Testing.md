# Testing Strategy

## Formål

Test i dette projekt fokuserer på de flows, der er mest forretningskritiske og teknisk risikable, fremfor fuld testdækning af alle komponenter.

---

## Testfokus i version 1

### 1. Shopify API integration
Dette er det vigtigste testområde.

Der skal testes:
- hentning af produktliste
- hentning af produktdetaljer
- variantvalg
- lagerstatus
- oprettelse og opdatering af cart
- fejlscenarier ved netværksfejl eller ugyldige svar

### 2. Login og checkout-flow
Da login er påkrævet for køb, skal følgende testes som samlet flow:
- browsing uden login
- forsøg på køb uden login
- redirect til login
- tilbagevenden til appen efter login
- fortsættelse til checkout
- gennemført køb

### 3. Push-notifikationer
Der skal testes:
- permission flow
- modtagelse af push på fysisk enhed
- åbning af app fra notifikation
- deep linking til relevant skærm
- forskel på transaktionelle notifikationer og broadcast-notifikationer

### 4. Kritiske brugerflows
- Åbn app → browse katalog → se produkt → vælg variant → tilføj til kurv
- Login → checkout → ordrebekræftelse
- Modtag push → åbn relevant visning

---

## Testformer

### Manuel test
Hovedparten af test udføres manuelt, da projektet har begrænset tid og fokus på et velfungerende MVP-flow.

### Integrationstest
Der bør laves målrettet test af service-laget mod Shopify, især omkring cart, login og produkthentning.

### Device test
Push-notifikationer og relevante native flows testes på fysiske enheder, da simulatorer og emulators ikke giver et retvisende billede af den samlede løsning.

---

## Hvad der ikke prioriteres højt i version 1
- Høj enhedstestdækning på alle UI-komponenter
- Omfattende end-to-end automatisering
- Test af funktioner der er udskudt til senere versioner

## Fravalg

- UI unit tests prioriteres ikke i version 1
- Fokus er på integration og kritiske flows

Begrundelse:
- Tidsbegrænsning
- Størst risiko ligger i API og checkout