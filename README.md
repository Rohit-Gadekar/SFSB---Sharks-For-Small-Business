# Sfsb - Sharks For Small Businesses

> **Where small businesses meet big believers.**

Sfsb (Sharks For Small Businesses) is the high-conviction deal and capital platform bridging passionate community sharks with verified, profitable Main Street enterprises. While large conglomerates access dedicated investment bankers and venture capital, Sfsb brings shark-grade financial scrutiny, transparent deal rooms, and community equity, revenue sharing, and bond backing to everyday neighborhood champions.

---

## Key Highlights

- **The Deal Tank**: Where everyday individuals become "Big Believers" (community sharks), backing vetted local businesses with audited margins, equity shares, monthly revenue sharing, or 8.5%+ bond returns.
- **Shark-Grade Financial Scrutiny**: Audited 3-year unit economics, verified operating margins, repeat rates, and evidence-grounded milestone tracking.
- **Three Isolated Personas**:
  - **Big Believer (Shark Investor)**: Explore The Deal Tank, review audited pitches, back businesses across Equity (percentage of company owned & number of shares), Revenue Sharing (monthly revenue share % & 1.5x cap), and Fixed Yield Bonds, with full portfolio ledgering.
  - **Managing Business Founder**: Manage listed rounds, milestone disbursements, and ingest financial/sales documents (CSV/PDF) into the SFSB AI Engine to recalculate forecasts and recalibrate health scores.
  - **Business Listing Applicant**: Dedicated workspace to draft pitches, review and settle platform due-diligence charges (₹15,000), submit for inspection, and track committee approval before public launch into The Deal Tank.
- **Platform Diligence & Inspection Pipeline**: Newly listed ventures are strictly withheld from The Deal Tank during vetting until passing all 4 stages of verification and committee approval.

---

## Architecture

```text
                  ┌─────────────────────────────────────────┐
                  │       Client (React 19 + TypeScript)    │
                  │   Discover • Screener • Growth • Capital │
                  └────────────────────┬────────────────────┘
                                       │ /api/*
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │       Express Server (server.ts)        │
                  │   Deterministic Calculations + Routing   │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │      Google Gen AI (@google/genai)      │
                  │           gemini-3.8-flash              │
                  │  Evidence Grounding & Scenario Analysis │
                  └─────────────────────────────────────────┘
```

---

## Featured Sample Enterprises

1. **Crumb & Co.** (Artisan Bakery, Hyderabad)
   - Revenue: ₹39.0L (FY26) • YoY Growth: +25.8% • Gross Margin: 58.0%
   - Capacity constraint: 42% weekday morning oven idle capacity.
   - Growth plan: Commercial weekday office catering for corporate tech corridors.
2. **The Daily Grind** (Specialty Coffee & Roastery, Hyderabad)
   - Revenue: ₹42.0L • Gross Margin: 61.2% • Operating Margin: 14.8%
   - Ethical direct sourcing from Araku smallholder tribal farmers.
3. **Thread & Loom** (Sustainable Handloom Apparel, Bengaluru)
   - Revenue: ₹29.0L • Gross Margin: 64.5% • Repeat Rate: 36.5%
   - Zero chemical dye runoff, sustaining hereditary Karnataka weaver livelihoods.

---

## Regulatory Simulation Disclaimer

LocalProof is a demonstration prototype modeling community capital mechanisms. All investment opportunities and return projections are illustrative simulations and do not constitute actual securities offerings, financial advice, or solicitation.
