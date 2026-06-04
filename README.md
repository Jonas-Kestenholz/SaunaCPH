# SAUNA Mobile App

Mobile application developed for SAUNA as part of a Datamatiker final project.

The app is built with React Native and Expo and integrates with Shopify to provide a mobile shopping experience, dynamic front page content, customer login, cart, checkout, restock notifications, support functionality and order-related profile features.

---

## Project Overview

SAUNA is a clothing brand with an existing Shopify webshop. The purpose of this project was to build a mobile application that could support the existing webshop experience while also creating a stronger direct communication channel between SAUNA and its customers.

The application focuses on:

* Mobile-first shopping experience
* Shopify product and cart integration
* Dynamic front page content controlled from Shopify
* Customer login through Shopify Customer Accounts
* Restock notification foundation using Azure Functions
* Support form handling
* Track & trace flow prepared for DAO/GLS integration
* TestFlight-ready iOS build workflow through Expo EAS and Azure DevOps

---

## Tech Stack

### Mobile App

* React Native
* Expo
* Expo Router
* TypeScript
* TanStack Query
* AsyncStorage
* Shopify Checkout Sheet Kit

### Backend / Cloud

* Azure Functions
* Azure Table Storage
* Shopify Webhooks
* Expo Push Notification Service

### Commerce Platform

* Shopify Storefront API
* Shopify Customer Accounts
* Shopify Metaobjects

### Deployment and Testing

* Expo EAS Build
* TestFlight
* Azure DevOps Pipeline

---

## Main Features

### Dynamic Home Screen

The home screen is controlled through Shopify Metaobjects. SAUNA can update images, titles, CTA labels, product references and active states directly in Shopify without requiring a new app release.

The app supports two types of front page content:

* Home slides
* Monthly drop overlay with countdown

If the drop overlay is active and the current date is within the configured activation period, the app displays the drop overlay. Otherwise, it displays the normal home slides.

---

### Product Catalogue

Products are fetched from Shopify using the Storefront API. The app displays products in a mobile-friendly product grid and allows the user to open individual product pages.

Product pages include:

* Product images
* Product title
* Price
* Description
* Variant selection
* Size selection
* Add to cart functionality

---

### Cart and Checkout

The app uses Shopify Cart through the Storefront API.

A Shopify cart ID is stored locally with AsyncStorage, so the app can reuse the same cart when the user opens the app again. If the saved cart no longer exists in Shopify, the app automatically creates a new cart.

Checkout is handled through Shopify Checkout Sheet Kit. This means Shopify handles payment, delivery information and order confirmation, while the app controls the shopping experience before checkout.

---

### Customer Login and Profile

Login is implemented through Shopify Customer Accounts using OAuth Authorization Code Flow with PKCE.

The app does not handle customer passwords directly. Shopify handles the secure login flow, while the app stores the returned tokens and uses them to fetch customer profile data and previous orders.

The profile area includes:

* Customer information
* Previous orders
* Shipping status section
* Order-related navigation

---

### Notify Me / Restock Alerts

The notify me feature allows users to register interest in out-of-stock products or variants.

When the user signs up for a restock alert, the app sends product and push token data to an Azure Function. The registration is stored in Azure Table Storage.

The flow is designed to work together with Shopify webhooks:

1. User taps Notify me in the app
2. App sends product, variant and Expo push token data to Azure
3. Azure Function stores the registration in Table Storage
4. Shopify webhook is triggered by inventory changes
5. Azure Function can look up relevant registrations
6. Expo Push Notification Service can send restock notifications

Status: the registration flow and Azure setup are implemented. Full end-to-end production testing of the webhook and push notification flow is still part of the final test phase.

---

### Support

The app includes a support page with FAQ, support information and a contact form.

The support form stores the user's email and message through Azure Functions, so SAUNA can respond from their support email.

---

### Track & Trace

The profile area includes a track & trace flow for showing order delivery status.

The flow is prepared for DAO/GLS integration and has been tested with mock data. Final live integration depends on access to the required DAO/GLS API keys.

---

## Project Structure

```text
app/
├── product/
│   ├── _layout.tsx
│   └── [id].tsx
├── tracking/
│   └── [orderId].tsx
├── _layout.tsx
├── app-settings.tsx
├── cart.tsx
├── checkout.tsx
├── index.tsx
├── login.tsx
├── notifications.tsx
├── orders.tsx
├── products.tsx
├── profile-details.tsx
├── profile.tsx
└── support.tsx

src/
├── components/
│   ├── cart/
│   ├── common/
│   ├── icons/
│   ├── notifications/
│   ├── products/
│   ├── profile/
│   └── support/
├── features/
│   ├── auth/
│   ├── cart/
│   ├── home/
│   ├── notifications/
│   ├── products/
│   ├── profile/
│   └── tracking/
├── lib/
│   └── shopify/
└── providers/
```

The project is structured around feature folders. Each feature contains its own hooks, types, mappers, storage or service logic where relevant. This makes the codebase easier to maintain and extend.

---

## Environment Variables

The app requires environment variables for Shopify, Customer Accounts and API communication.

Example:

```env
EXPO_PUBLIC_SHOPIFY_API_VERSION=
EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN=
EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=
EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI=
EXPO_PUBLIC_CUSTOM_API_BASE_URL=
EXPO_PUBLIC_CUSTOM_API_KEY=
```

Do not commit real tokens or secrets to GitHub.

---

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Run Expo doctor:

```bash
npx expo-doctor@latest
```

---

## iOS Build

The project is configured for EAS builds.

Example build command:

```bash
eas build --platform ios --profile production
```

The project also contains an Azure DevOps pipeline for building the iOS app and submitting it to TestFlight.

---

## Current Status

Implemented:

* Shopify product listing
* Product detail pages
* Variant selection
* Cart
* Shopify checkout
* Shopify Customer Account login
* Profile and previous orders
* Dynamic home slides through Shopify Metaobjects
* Monthly drop overlay with countdown
* Notify me registration flow
* Azure Functions setup
* Azure Table Storage setup
* Shopify webhook setup
* Support form
* Track & trace UI with mock data
* TestFlight build setup
* Azure DevOps pipeline setup

Partially completed / pending final testing:

* End-to-end notify me webhook and push notification flow
* Live DAO/GLS track & trace integration
* Final production release to App Store

---

## Future Development

Possible future features include:

* Community hub
* Event notifications
* Collection drop notifications
* Local wishlist
* Ønskeskyen integration
* iOS home screen widget
* More advanced analytics
* Expanded notification preferences
* Android release

---

## Notes

This project was developed as a final Datamatiker project in collaboration with SAUNA.

The application is intended as a technical foundation for a future SAUNA mobile platform. Some integrations are prepared but depend on final production credentials and business release planning.
