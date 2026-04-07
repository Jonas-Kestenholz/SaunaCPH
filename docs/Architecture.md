# Architecture

## Overordnet arkitektur

Systemet er designet som en frontend-drevet mobilapplikation, hvor størstedelen af backend-logik håndteres af Shopify.

### Komponenter

* **Mobil app (React Native / Expo)**

  * UI
  * Navigation
  * API kald
  * Push notifikationer

* **Shopify**

  * Produktdata
  * Cart
  * Kunde-login
  * Lagerstatus

* **Eksterne services (mulige)**

  * Push notifications (Expo)
  * CMS (Shopify / Firestore)

---

## Arkitekturprincipper

* Minimal custom backend
* Brug af eksisterende platforme (Shopify)
* Fokus på vedligeholdelse og enkelhed
* Dynamisk indhold uden app release

---

## Dataflow

1. App henter produktdata via Shopify API
2. Bruger interagerer (tilføjer til cart, login)
3. Shopify håndterer state
4. App viser opdateret data

---

## Fordele

* Lav kompleksitet
* Hurtigere udvikling
* Nemmere drift

---

## Ulemper

* Afhængighed af Shopify
* Begrænset fleksibilitet
