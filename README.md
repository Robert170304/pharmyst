<p align="center">
  <img src="./public/placeholder-logo.svg" alt="Pharmyst Logo" width="120" />
</p>

## Pharmyst — Find Medicines Nearby

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/robert-macwans-projects/v0-next-js-frontend-build)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A modern web app to help users quickly locate pharmacies that stock specific medicines with near real-time availability. Pharmacies can register, verify, and manage their inventory via a simple dashboard, while users can search, filter, and find nearby options with location-aware results.

Built with a performant stack (Next.js, React, Tailwind CSS) and integrated with Google Places for precise location features.

---

## Table of Contents

- **[Features](#features)**
- **[Tech Stack](#tech-stack)**
- **[Installation & Setup](#installation--setup)**
- **[Usage](#usage)**
- **[Demo](#demo)**
- **[Contributing](#contributing)**
- **[License](#license)**
- **[Contact](#contact)**

## Features

- **Location-aware medicine search**: Find pharmacies near you that have your required medicines in stock.
- **Rich filters**: Filter by availability, category, manufacturer, expiry date, pharmacy, and radius.
- **Pharmacy dashboard**: Add, edit, and delete medicines; update weekly hours; manage store details.
- **Authentication & verification**: Pharmacy registration, email verification, secure login, and session handling.
- **Realtime UX touches**: Toast notifications, loading states, responsive layout, and accessible UI components.
- **Map and autocomplete**: Google Places powered address input; map-ready components included.

## Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI/Primitives, shadcn/ui components
- **State**: Zustand
- **Forms & Validation**: React Hook Form, Zod
- **Data & API**: Axios, REST APIs (`NEXT_PUBLIC_API_BASE_URL`)
- **Maps & Location**: Google Places API (via `@react-google-maps/api`), Places Autocomplete
- **Charts & Extras**: Recharts, date-fns, lucide-react icons

## Installation & Setup

### Prerequisites

- Node.js 18+ (recommended 18 LTS or newer)
- Yarn (preferred) or npm/pnpm

### 1) Clone the repository

```bash
git clone https://github.com/your-org/pharmyst.git
cd pharmyst
```

### 2) Install dependencies

```bash
yarn install
# or
npm install
```

### 3) Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
NEXT_PUBLIC_GOOGLE_PLACE_API_KEY=your_google_places_api_key
```

Notes:

- `NEXT_PUBLIC_API_BASE_URL` is the base URL of your backend API.
- `NEXT_PUBLIC_GOOGLE_PLACE_API_KEY` requires enabling the Places API in Google Cloud Console.

### 4) Run the development server

```bash
yarn dev
# or
npm run dev
```

Open `http://localhost:3000` in your browser.

### 5) Production build

```bash
yarn build && yarn start
# or
npm run build && npm start
```

## Usage

- **Search medicines**: Visit `/search`, enter a medicine name, and optionally allow location access or choose an address via autocomplete to get nearby results.
- **View pharmacy details**: Click a pharmacy card to see details at `/pharmacy/[id]`.
- **Pharmacy owners**: Register and manage inventory from the dashboard at `/dashboard` (add/edit/delete medicines, update weekly hours, update profile).

Example: programmatic search using the provided API helper

```ts
// lib/api.ts exposes searchMedicines(query)
// Example usage inside a React component or service
import { searchMedicines } from "@/lib/api";

async function fetchResults() {
  const results = await searchMedicines({
    name: "paracetamol",
    userLat: 19.076,
    userLng: 72.8777,
    category: "",
    availability: "in-stock",
    manufacturer: "",
    expiryDate: "",
    pharmacy: "",
    page: 1,
    limit: 10,
    radius: 10,
  });
  return results; // shape depends on backend response (data, pagination, etc.)
}
```

## Demo

- **Live demo**: [Vercel Project](https://vercel.com/robert-macwans-projects/v0-next-js-frontend-build)
- Preview:

<p align="center">
  <img src="./public/image.png" alt="Pharmyst Preview" width="800" />
</p>

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Guidelines:

- Keep changes focused and documented
- Match existing code style and linting
- Add or update documentation and types where needed

## License

This project is licensed under the **MIT License**.

## Contact

- Maintainer: Your Name
- Email: your.email@example.com
- Portfolio: https://your-portfolio.example.com

Replace the placeholders above with your actual contact and live demo links.
