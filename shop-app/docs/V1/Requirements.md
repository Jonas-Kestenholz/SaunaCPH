# Requirements

## Funktionelle krav

### Produktkatalog
- Appen skal vise produkter hentet fra Shopify
- Produkter skal kunne vises i en katalogoversigt
- Brugeren skal kunne åbne et produkts detaljeside

### Produktdetalje
- Appen skal vise produkttitel
- Appen skal vise pris
- Appen skal vise produktbilleder
- Appen skal vise lagerstatus
- Appen skal understøtte variantvalg

### Kurv og køb
- Brugeren skal kunne tilføje produkter til kurven
- Brugeren skal kunne ændre antal i kurven
- Brugeren skal kunne fjerne produkter fra kurven
- Brugeren skal være logget ind for at kunne gennemføre køb
- Checkout skal gennemføres via Shopify i appen

### Login
- Brugeren skal kunne logge ind med Shopify customer account
- Brugeren skal kunne browse katalog uden login
- Brugeren skal guides til login ved forsøg på køb uden aktiv session

### Push-notifikationer
- Appen skal kunne modtage transaktionelle push-notifikationer relateret til ordre- og fragtstatus
- Appen skal kunne modtage push-notifikationer om lagerstatusændringer
- Push-notifikationer skal kunne åbne relevante steder i appen

---

## Ikke-funktionelle krav

### Vedligeholdelse
- Løsningen skal være enkel at overdrage til andre udviklere
- Kodebase og opsætning skal dokumenteres løbende
- Integrationer og afhængigheder skal beskrives tydeligt

### Arkitektur
- Shopify skal håndtere størstedelen af backend-logik
- Appen skal primært fungere som frontend
- Løsningen skal minimere behovet for custom backend i version 1

### Drift
- Appen skal kunne bygges og distribueres til intern test
- Løsningen skal kunne indgå i et senere CI/CD-setup
- Projektet skal kunne ejes og videreføres af virksomheden

### Brugervenlighed
- Brugeren skal lande direkte i produktkataloget
- Købsflowet skal være så få trin som muligt
- Navigationen skal være enkel og konsekvent

### Kvalitet
- Kritiske flows skal kunne testes pålideligt
- API-integration med Shopify skal være stabil
- Løsningen skal fungere på rigtige enheder i relevante scenarier

---

## Afgrænsning for version 1
Følgende funktioner er bevidst ikke inkluderet:
- Homescreen
- CMS-styret forsideindhold
- Community hub
- Søgefunktion
- Filtrering
- Favoritter
- Kampagner
- Internt beskedsystem