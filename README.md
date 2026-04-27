## SAUNA – React Native Shopify App

## Projektbeskrivelse

Dette projekt er en mobilapplikation udviklet i React Native med Expo, som integrerer med Shopify for at give brugere mulighed for at browse og købe produkter direkte via en app.

Appen fungerer primært som frontend, mens Shopify håndterer backend-logik såsom produktdata, cart og brugerlogin.

---

## Formål

* Skabe en direkte kanal til kunder
* Muliggøre køb via mobil
* Understøtte push-notifikationer

---

## Teknologi

* React Native (Expo)
* Shopify (Storefront API)
* GraphQL
* Expo Notifications
* (Planlagt) Azure DevOps CI/CD

---

## Projektstruktur

```id="zptzkq"
/docs
  architecture.md
  decisions.md
  setup.md
  api-integration.md
  deployment.md
```

---

## Kom i gang

```bash
npm install
npx expo start
```

Se `/docs/setup.md` for detaljer.

---

## Dokumentation

Projektet er dokumenteret løbende for at understøtte:

* Overdragelse til andre udviklere
* Transparens i tekniske beslutninger
* Grundlag for rapport

Se:

* Architecture → `/docs/architecture.md`
* Beslutninger → `/docs/decisions.md`
* Setup → `/docs/setup.md`
* API → `/docs/api-integration.md`
* Deployment → `/docs/deployment.md`

---

## DevOps strategi

Projektet startes i GitHub og migreres senere til Azure DevOps for:

* CI/CD pipelines
* Struktur og governance
* Fremtidig drift

---

## Overdragelse

Projektet er designet med fokus på:

* Lav kompleksitet
* Klar dokumentation
* Brug af eksisterende platforme (Shopify)

Dette gør det muligt for andre udviklere hurtigt at overtage og videreudvikle løsningen.

---

## Status

Projektet er under udvikling og følger en iterativ proces med løbende feedback og forbedringer.
