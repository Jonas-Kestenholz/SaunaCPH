# Risk Analysis

## Formål

Denne risikoanalyse identificerer de væsentligste tekniske og projektmæssige risici i første version af appen samt mulige afbødende tiltag.

---

## Risiko 1 – Checkout i appen viser sig mere kompleks end forventet

**Beskrivelse:**  
Selvom Shopify tilbyder en officiel mobil checkout-løsning, kan integrationen med React Native, autentificering og cart-flow kræve mere tid end forventet.

**Konsekvens:**  
Forsinkelse i udvikling eller behov for midlertidig fallback-løsning.

**Sandsynlighed:**  
Mellem

**Afværgning:**  
- Afklar checkout-flow tidligt
- Lav tidlig teknisk prototype
- Prioritér checkout før sekundære features
- Hav fallback-plan klar, hvis visse dele skal udskydes

---

## Risiko 2 – Login og køb kobles ikke stabilt sammen

**Beskrivelse:**  
Da login er påkrævet for køb, er relationen mellem autentificeret bruger, cart og checkout forretningskritisk.

**Konsekvens:**  
Brugere kan opleve fejl ved køb eller miste cart-state.

**Sandsynlighed:**  
Mellem

**Afværgning:**  
- Test login → cart → checkout som samlet flow
- Dokumentér token-håndtering og session-flow
- Hold state management så simpelt som muligt

---

## Risiko 3 – Push-notifikationer bliver mere komplekse end planlagt

**Beskrivelse:**  
Projektet omfatter både transaktionelle notifikationer og broadcast-notifikationer. Det kræver afklaring af dataflow, triggerpunkter, permissions og håndtering af deep links.

**Konsekvens:**  
Notifikationer leveres ikke korrekt, eller fører ikke brugeren det rigtige sted hen i appen.

**Sandsynlighed:**  
Mellem til høj

**Afværgning:**  
- Skel tydeligt mellem notifikationstyper
- Definér payload-struktur tidligt
- Test på fysiske enheder
- Begræns første release til de vigtigste notifikationer

---

## Risiko 4 – Den eksisterende kodebase passer kun delvist

**Beskrivelse:**  
Den eksisterende app ligner funktionelt det nye projekt, men bruger andre datakilder og muligvis andre antagelser om navigation, state og API-arkitektur.

**Konsekvens:**  
For meget tid bruges på tilpasning eller refaktorering af noget, der burde bygges renere.

**Sandsynlighed:**  
Høj

**Afværgning:**  
- Brug kodebasen som reference, ikke som tvungen struktur
- Vurder løbende hvad der bør genbruges, omskrives eller ignoreres
- Dokumentér alle større afvigelser

---

## Risiko 5 – Afhængighed af Shopify begrænser fleksibilitet

**Beskrivelse:**  
Løsningen er bevidst bygget op omkring Shopify for at reducere kompleksitet, men det gør også appen afhængig af Shopify’s API’er og checkout-modeller.

**Konsekvens:**  
Færre muligheder for specialflows uden ekstra kompleksitet.

**Sandsynlighed:**  
Mellem

**Afværgning:**  
- Hold integrationslaget velstruktureret
- Undgå at sprede Shopify-logik tilfældigt i UI-laget
- Dokumentér tydeligt hvilke dele der er Shopify-afhængige

---

## Risiko 6 – Push-setup og Apple-publicering forsinker projektet

**Beskrivelse:**  
Push-notifikationer og distribution kræver korrekt opsætning af credentials, tilladelser og Apple Developer-konfiguration.

**Konsekvens:**  
Forsinkelser i test og releaseforberedelse.

**Sandsynlighed:**  
Mellem

**Afværgning:**  
- Opsæt Apple Developer og notifications tidligt
- Test på rigtig enhed, ikke kun simulator
- Dokumentér credentials og ansvar tydeligt

---

## Risiko 7 – Scope creep fra nye ønsker

**Beskrivelse:**  
Der kan løbende opstå ønsker om flere features, fx community, content-styring, filtrering og kampagnefunktioner.

**Konsekvens:**  
Version 1 bliver for stor og mister fokus.

**Sandsynlighed:**  
Høj

**Afværgning:**  
- Fasthold tydelig MVP
- Brug decisions log aktivt
- Flyt nye ønsker til “senere version”

---

## Risiko 8 – Overdragelse bliver vanskelig trods gode intentioner

**Beskrivelse:**  
Selv med repo og dokumentation kan overdragelse blive svær, hvis viden om miljøer, konti, credentials og integrationer ikke dokumenteres løbende.

**Konsekvens:**  
Virksomheden bliver i praksis afhængig af én person.

**Sandsynlighed:**  
Mellem

**Afværgning:**  
- Dokumentér setup, flows og beslutninger løbende
- Beskriv eksterne afhængigheder
- Hold README og setup-guide opdateret