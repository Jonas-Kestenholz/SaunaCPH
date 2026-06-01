                ┌──────────────────────────┐
                │        Brugere           │
                │   (iOS / Android App)    │
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │   React Native App       │
                │   (Expo)                 │
                │                          │
                │ - UI / Navigation        │
                │ - API calls              │
                │ - State (client)         │
                │ - Push notifications     │
                └────────────┬─────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    Shopify API   │  │Expo Notifications│  │  (Valgfrit CMS)  │
│ (GraphQL)        │  │                  │  │ (Firestore etc.) │
│                  │  │                  │  │                  │
│ - Produkter      │  │ - Push beskeder  │  │- Dynamisk content│
│ - Cart           │  │                  │  │                  │
│ - Login          │  │                  │  │                  │
│ - Lagerstatus    │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘


                ┌──────────────────────────┐
                │   DevOps / Infrastruktur │
                │                          │
                │ - Git (kode)             │
                │ - CI/CD pipelines        │
                │ - Builds (Expo EAS)      │
                │ - TestFlight distribution│
                └──────────────────────────┘

## 1. Appen er “tynd”
Ingen tung backend
Mindre kompleksitet
Nemmere at vedligeholde

## 2. Shopify er “kernen”
Single source of truth
Mindre risiko for fejl
Let for virksomheden at styre

## 3. Løs kobling
App ↔ API (GraphQL)
Du kan ændre UI uden at ændre backend

## 4. DevOps er separat lag
Repo + pipelines
Build + distribution
Understøtter overdragelse

Løsningen er designet som en frontend-orienteret mobilapplikation, hvor hovedparten af backend-funktionaliteten håndteres af Shopify. Appen er udviklet i React Native med Expo og fungerer primært som en præsentations- og interaktionsflade.

Kommunikation mellem appen og Shopify sker via GraphQL API, hvilket muliggør fleksibel og effektiv datahåndtering. Funktioner såsom produktvisning, lagerstatus, cart og brugerlogin håndteres direkte af Shopify.

Der er desuden implementeret understøttelse for push-notifikationer via Expo Notifications, hvilket giver mulighed for direkte kommunikation med brugerne.

Arkitekturen er valgt med fokus på lav kompleksitet, høj vedligeholdbarhed og mulighed for fremtidig overdragelse til andre udviklere. Ved at minimere behovet for en custom backend reduceres både udviklings- og driftsomkostninger.