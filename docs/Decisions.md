# Decisions Log

Dette dokument indeholder løbende tekniske og arkitektoniske beslutninger truffet under projektet.

---

## 2026-04-07 – Projektopstart

**Beslutning:**
Projektet baseres på en eksisterende kodebase.

**Begrundelse:**

* Reducerer udviklingstid
* Muliggør hurtigere iteration
* Giver fokus på forretningslogik fremfor opsætning

**Konsekvenser:**

* Kræver analyse af eksisterende struktur
* Mulig refaktorering nødvendig

---

## 2026-04-07 – Valg af teknologi (Frontend)

**Beslutning:**
Appen udvikles i React Native med Expo.

**Begrundelse:**

* Cross-platform (iOS + Android)
* Expo gør builds og deployment lettere
* Understøtter hurtig iteration

**Alternativer:**

* Native iOS (fravalgt pga. tid og kompleksitet)
* Flutter (fravalgt pga. eksisterende kodebase)

---

## 2026-04-07 – Backend strategi

**Beslutning:**
Shopify anvendes som primær backend.

**Begrundelse:**

* Produktdata, cart og login håndteres allerede
* Reducerer behov for custom backend
* Gør løsningen lettere at vedligeholde

---

## 2026-04-07 – DevOps strategi

**Beslutning:**
Projektet startes i GitHub og migreres senere til Azure DevOps.

**Begrundelse:**

* Hurtig opstart
* Azure DevOps vælges til fremtidig drift og CI/CD
* Understøtter overdragelse til andre udviklere

---

## 2026-04-07 – Fokus på overdragelse

**Beslutning:**
Projektet struktureres med fokus på fremtidig overdragelse.

**Begrundelse:**

* Projektet forventes at blive videreført af andre
* Kræver tydelig dokumentation og struktur
* Reducerer afhængighed af original udvikler

## 2026-04-07 – Wishlist og “Notify me” funktion

**Beslutning:**
Der implementeres en wishlist-lignende funktionalitet, hvor brugere kan markere produkter og modtage en push-notifikation, når et produkt kommer tilbage på lager.

**Begrundelse:**

* Øger brugerengagement og fastholdelse
* Understøtter brugsscenarier hvor produkter er midlertidigt udsolgt
* Giver en direkte kobling mellem lagerstatus og push-notifikationer
* Skaber værdi uden at kræve fuld wishlist/favoritsystem i første version

**Implementeringsstrategi (V1):**

* Brugeren kan tilføje et produkt til en “notify me”-liste
* Funktionaliteten er primært knyttet til lagerstatus (ikke generel favoritliste)
* Når lagerstatus ændres til “på lager”, sendes en push-notifikation til relevante brugere

**Tekniske overvejelser:**

* Kræver mapping mellem bruger og produkt (lokalt eller via ekstern service)
* Kræver håndtering af push tokens
* Kræver trigger når lagerstatus ændres i Shopify
* Kan implementeres simpelt i V1 og udvides senere

**Afgrænsning (V1):**

* Ingen fuld favoritliste med UI-overblik
* Ingen personaliserede anbefalinger
* Fokus er kun på “notify when back in stock”

**Fremtidige udvidelser:**

* Udvidelse til egentlig wishlist/favoritliste
* Visning af gemte produkter i appen
* Personlige anbefalinger baseret på wishlist
* Integration med kampagner og marketing

---

## 2026-04-07 – Push-notifikationer opdelt i typer

**Beslutning:**
Push-notifikationer opdeles i to hovedtyper: transaktionelle og lager-/produktrelaterede notifikationer.

**Begrundelse:**

* Giver klar struktur i implementeringen
* Understøtter både køb/ordre-flow og engagement
* Gør det lettere at teste og dokumentere

**Typer:**

1. **Transaktionelle notifikationer**

   * Ordrebekræftelse
   * Afsendt
   * Klar til afhentning
   * Leveret

2. **Produkt-/lager-notifikationer**

   * “Back in stock” for wishlist/notify me
   * Generelle lagerændringer (broadcast)

**Tekniske overvejelser:**

* Deep linking fra notifikation til relevant skærm
* Forskellige payloads afhængigt af type
* Håndtering af permissions på iOS og Android

---

## 2026-04-07 – Ingen CMS/dynamisk content i version 1

**Beslutning:**
CMS og dynamisk content management udskydes til senere version.

**Begrundelse:**

* Reducerer kompleksitet i første release
* Fokus på kernefunktionalitet (køb og produktvisning)
* CMS giver først reel værdi i forbindelse med community og content

---

## 2026-04-07 – Ingen homescreen i version 1

**Beslutning:**
Appen starter direkte i produktkataloget.

**Begrundelse:**

* Reducerer unødvendig navigation
* Matcher brugerens primære mål (browse produkter)
* Fjerner behov for content management i første version

---

## 2026-04-07 – Login kræves for køb

**Beslutning:**
Login er ikke påkrævet for browsing, men er obligatorisk for checkout.

**Begrundelse:**

* Gør det nemt at komme i gang for brugeren
* Sikrer at køb er knyttet til en kunde
* Muliggør ordreopfølgning og push-notifikationer

---

## 2026-04-07 – Checkout strategi

**Beslutning:**
Checkout skal gennemføres via Shopify i appen (ikke via almindelig WebView).

**Begrundelse:**

* Bedre brugeroplevelse
* Bevarer Shopify’s checkout-logik og sikkerhed
* Reducerer behov for custom løsning

**Teknisk retning:**

* Shopify Checkout Kit til React Native (hvis muligt)
* Integration med Storefront API og Customer Account API
