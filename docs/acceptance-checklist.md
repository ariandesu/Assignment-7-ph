# BazarDor (বাজার দর) — Implementation & Acceptance Checklist

## Document Overview
This document serves as the official Product Manager & Scrum Master Acceptance Checklist for the **BazarDor (বাজার দর)** web application (Assignment 7). All user stories, functional capabilities, interface specifications, and technical standards listed below must be verified prior to sign-off and deployment.

---

## 1. Routes & Navigation Requirements
- [ ] **Home Route (`/`)**: Displays full homepage containing Navbar, Price Ticker, Hero Section, Top Risers, Top Fallers, All Products Grid, and Footer.
- [ ] **Hero CTA Anchor (`/#সব-পণ্য`)**: Clicking the primary Hero CTA button scrolls smoothly down to the `#সব-পণ্য` section on the same page without performing a page refresh or route redirection.
- [ ] **Category Filter Route (`/category/[slug]`)**: Displays filtered products belonging to the selected category, category title, category icon, sorting controls, card grid, and skeleton loading state.
- [ ] **Product Details Route (`/product/[slug]`)**: Protected route displaying product summary (emoji, name, unit, description, category tags), price statistics (Min, Max, Avg), and market-wise daily price breakdown.
- [ ] **Authentication Routes (`/signin`, `/signup`)**:
  - [ ] `/signin`: Form with Email, Password, Sign In button, Social Logins, and Sign Up navigation link.
  - [ ] `/signup`: Form with Name, Email, Password, Sign Up button, Social Logins, and Sign In navigation link.
- [ ] **Profile & Settings Routes (`/profile`, `/profile/update`)**:
  - [ ] `/profile`: Displays logged-in user profile details (Name, Email, Avatar/Placeholder).
  - [ ] `/profile/update`: Displays input field for Name modification and submission button to update user details via BetterAuth.
- [ ] **404 / Catch-all Handling (`/category/invalid`, `/product/unknown`, etc.)**:
  - [ ] Displays a user-friendly error state when an invalid route or missing item slug is accessed.
  - [ ] Includes a primary "হোম পেজে ফিরে যান" (Return to Home) CTA button redirecting to `/`.

---

## 2. Data & API Integration
- [ ] **Primary & Fallback API Architecture**:
  - [ ] **Primary API Base URL**: `https://api.api-store.workers.dev/api/bazardor`
  - [ ] **Fallback API Base URL**: `https://api.abcz.workers.dev/api/bazardor`
  - [ ] **Primary-then-Fallback Failover Logic**: The application MUST initiate all data requests against `BASE_URL_1`. If `BASE_URL_1` experiences network failure, timeout, or 5xx server errors, the client MUST automatically and seamlessly fail over to `BASE_URL_2` without throwing unhandled UI errors.
- [ ] **API Endpoint Coverage**:
  - [ ] `GET /products`: Fetches all commodity products.
  - [ ] `GET /products?category={category}`: Fetches products filtered by category slug.
  - [ ] `GET /products/{id}` or `/products/{slug}`: Fetches single product details.
  - [ ] `GET /categories`: Fetches all category metadata.
  - [ ] `GET /categories/{slug}`: Fetches single category metadata.
- [ ] **Data Processing & Formatting**:
  - [ ] Prices and percentages render using Bengali numerals (e.g., `১৪৮ টাকা`, `▲ ২.১%`).
  - [ ] Numeric sorting accounts for Bengali digit strings (correctly parsing price numeric values for sorting algorithms).
- [ ] **Loading & Empty States**:
  - [ ] Displays skeleton loaders across grids and detail cards while API calls are pending.
  - [ ] Displays appropriate empty state messaging when a category returns 0 items.

---

## 3. Authentication & Protected Routes
- [ ] **BetterAuth Integration**: Authentication state managed robustly via BetterAuth client SDK.
- [ ] **Protected Route Enforcement**:
  - [ ] Accessing `/product/[slug]`, `/profile`, or `/profile/update` without active session redirects immediately to `/signin`.
  - [ ] Emits a toast notification informing the user: "অনুগ্রহ করে প্রথমে সাইন ইন করুন".
- [ ] **Social Authentication**:
  - [ ] Google & GitHub OAuth sign-in options present on `/signin` and `/signup`.
  - [ ] Successful social sign-in redirects to Home (`/`).
- [ ] **Profile Update Feature**:
  - [ ] Form on `/profile/update` allows modifying user's Name.
  - [ ] Submitting updates user session info via BetterAuth and displays confirmation toast.
- [ ] **Toast Feedback System**:
  - [ ] `react-hot-toast` / toast notifications fire on Sign In success, Sign Up success, Sign Out, Profile Update, and Auth errors.

---

## 4. Responsive UI & Visual Design
- [ ] **Cross-Device Responsiveness**: Layout adjusts dynamically across Mobile (<640px), Tablet (640px-1024px), and Desktop (>1024px) viewports without horizontal scroll overflow.
- [ ] **Header / Navbar**:
  - [ ] Left alignment: Logo (`🛒 বাজার দর`) + dynamic Bangla date indicator.
  - [ ] Center alignment: Category links with distinct visual highlighting for active category link.
  - [ ] Right alignment: Auth status buttons (`সাইন ইন` + `সাইন আপ` when unauthenticated; Profile avatar / Sign Out button when authenticated).
- [ ] **Price Ticker (Marquee)**:
  - [ ] Infinite scrolling ticker positioned immediately below Navbar.
  - [ ] Content format: `[emoji] [name] [দাম টাকা/একক] [▲/▼ %]`.
- [ ] **Hero Banner**:
  - [ ] Eyebrow text, main heading, subtitle, right-aligned banner asset (`bazar-hero.png`), and smooth-scroll CTA (`#সব-পণ্য`).
- [ ] **Homepage Product Sections**:
  - [ ] **Section A ("আজ দাম বেড়েছে ▲")**: Top 6 risers with green badges.
  - [ ] **Section B ("আজ দাম কমেছে ▼")**: Top 6 fallers with red badges.
  - [ ] **Section C ("সব পণ্য")**: Comprehensive responsive product grid with cards showing emoji, name, unit line, price in Bengali digits, and change badge.
- [ ] **Category Page Sorting**:
  - [ ] Dropdown / button group with options: `ডিফল্ট`, `দাম: কম থেকে বেশি`, `দাম: বেশি থেকে কম`.
- [ ] **Footer**:
  - [ ] Includes site mission statement on the left and price variation disclaimer on the right.

---

## 5. Accessibility (a11y) Requirements
- [ ] **Semantic HTML**: Structural hierarchy enforced using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
- [ ] **Interactive Focus & Keyboard Nav**: All CTA buttons, navigation links, and inputs support keyboard tab focus with visible focus rings.
- [ ] **ARIA & Screen Readers**:
  - [ ] Image elements include meaningful `alt` text (e.g., `alt="বাজার দর লোগো"`).
  - [ ] Live price ticker and dynamic toast banners utilize appropriate `aria-live` or `role` attributes.
- [ ] **Color Contrast**: Text labels and change badges meet minimum WCAG AA contrast standards (high contrast green/red/gray text against backgrounds).

---

## 6. Deployment Requirements
- [ ] **Hosting Environment**: Deployed cleanly on Vercel, Netlify, or Cloudflare Pages.
- [ ] **Console & Build Health**: Zero terminal/build errors during production bundling and zero runtime browser console errors.
- [ ] **Dynamic Slug Refresh Handling**: Directly reloading dynamic routes (`/product/[slug]`, `/category/[slug]`, `/signin`) in production resolves correctly without landing on host 404 pages.

---

## 7. Git & README Requirements
- [ ] **Git Commits**: Project repository contains a minimum of 8 commits with clear, descriptive commit messages documenting iterative progress.
- [ ] **Documentation (`README.md`)**:
  - [ ] Project Name (`বাজার দর - BazarDor`).
  - [ ] Comprehensive Project Description.
  - [ ] Complete Technologies Used section (Next.js, Tailwind CSS, BetterAuth, etc.).
  - [ ] Minimum 5 Key Features detailed with concise descriptions.
  - [ ] Live Application URL & Repository Links included.
