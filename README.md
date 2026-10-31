# The Farm Story – Farm-to-Table Retail Management Platform (Frontend Demo)

> **Client Presentation Demo**  
> Built strictly based on the 34-page strategic blueprint: `Farm_Story_Client_Presentation_NoPricing.pdf`.  
> Designed as an omnichannel retail platform connecting purchasing, dock receiving, in-store POS, e-commerce, doorstep slot delivery, customer loyalty, and Indian GST compliance.

---

## 🌟 Executive Overview

**The Farm Story** is a farm-to-table fresh retail brand founded in 2019, opening its modern flagship store in September 2026. This frontend demonstration was engineered to provide potential clients and stakeholders with an interactive, end-to-end product demonstration before investing in backend and database infrastructure.

### The 4 Perishable Produce Realities Addressed (PDF Page 5)
1. **It Perishes**: Unsold produce directly drains margins. Solved via automated FIFO batch tracking, freshness indicators, and near-expiry alerts.
2. **Prices Move Daily**: Farm-gate mandi rates change with seasons. Solved via instant centralized pricing updates synced across the POS counter and website.
3. **Sold by Exact Weight**: Weighing scales, thermal price stickers, and checkout bills must agree. Solved via a digital scale weighing desk and weight labels.
4. **Two Doors, One Stock**: Counter and web store must never sell the same kilo twice. Solved via a single reactive live inventory engine.

---

## 🚀 Key Interfaces & Route Map

| Experience | Route | Key Features |
|---|---|---|
| **Client Presentation Mode** | `/demo` | **6-step "Follow One Crate of Tomatoes"** interactive journey, 10 module cards, meeting facilitator script, and **Reset Demo Data** button. |
| **Customer Storefront** | `/` | Fresh harvest hero section, seasonal specials, live stock badges, trust guarantees, and farm-to-table brand story. |
| **Produce Catalogue** | `/shop` | Category filter pills, organic filter, search, unit-based pricing, and sort by price or stock. |
| **Produce Details** | `/product/[slug]` | High-res produce images, farm harvest origin, unit picker (500g / 1kg / bunch), recipe notes, and shelf-life indicators. |
| **Shopping Basket** | `/cart` | Decimal weight steppers, free delivery progress bar (threshold ₹500), promo code simulation (`FARM50`), and GST summary. |
| **Checkout Flow** | `/checkout` | Pre-fill demo profiles, delivery slot selector (Today / Tomorrow), payment simulation (COD, Pay at Store, UPI QR), and confetti confirmation. |
| **Customer Account** | `/account` | Omnichannel spend, Gold/Silver tier badges, loyalty points balance (1 pt per ₹100), and live order tracking status (New → Packed → Dispatched → Delivered). |
| **POS Billing Counter** | `/pos` | Fast touch billing inspired by Page 11 of the PDF (Counter 1, Cashier Riya), scale weighing modal, barcode simulation, hold/resume bills, offline mode toggle & queue sync, and printable 80mm thermal receipt. |
| **Executive Dashboard** | `/admin` | Owner KPI cards matching Page 14 (Sales ₹48,250, 312 bills, 2.1% wastage, 31% margin), 7-day sales chart, channel split (Store 68% vs Online 32%), and near-expiry warnings. |
| **Product Management** | `/admin/products` | Master catalogue, retail vs cost price, HSN codes, GST tax rates (Nil 0% vs 5%/12%), and modal editor. |
| **Inventory & Batches** | `/admin/inventory` | Batch-wise stock (e.g. `B-261028-A`), FIFO expiry alerts, wastage loss recording with reasons, and thermal barcode sticker generator (Page 10 format). |
| **Purchasing & Suppliers** | `/admin/purchases` | Farm collective profiles (Sangli, Junnar, Talala), PO creation, dock receiving with auto-batch generation, and farm-gate rate comparison. |
| **Order Command Center** | `/admin/orders` | Unified queue for in-store POS bills and web delivery orders with status filter and item weight inspection. |
| **Delivery & Packing Desk**| `/admin/delivery` | Digital scale weigh-at-packing desk (Page 13 requirement), EV eco-rider dispatch (Vikram Jadhav / Sachin Kulkarni), and COD cash settlement. |
| **Customers & Loyalty** | `/admin/customers` | Unified profiles across store and web, lifetime visits, regular produce favorites, and WhatsApp restock alert simulation. |
| **Accounts & GST** | `/admin/accounts` | Built for Indian Retail Compliance (Page 34): Nil-rated fresh produce vs taxable packaged goods split, GSTR-1 and GSTR-3B CA summaries, P&L statement. |
| **Reports & Analytics** | `/admin/reports` | Spoilage causes breakdown, supplier reliability benchmarks, top revenue produce, and export simulation. |

---

## 🍅 The Guided Presentation Story: "Follow One Crate of Tomatoes"

Accessible directly at `/demo`:
1. **Step 1 - Order**: Issue Purchase Order for 100 kg Desi Tomatoes @ ₹22/kg from Krishna Organics.
2. **Step 2 - Receive**: Goods arrive at dock; Batch `B-261031-A` logged with 5-day expiry. Live stock increases by 100 kg.
3. **Step 3 - Label**: Thermal barcode sticker generated: *"ORGANIC TOMATO 500g ₹30 / 1kg ₹60 (Batch 261031-A)"*.
4. **Step 4 - Sell**: Cashier sells 2 kg at store counter POS; live stock decrements via FIFO.
5. **Step 5 - Deliver**: Online order packed, weighed on digital scale (4.15 kg), and dispatched with EV rider Vikram Jadhav.
6. **Step 6 - Know**: Sales Register, GSTR-1 summary, P&L, and Owner Dashboard update in real-time with **zero manual re-typing**.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & Vanilla CSS design tokens
- **Design Tokens**:
  - Primary Dark Green: `#123B2A`
  - Secondary Green: `#2F6B45`
  - Accent Gold: `#D4AA52`
  - Background Cream: `#F8F6F0`
  - Light Green: `#EAF2E7`
  - Charcoal Text: `#1E2B23`
- **State Management**: Zustand with persistent storage (`src/store/farmStore.ts`)
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (7-day bar chart, channel split donut, wastage distribution)
- **Micro-Interactions**: Canvas Confetti for celebratory order & POS completions
- **Formatting**: Indian Rupee (`₹`) and Indian calendar locale standards

---

## 📦 Local Setup and Run Instructions

### Prerequisites
- Node.js `v20.x` or higher (tested on Node `v24.12.0`)
- npm `v10.x` or higher

### Steps

1. **Clone or navigate to workspace**:
   ```bash
   cd e:/Projects/Farm-Story
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build production bundle**:
   ```bash
   npm run build
   npm run start
   ```

---

## ☁️ Deployment Instructions for Vercel

1. Push this repository to GitHub or GitLab.
2. Log into your [Vercel Dashboard](https://vercel.com).
3. Click **Add New Project** and select the `Farm-Story` repository.
4. Set Framework Preset: **Next.js**.
5. Build Settings:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
6. Click **Deploy**. Vercel will build and host the demo on a global edge CDN with zero configuration required.

---

## 🔍 Simulation Scope vs. Future Backend Roadmap

To protect business integrity and adhere to prompt constraints, all interactions in this demonstration are frontend-simulated. Below is the technical breakdown:

| Feature Area | Current Frontend Demo Implementation | Future ASP.NET Core & SQL Server Roadmap |
|---|---|---|
| **Inventory & Stock** | Reactive Zustand store; FIFO batch deductions, stock updates saved in browser `localStorage`. | `InventoryBatches` and `Products` tables in SQL Server; atomic database transactions with row-level locks on stock depletion. |
| **Authentication & Roles** | Instant Role Switcher (Owner, Manager, Cashier, Inventory Exec, Rider, CA) in Demo Top Bar. | ASP.NET Core Identity with JWT bearer tokens, claims-based authorization, and refresh tokens. |
| **POS Billing & Offline** | Simulated local queue with visual online/offline toggle and manual sync queue simulation. | IndexedDB local storage with Background Sync API / Web Workers; server conflict resolution (CRDT / vector clocks). |
| **Payments** | Simulated Cash, UPI (QR code display & UTR input), and Card selection. Confetti celebration. | Razorpay / Cashfree / Stripe Payment Gateway Webhooks with HMAC SHA256 signature verification. |
| **Receipt Printing** | 80mm thermal receipt formatted via CSS `@media print` with browser print trigger. | Direct raw ESC/POS network printer commands sent to counter thermal printers via WebSocket or USB WebHID. |
| **Delivery Tracking** | State pipeline (New → Packed → Dispatched → Delivered) with digital scale actual weight adjustments. | Mobile Flutter / React Native Driver App with GPS geolocation tracking and WebSockets for real-time customer map updates. |
| **GST Compliance** | Live calculation of Nil-rated (0%) fresh produce vs taxable packaged goods (5%/12%) with GSTR export simulation. | Automated GSTN e-Invoicing API and e-Way Bill NIC portal direct JSON upload integrations. |
| **Customer Notifications** | Simulated in-app toast log ("WhatsApp Restock Alert Sent"). | Twilio / Meta WhatsApp Business Cloud API integration for automated transactional notifications. |

---

## 📄 Client Presentation Checklist

During your client meeting, follow this recommended sequence:
1. Open `/demo` and introduce the brand premise: *"From farm to table, on one system"*.
2. Walk through the 6-step **"Follow One Crate of Tomatoes"** interactive story.
3. Switch into `/pos` to demonstrate Counter 1 speed, weighing modal, and offline billing resilience.
4. Open `/admin` to reveal how the POS sale instantly updated today's sales (₹48,250), gross margin (31%), and 7-day sales chart.
5. Showcase `/admin/accounts` to reassure the client's CA that Indian GST Nil-rated fresh produce is separated from taxable goods without manual re-entry.
6. Click **"Reset Demo"** in the top bar to restore clean presentation numbers before concluding.
