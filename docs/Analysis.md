# Analysis

## Formål med analysen

Formålet med denne analyse er at afgrænse første release, reducere teknisk risiko og skabe et tydeligt grundlag for udvikling, dokumentation og senere overdragelse.

Projektet tager udgangspunkt i en eksisterende kodebase, som bruges som inspiration og teknisk reference. Kodebasen er relevant, fordi den allerede understøtter et produktkatalog og er publiceret på App Store. Den genbruges dog ikke ukritisk, da datakilden i det nye projekt er Shopify, hvilket ændrer integrationsmønster, autentificering og checkout-flow.

---

## Opdateret scope for version 1

Første release fokuserer på en enkel og funktionel commerce-app med så lav kompleksitet som muligt.

### Indgår i version 1
- Produktkatalog
- Produktdetaljer
- Variantvalg
- Lagerstatus
- Kurv
- Login
- Køb via Shopify checkout i appen
- Push-notifikationer

### Indgår ikke i version 1
- Homescreen
- Community hub
- CMS/dynamisk content management
- Søgefunktion
- Filtrering
- Kampagner
- Beskedsystem

Denne afgrænsning er truffet for at sikre fokus på den centrale brugerrejse: fra katalog til køb og efterfølgende kundeopdateringer.

---

## Centrale produktbeslutninger

### 1. Ingen homescreen i første release
Brugeren skal lande direkte i produktkataloget. Dette reducerer navigationstrin og fjerner behovet for separat content management i første version.

### 2. Login kræves for køb
Brugere må gerne browse kataloget uden login, men login er påkrævet for at gennemføre køb. Dette giver en tydelig skelnen mellem offentlig browsing og købshandlinger, samtidig med at checkout og ordreopfølgning kan knyttes til en identificerbar kunde.

### 3. Shopify håndterer commerce-logik
Shopify anvendes som primær backend for produktdata, cart, kundelogin og checkout. Dette reducerer behovet for custom backend og understøtter en mere vedligeholdelsesvenlig løsning.

### 4. Checkout skal ske i appen
Målet er at gennemføre checkout i appen uden at sende brugeren ud i en almindelig browseroplevelse. Shopify tilbyder Checkout Kit til mobile apps, herunder React Native, som understøtter præsentation af checkout i appen og kan kombineres med Customer Account API for autentificerede checkouts.

---

## Teknisk analyse

## Frontend
Appen udvikles i React Native med Expo. Det giver hurtig iteration, fælles kodebase og en relativt enkel vej til builds og distribution.

## Commerce og data
Produktdata, cart og checkout bygger på Shopify’s Storefront API. Shopify beskriver Storefront API som egnet til apps og andre custom storefronts og fremhæver, at API’et understøtter både cart og checkout.

## Login og kundeidentitet
Customer Account API bruges til kundeautentificering. Shopify beskriver denne API som relevant til personaliserede, autentificerede kundeoplevelser og til at forbinde login med checkout i mobile apps.

## Checkout
Den foretrukne løsning er Shopify Checkout Kit for React Native. Valget er begrundet i, at den bevarer Shopify checkout-funktionalitet og butiksopsætning, samtidig med at checkout opleves som integreret i appen.

## Push-notifikationer
Push-notifikationer opdeles i to hovedformål:
1. Transaktionelle notifikationer knyttet til ordre- og fragtstatus
2. Broadcast-notifikationer til alle relevante brugere, fx ved lagerstatusændringer

---

## Brugerrejser i version 1

### Browse til køb
1. Bruger åbner appen
2. Bruger lander i katalog
3. Bruger åbner produkt
4. Bruger vælger variant
5. Bruger tilføjer til kurv
6. Hvis bruger ikke er logget ind, guides vedkommende til login
7. Bruger gennemfører checkout i appen
8. Bruger modtager efterfølgende notifikationer om ordre- og fragtstatus

### Lagerstatus-notifikation
1. Lagerstatus ændres
2. Relevante brugere modtager push-notifikation
3. Brugeren åbner appen direkte på relevant produkt eller katalogvisning

---

## Overdragelsesperspektiv

Projektet udvikles med henblik på, at andre potentielt skal videreføre eller drifte løsningen senere. Derfor prioriteres:
- enkel arkitektur
- tydelig dokumentation
- standardiserede integrationspunkter
- begrænset custom backend
- sporbar beslutningslog

Det reducerer afhængigheden af den oprindelige udvikler og gør løsningen mere robust i en virksomhedssetting.