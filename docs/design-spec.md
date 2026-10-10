# BazarDor (বাজার দর) — Technical Design & Visual Handoff Specification

## Executive Summary
This document defines the visual architecture, component hierarchy, design tokens, Bengali content localization, responsive layout rules, and API resilience acceptance criteria for **BazarDor (বাজার দর)**. It bridges the Figma/Penpot design assets with frontend development requirements to ensure 100% fidelity across mobile, tablet, and desktop viewports.

---

## 1. Route & Frame Inventory

| Route Path | Frame Name (Penpot / Figma) | Access Level | Key UI Components & Layout Behavior |
| :--- | :--- | :--- | :--- |
| `/` | `Home`, `Home - User Menu Open` | Public | Top Navbar, Price Ticker Marquee, Hero Banner with CTA, Risers (`আজ দাম বেড়েছে ▲`), Fallers (`আজ দাম কমেছে ▼`), All Products Grid (`#সব-পণ্য`), Footer. |
| `/category/[slug]` | `Category`, `Grid`, `Filter Chip` | Public | Navbar, Price Ticker, Category Header Banner, Active Category Filter Chip, Price Sort Dropdown, Skeleton Loader / Product Card Grid, Footer. |
| `/product/[slug]` | `Product Details`, `Table`, `Stats` | Protected (Requires Auth) | Product Emoji & Title Header, Summary Stat Cards (Min, Max, Avg), Detailed Market Price Breakdown Table, Back Link, Footer. Unauthenticated access redirects to `/signin` with toast: *"অনুগ্রহ করে প্রথমে সাইন ইন করুন"*. |
| `/signin` | `Sign In`, `Form`, `Social Login Button` | Public | Auth Layout, Header Logo, Sign In Card (Email/Password), Google & GitHub OAuth Buttons, Redirect Link to `/signup`. |
| `/signup` | `Sign Up`, `Form`, `Social Login Button` | Public | Auth Layout, Header Logo, Sign Up Card (Name/Email/Password), Google & GitHub OAuth Buttons, Redirect Link to `/signin`. |
| `/profile` | `Profile`, `User Menu` | Protected (Requires Auth) | User Profile Card (Avatar/Initials, Name, Email), Edit Profile CTA Button (`প্রোফাইল আপডেট`), Sign Out Button. |
| `/profile/update` | `Profile`, `Form` | Protected (Requires Auth) | Form with Name input field, Save Changes Button, Cancel Button, Success/Failure Toast Notifications. |
| `/#সব-পণ্য` | `Hero Content` (CTA Anchor) | Public | Anchor link on Hero CTA button. Triggers smooth scroll directly to `#সব-পণ্য` section on homepage without page reload or route transition. |
| `404 / Catch-all` | `Text Block`, `Button / Primary` | Public | Centered 404 message: *"পৃষ্ঠাটি পাওয়া যায়নি"*, primary return button redirecting to `/` (*"হোম পেজে ফিরে যান"*). |

---

## 2. Design Tokens & Visual Hierarchy

### 2.1 Color Tokens (Extracted from Penpot `tokens.json`)

#### Base & Neutral Palette
- **`base-100` (Background Canvas)**: `rgb(250, 252, 250)` / `#FAFCFA` — Clean, soft off-white background.
- **`base-200` (Card & Surface)**: `rgb(240, 245, 240)` / `#F0F5F0` — Card containers, neutral badges, table alternating rows.
- **`base-300` (Borders & Dividers)**: `rgb(225, 232, 225)` / `#E1E8E1` — Component borders, input outlines, table stroke.
- **`base-content` (Primary Text)**: `rgb(29, 39, 31)` / `#1D271F` — High-contrast charcoal text for body, headings, and data tables.
- **`white`**: `rgb(255, 255, 255)` / `#FFFFFF` — Button surface, input field backgrounds, card highlights.

#### Brand Primary Palette
- **`primary` (Brand Main)**: `rgb(5, 137, 62)` / `#05893E` — Primary CTAs, active nav indicators, price tickers, brand highlights.
- **`primary.strong`**: `rgb(4, 127, 57)` / `#047F39` — Hover/Focus state for primary buttons.
- **`hover.primary-border`**: `rgb(3, 115, 51)` / `#037333` — Focus ring & outline border for interactive primary elements.
- **`hover.link-primary`**: `rgb(2, 100, 43)` / `#02642B` — Text link hover state.

#### Semantic Status & Market Movement Tokens
- **`success` (Price Risers / Up ▲)**: `rgb(26, 153, 81)` / `#1A9951` — Green price rise badges, positive percentage indicators.
- **`error` (Price Fallers / Down ▼)**: `rgb(208, 55, 57)` / `#D03739` — Red price fall badges, negative percentage indicators.
- **`hover.error-border`**: `rgb(176, 45, 47)` / `#B02D2F` — Border highlights for error states and destructive actions.
- **`hover.neutral-bg`**: `rgb(218, 222, 218)` / `#DADEBA` — Subtle hover state for neutral buttons and list items.
- **`hover.neutral-border`**: `rgb(204, 208, 204)` / `#CCD0CC` — Border state for secondary inputs.

---

## 3. Typography Specifications & Digit Rules

### 3.1 Font Family & Fallbacks
- **Primary Font**: `Hind Siliguri`, `Noto Sans Bengali`, system-ui, `-apple-system`, `sans-serif`.
- **Text Rendering**: Subpixel antialiased, optimized for Bangla script rendering legibility across low and high DPI screens.

### 3.2 Typography Scale
- **Display Heading (Hero Title)**: 32px – 36px | Bold (700) | Line-Height: 1.25
- **Page Heading (H1 / Section Titles)**: 24px – 28px | SemiBold (600) | Line-Height: 1.3
- **Card / Subsection Header (H2)**: 18px – 20px | SemiBold (600) | Line-Height: 1.35
- **Body Text**: 14px – 16px | Regular (400) | Line-Height: 1.5
- **Caption & Meta Labels**: 12px – 13px | Regular (400) / Medium (500) | Line-Height: 1.4
- **Ticker & Badge Text**: 12px – 14px | Medium (500) / Bold (700) | Line-Height: 1.2

### 3.3 Digit Formatting Requirement
All numeric representations in the application UI — including product prices (`১৪৮ টাকা`), percentage changes (`▲ ২.১%`, `▼ ১.৫%`), daily dates, and table indices — **MUST** be converted to Bengali numerals (`০`, `১`, `২`, `৩`, `৪`, `৫`, `৬`, `৭`, `৮`, `৯`).

---

## 4. Shared Component Specifications

### 4.1 Header / Navbar (`Nav`, `Nav / Category Chip`, `User Menu`)
- **Left Region**: Logo icon (`logo-icon.png` or `🛒`) + Brand title `বাজার দর` + Dynamic Bengali Date string underneath (e.g., `২৪ আশ্বিন, ১৪৩১`).
- **Center Region**: Horizontal category filter bar (`চাল`, `ডাল`, `তেল`, `সবজি`, `মাছ/মাংস`, `মসলা`, `অন্যান্য`). Active category renders with `primary` background pill (`rgb(5, 137, 62)`) and white text.
- **Right Region**:
  - **Unauthenticated**: `সাইন ইন` (Ghost/Outline button) + `সাইন আপ` (Primary button).
  - **Authenticated**: User Avatar / Initials badge with dropdown menu containing `প্রোফাইল`, `প্রোফাইল আপডেট`, and `সাইন আউট`.

### 4.2 Price Ticker Marquee (`Ticker`, `Ticker Track`, `Ticker / Item`)
- Continuous, seamless horizontal scrolling strip placed immediately underneath the main navbar.
- **Item Syntax**: `[Emoji] [Product Name] [Price in Bengali] টাকা/[Unit] [▲/▼ Percentage in Bengali]`
- **Color Coding**: Risers show green text (`#1A9951`), Fallers show red text (`#D03739`).
- **Accessibility**: Includes `aria-live="off"` or pause-on-hover capability for screen reader compliance.

### 4.3 Hero Banner (`Hero`, `Hero Content`, `bazar-hero 1`)
- **Eyebrow**: `দৈনন্দিন বাজার দর পর্যবেক্ষণ`
- **Main Heading**: `আজকের সঠিক বাজার দর জানুন এক ক্লিকে`
- **Subtitle**: `বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের নির্ভরযোগ্য এবং হালনাগাদ বাজার দর সংক্রান্ত যাবতীয় তথ্য।`
- **Primary CTA**: Button with label `আজকের দরদাম দেখুন`. Clicking scrolls smoothly to anchor `#সব-পণ্য` on the homepage without route changes.
- **Asset**: Right-aligned Hero image `bazar-hero.png`.

### 4.4 Price Movers Sections (`Section / Price Movers`, `Product Card`)
- **Section A ("আজ দাম বেড়েছে ▲")**: Horizontal flex / grid of top 6 product cards experiencing the highest price increase. Green change badge `▲ X.X%`.
- **Section B ("আজ দাম কমেছে ▼")**: Horizontal flex / grid of top 6 product cards experiencing the highest price decrease. Red change badge `▼ X.X%`.

### 4.5 Product Card (`Product Card`, `Card Body`)
- **Content**:
  - Top: Emoji icon (`🌾`, `🧅`, `🥔`, `🥩`, etc.) + Product Title (`মিনিকেট চাল`).
  - Unit badge: `প্রতি কেজি` / `প্রতি লিটার`.
  - Current Price: Large Bengali text (e.g., `৭৫ টাকা`).
  - Price Change Badge: `▲ ২.৫%` (Green) or `▼ ১.২%` (Red).
- **Interactions**: Clicking card navigates to `/product/[slug]`. If unauthenticated, user is redirected to `/signin` with a toast alert.

### 4.6 Category Page & Sorting (`Filter Chip`, `Select`)
- Displays category title and category icon header.
- **Sorting Control**: Dropdown select with 3 options:
  1. `ডিফল্ট` (Default API order)
  2. `দাম: কম থেকে বেশি` (Ascending price sort based on numeric parsing)
  3. `দাম: বেশি থেকে কম` (Descending price sort based on numeric parsing)
- **Empty State**: When category returns 0 products, displays icon + message: *"এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি"*.

### 4.7 Product Details View (`Product Details`, `Table`, `Stats`)
- **Header**: Large emoji, product name in Bangla, category tag, unit indicator.
- **Price Summary Stats Grid**: 3 summary stat cards:
  - `সর্বনিম্ন দাম`: Min price across all markets (`XX টাকা`).
  - `সর্বোচ্চ দাম`: Max price across all markets (`YY টাকা`).
  - `গড় দাম`: Calculated average price (`ZZ টাকা`).
- **Market Daily Price Breakdown Table**:
  - Columns: `বাজারের নাম` (Market Name), `আজকের দাম` (Today's Price), `পূর্বের দাম` (Previous Price), `পরিবর্তন` (Change badge).

---

## 5. Bengali Text Labels Dictionary

```json
{
  "brand": {
    "name": "বাজার দর",
    "logo_text": "🛒 বাজার দর",
    "tagline": "নিত্যপ্রয়োজনীয় পণ্যের সঠিক বাজার দর"
  },
  "nav": {
    "categories": "ক্যাটাগরি",
    "all_products": "সব পণ্য",
    "signin": "সাইন ইন",
    "signup": "সাইন আপ",
    "signout": "সাইন আউট",
    "profile": "প্রোফাইল",
    "update_profile": "প্রোফাইল আপডেট"
  },
  "hero": {
    "eyebrow": "দৈনন্দিন বাজার দর পর্যবেক্ষণ",
    "title": "আজকের সঠিক বাজার দর জানুন এক ক্লিকে",
    "subtitle": "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের নির্ভরযোগ্য এবং হালনাগাদ বাজার দর সংক্রান্ত যাবতীয় তথ্য।",
    "cta": "আজকের দরদাম দেখুন"
  },
  "sections": {
    "risers": "আজ দাম বেড়েছে ▲",
    "fallers": "আজ দাম কমেছে ▼",
    "all_items": "সব পণ্য"
  },
  "sort": {
    "label": "ক্রমানুসারে সাজান:",
    "default": "ডিফল্ট",
    "price_asc": "দাম: কম থেকে বেশি",
    "price_desc": "দাম: বেশি থেকে কম"
  },
  "units": {
    "kg": "প্রতি কেজি",
    "liter": "প্রতি লিটার",
    "hali": "প্রতি হালি",
    "dozen": "প্রতি ডজন",
    "pair": "প্রতি জোড়া",
    "piece": "প্রতি পিস"
  },
  "product_details": {
    "min_price": "সর্বনিম্ন দাম",
    "max_price": "সর্বোচ্চ দাম",
    "avg_price": "গড় দাম",
    "market_name": "বাজারের নাম",
    "today_price": "আজকের দাম",
    "prev_price": "পূর্বের দাম",
    "change": "পরিবর্তন"
  },
  "messages": {
    "auth_required": "অনুগ্রহ করে প্রথমে সাইন ইন করুন",
    "empty_category": "এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি",
    "not_found": "পৃষ্ঠাটি পাওয়া যায়নি",
    "back_home": "হোম পেজে ফিরে যান"
  }
}
```

---

## 6. Responsive Layout & Viewport Rules

- **Mobile Viewport (< 640px)**:
  - Navbar collapses secondary category links into a horizontally scrollable chip row or mobile menu.
  - Ticker marquee remains active at top.
  - Hero banner renders full width with text centered above `bazar-hero.png`.
  - Product grids render in single-column layout (`grid-cols-1`).
  - Stat summary cards stack vertically (`1 column`).
- **Tablet Viewport (640px – 1024px)**:
  - Product grids expand to 2 columns (`grid-cols-2`).
  - Hero section displays side-by-side elements with reduced image scaling.
  - Category header and sort dropdown align horizontally.
  - Market breakdown table fits with responsive horizontal scroll wrapper.
- **Desktop Viewport (> 1024px)**:
  - Product grids expand to 3 or 4 columns (`grid-cols-3 xl:grid-cols-4`).
  - Hero section presents full dual-column split: left copy content + right asset container (`bazar-hero.png`).
  - Max container width capped at `1280px` (`max-w-7xl mx-auto px-4`).

---

## 7. API Integration & Resilience Acceptance Criteria

### 7.1 Endpoint Mapping
- `GET /products`: Fetch all commodity items.
- `GET /products?category={slug}`: Fetch products filtered by category slug.
- `GET /products/{id}`: Fetch detailed breakdown for single commodity item.
- `GET /categories`: Fetch list of all categories.
- `GET /categories/{slug}`: Fetch metadata for a specific category.

### 7.2 Failover Acceptance Checks

```
                    +--------------------------------+
                    |  Client API Data Request       |
                    +---------------+----------------+
                                    |
                                    v
                    +---------------+----------------+
                    | Try Primary Base URL (BASE 1)  |
                    | api.api-store.workers.dev      |
                    +---------------+----------------+
                                    |
                        +-----------+-----------+
                        |                       |
                 [ HTTP 200 OK ]         [ Timeout / 5xx / Network Fail ]
                        |                       |
                        v                       v
            +-----------+----------+   +--------+-----------------------+
            | Render Response Data |   | Failover to Fallback (BASE 2)  |
            +----------------------+   | api.abcz.workers.dev           |
                                       +--------+-----------------------+
                                                |
                                    +-----------+-----------+
                                    |                       |
                             [ HTTP 200 OK ]         [ Hard Error ]
                                    |                       |
                                    v                       v
                        +-----------+----------+   +--------+------------------+
                        | Render Response Data |   | Render Error Skeleton /   |
                        +----------------------+   | UI Error State Message   |
                                                   +--------------------------+
```

1. **Automatic Failover Execution**:
   - Primary Base URL: `https://api.api-store.workers.dev/api/bazardor`
   - Fallback Base URL: `https://api.abcz.workers.dev/api/bazardor`
   - The application client MUST make all data calls against `BASE_URL_1` initially.
   - If `BASE_URL_1` returns network error, timeout, or 5xx server status, client automatically retries seamless fetch against `BASE_URL_2` without showing runtime error popups.
2. **Skeleton Loading States**:
   - While API request (Primary or Fallback) is pending, component slots MUST render Tailwind/daisyUI skeleton pulse loaders for product cards, tables, and stats.
3. **Bengali Digit Parsing for Price Sorting**:
   - Sorting functions MUST convert Bengali digit strings to standard JavaScript floating point numbers before running sort algorithms, ensuring `দাম: কম থেকে বেশি` and `দাম: বেশি থেকে কম` yield correct numeric ordering.
