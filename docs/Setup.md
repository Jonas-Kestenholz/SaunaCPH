# Setup Guide

## Forudsætninger

* Node.js
* npm / yarn
* Expo CLI
* Git

---

## Installation

```bash
git clone <repo-url>
cd project
npm install
```

---

## Start projekt

```bash
npx expo start
```

---

## Miljøvariabler

Opret en `.env` fil:

```
SHOPIFY_API_URL=
SHOPIFY_ACCESS_TOKEN=
```

---

## Shopify setup

* Opret app i Shopify
* Konfigurer Storefront API
* Indsæt credentials i .env

---

## Build

```bash
npx expo prebuild
npx expo run:ios
```

---

## TestFlight (senere)

* Build via Expo EAS
* Upload til App Store Connect
