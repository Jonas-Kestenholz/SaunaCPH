┌──────────────────────┐
│       Customer       │
├──────────────────────┤
│ id                   │
│ email                │
│ isAuthenticated      │
│ pushToken?           │
└──────────┬───────────┘
           │ 1
           │
           │ 0..1
┌──────────▼───────────┐
│       Session        │
├──────────────────────┤
│ accessToken          │
│ expiresAt?           │
│ customerId           │
└──────────────────────┘


┌──────────────────────┐
│       Product        │
├──────────────────────┤
│ id                   │
│ title                │
│ description          │
│ images[]             │
│ availableForSale     │
└──────────┬───────────┘
           │ 1
           │
           │ 1..*
┌──────────▼───────────┐
│       Variant        │
├──────────────────────┤
│ id                   │
│ title                │
│ price                │
│ currencyCode         │
│ availableForSale     │
│ inventoryQuantity?   │
└──────────────────────┘


┌──────────────────────┐
│         Cart         │
├──────────────────────┤
│ id                   │
│ checkoutUrl          │
│ totalQuantity        │
│ totalAmount          │
└──────────┬───────────┘
           │ 1
           │
           │ 0..*
┌──────────▼───────────┐
│       CartLine       │
├──────────────────────┤
│ id                   │
│ quantity             │
│ lineAmount           │
└──────────┬───────────┘
           │
           │ references
           ▼
┌──────────────────────┐
│       Variant        │
└──────────────────────┘


┌──────────────────────┐
│       Checkout       │
├──────────────────────┤
│ checkoutUrl          │
│ status               │
└──────────┬───────────┘
           │
           │ created from
           ▼
┌──────────────────────┐
│         Cart         │
└──────────────────────┘


┌──────────────────────┐
│    StockAlert /      │
│     NotifyMe         │
├──────────────────────┤
│ id                   │
│ customerId           │
│ productId            │
│ createdAt            │
│ active               │
└──────────────────────┘


┌──────────────────────┐
│   PushNotification   │
├──────────────────────┤
│ id                   │
│ type                 │
│ targetScreen         │
│ payload              │
└──────────────────────┘