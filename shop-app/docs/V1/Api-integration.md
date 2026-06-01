# API Integration

## Shopify integration

Appen kommunikerer med Shopify via GraphQL API.

---

## Funktioner

* Hent produkter
* Hent produktdetaljer
* Håndter cart
* Login via Shopify Customer Account

---

## Eksempel (GraphQL)

```graphql
query {
  products(first: 10) {
    edges {
      node {
        title
        priceRange {
          minVariantPrice {
            amount
          }
        }
      }
    }
  }
}
```

---

## Login flow

1. Bruger vælger login
2. Redirect til Shopify
3. Callback håndteres i app
4. Token gemmes lokalt

---

## Overvejelser

* API rate limits
* Sikker håndtering af tokens

## Hvorfor GraphQL?

- Henter kun nødvendige felter
- Reducerer overfetching
- Fleksibel struktur

## Ulemper

- Mere kompleks query-struktur
- Kræver mapping