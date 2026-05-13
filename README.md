# Genesis Dashboard — Next.js

A production-ready analytics dashboard for Contacts & Communications data, built with Next.js 14 App Router, TypeScript, and Chart.js.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment config
cp .env.local.example .env.local

# 3. Run development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## 📁 Project Structure

```
genesis-dashboard/
├── app/
│   ├── layout.tsx          # Root layout, metadata, font loading
│   └── page.tsx            # Entry page (renders Dashboard)
│
├── components/
│   ├── Dashboard.tsx        # ← Main orchestrator (all sections)
│   ├── layout/
│   │   ├── Topbar.tsx       # Top nav bar, theme toggle, live badge
│   │   └── SectionHeader.tsx
│   ├── ui/
│   │   ├── FilterBar.tsx    # Date range + preset pills
│   │   ├── MetricCard.tsx   # KPI stat card
│   │   ├── Badge.tsx        # Channel/status/direction badge
│   │   └── ScaleChart.tsx   # Progress-bar chart
│   ├── charts/
│   │   ├── DoughnutChart.tsx  # Reusable doughnut/pie chart
│   │   ├── LineChart.tsx      # Reusable area/line chart
│   │   └── BarChart.tsx       # Reusable bar chart (horizontal too)
│   └── tables/
│       ├── CommTables.tsx    # All/Direction/Channel record tables
│       └── ContactTables.tsx # Contact directory + mini list
│
├── lib/
│   ├── api/
│   │   ├── config.ts        # ← API configuration (edit this)
│   │   ├── dataService.ts   # Fetch layer (mock ↔ real API)
│   │   └── mockData.ts      # Mock datasets (100 contacts, ~170 comms)
│   ├── hooks/
│   │   ├── useDashboardData.ts  # Data + filter state hook
│   │   └── useTheme.ts          # Dark/light theme hook
│   └── utils/
│       └── analytics.ts     # Pure data computation functions
│
├── types/
│   └── index.ts             # TypeScript interfaces for all data
│
├── styles/
│   └── globals.css          # All design tokens + component styles
│
└── .env.local.example       # Environment variable template
```

---

## 🔌 Connecting Your Real API

### Step 1 — Edit `lib/api/config.ts`

```ts
// Switch from mock to real data
export const USE_MOCK_DATA = false;   // ← change this

// Set your API base URL
export const API_BASE_URL = 'https://rest.gohighlevel.com/v1';

// Add your authorization header
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
};

// Update endpoint paths to match your API
export const ENDPOINTS = {
  communications: '/conversations/',
  contacts:       '/contacts/',
};
```

### Step 2 — Set environment variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://rest.gohighlevel.com/v1
NEXT_PUBLIC_API_KEY=your_real_api_key
```

### Step 3 — Adjust response mapping (if needed)

In `lib/api/dataService.ts`, the fetch functions handle both flat arrays and wrapped responses:

```ts
// If your API returns: { contacts: [...] }
return Array.isArray(data) ? data : data.contacts;

// If your API returns a different shape, update accordingly:
return data.results ?? data.items ?? data;
```

### Step 4 — Match the TypeScript types

If your API returns different field names, update `types/index.ts` to match, then update `lib/utils/analytics.ts` accordingly.

---

## 🎨 Design System

All design tokens live in `styles/globals.css` as CSS variables:

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f4f6fb` | `#090d18` |
| `--bg-card` | `#ffffff` | `#141c2e` |
| `--teal` | `#0d9e7e` | `#06d6a0` |
| `--blue` | `#2563eb` | `#4895ef` |
| `--violet` | `#7c3aed` | `#9b5de5` |

---

## 📊 Reusable Chart Components

All charts in `components/charts/` are fully reusable:

### `DoughnutChart`
```tsx
<DoughnutChart
  labels={['Email', 'SMS']}
  data={[60, 40]}
  colors={['#2563eb', '#7c3aed']}
  height={240}
/>
```

### `LineChart`
```tsx
<LineChart
  dates={['2026-05-01', '2026-05-02']}
  datasets={[
    { label: 'Email', data: [10, 15], borderColor: '#2563eb', bgColor: 'rgba(37,99,235,0.07)' },
  ]}
  isDark={false}
/>
```

### `BarChart`
```tsx
<BarChart
  labels={['Week 1', 'Week 2']}
  datasets={[{ label: 'Email', data: [20, 30], color: 'rgba(37,99,235,0.7)' }]}
  horizontal  // optional: renders horizontal bar chart
/>
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 | App Router, SSR, routing |
| TypeScript | Type safety throughout |
| Chart.js + react-chartjs-2 | All charts |
| CSS Variables | Design tokens + theming |
| Inter + IBM Plex Mono | Typography |

---

## 📦 Build for Production

```bash
npm run build
npm start
```

Or deploy to Vercel with one click — zero config needed.
