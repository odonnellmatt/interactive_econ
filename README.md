# EconPlayground — Interactive Microeconomics Sandbox

An interactive learning tool designed for university students studying introductory microeconomics. Students manipulate demand and supply schedules in real time and immediately observe how market equilibria and welfare respond.

Built with React + Vite and designed for embedding as iframes in **Canvas LMS** (or any other learning platform).

---

## 🎓 What This Tool Teaches

| Module | URL param | Concepts covered |
|--------|-----------|-----------------|
| **Supply & Demand Shifts** | `?model=standard` | Curve shifts; new P\* and Q\* |
| **Price Ceiling** | `?model=ceiling` | Binding vs. non-binding; shortages; DWL |
| **Price Floor** | `?model=floor` | Binding vs. non-binding; surpluses; DWL |
| **Taxes & Tax Incidence** | `?model=tax` | Tax wedge; consumer/producer price; tax revenue; DWL |
| **World Price & Trade** | `?model=world` | Free trade; imports/exports; tariffs; tariff revenue; DWL |
| **Elasticity** | `?model=elasticity` | Slope vs. elasticity; tax incidence shares |
| **Glossary** | `?model=glossary` | Key term definitions |

---

## ✨ Key Features

- **Drag-to-move** — Drag supply/demand curves and price lines directly on the graph
- **Fluid sliders + numeric inputs** — Every parameter has a slider and a direct number field
- **Dynamic Economic Analysis** — Plain-English explanations update live (e.g. "This ceiling is binding — shortage of X units…")
- **Welfare Areas toggle** — Show/hide Consumer Surplus, Producer Surplus, DWL, Tax/Tariff Revenue
- **Per-module iframes** — Append `?model=<id>` to lock the app to one module, hiding the tab navigation

---

## 🔗 Per-Module iFrame URLs

Each module is embedded independently using a URL query parameter. When `?model=` is set, the navigation tabs are hidden and the module title appears in the header.

Replace `YOUR_DEPLOYED_URL` with your Vercel/Netlify URL in each snippet below.

### Supply & Demand Shifts
```html
<iframe src="YOUR_DEPLOYED_URL/?model=standard" width="100%" height="850px"
  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"
  title="Supply & Demand Shifts" allowfullscreen></iframe>
```

### Price Ceiling
```html
<iframe src="YOUR_DEPLOYED_URL/?model=ceiling" width="100%" height="850px"
  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"
  title="Price Ceiling" allowfullscreen></iframe>
```

### Price Floor
```html
<iframe src="YOUR_DEPLOYED_URL/?model=floor" width="100%" height="850px"
  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"
  title="Price Floor" allowfullscreen></iframe>
```

### Taxes & Tax Incidence
```html
<iframe src="YOUR_DEPLOYED_URL/?model=tax" width="100%" height="850px"
  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"
  title="Taxes & Tax Incidence" allowfullscreen></iframe>
```

### World Price & Trade
```html
<iframe src="YOUR_DEPLOYED_URL/?model=world" width="100%" height="850px"
  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"
  title="World Price & Trade" allowfullscreen></iframe>
```

### Elasticity
```html
<iframe src="YOUR_DEPLOYED_URL/?model=elasticity" width="100%" height="850px"
  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"
  title="Elasticity" allowfullscreen></iframe>
```

---

## 🚀 Run Locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev          # starts on http://localhost:3000
```

Test any module locally by visiting e.g. `http://localhost:3000/?model=ceiling`.

---

## 🌐 Free Hosting & Deployment

### Option 1: Vercel (Recommended)
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com/) → **Add New → Project**.
3. Import your repo — Vercel auto-detects Vite. Click **Deploy**.

### Option 2: Netlify
1. Push to GitHub.
2. Go to [netlify.com](https://netlify.com/) → **Add new site → Import an existing project**.
3. Select your repo and click **Deploy Site**.

---

## 🎓 Embedding the Full Sandbox (optional)

To give students access to all modules at once (e.g. on a general overview page):

```html
<iframe src="YOUR_DEPLOYED_URL" width="100%" height="850px"
  style="border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0/.1);"
  title="Microeconomics Interactive Sandbox" allowfullscreen></iframe>
```

> The same iframe snippets work in any LMS or website (Moodle, Blackboard, Notion, etc.).
