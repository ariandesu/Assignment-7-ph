# বাজার দর (BazarDor) 🛒

**প্রতিদিনের বাজার দাম এক নজরে** - বাংলাদেশের সকল বাজারের আজকের পণ্যের দাম, দামের পরিবর্তন এবং ট্রেন্ড এক জায়গায়। স্মার্ট কেনাকাটা করুন।

## 📖 Project Description

BazarDor (বাজার দর) is a modern, responsive web application built with Next.js (App Router) that provides real-time market prices for daily commodities in Bangladesh. Users can browse products by category, view price trends (risers/fallers), and see detailed price breakdowns across different markets. The application features a clean Bengali interface with Hind Siliguri typography, making it accessible to local users.

## 🛠️ Technologies Used

- **Framework**: Next.js (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Typography**: Hind Siliguri (Google Fonts)
- **Authentication**: BetterAuth (Email/Password + Social Login with Google & GitHub)
- **Notifications**: React Hot Toast
- **Icons**: Lucide React / Heroicons
- **API Integration**: Primary & Fallback API endpoints with automatic failover
- **Deployment**: Vercel (Production Live)

## ✨ Key Features

1. **🏠 Responsive Homepage** - Hero section with CTA, price ticker (marquee), top 6 price risers, top 6 price fallers, and complete product grid with Bengali numerals
2. **📂 Category Pages** - Dynamic category filtering with sort controls (Default, Price Low to High, Price High to Low), skeleton loading states, and empty state handling
3. **📦 Product Detail Pages** - Protected routes showing product summary, price statistics (Min/Max/Avg), and market-wise price breakdowns
4. **🔐 Authentication System** - Sign In/Sign Up with email/password, Google & GitHub OAuth, toast notifications, and protected routes
5. **👤 User Profile** - Profile view with avatar, update information feature via BetterAuth, and sign out functionality
6. **🎨 Design System** - Complete UI component library with design tokens, Hind Siliguri typography, Bengali numeral support, and WCAG AA accessible components
7. **🔄 API Failover** - Automatic fallback from primary to secondary API endpoint on network/server errors
8. **♿ Accessibility** - Semantic HTML, ARIA labels, focus management, keyboard navigation, and screen reader support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bazardor-ui

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys and BetterAuth credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL_1=https://api.api-store.workers.dev/api/bazardor
NEXT_PUBLIC_API_URL_2=https://api.abcz.workers.dev/api/bazardor

# BetterAuth Configuration
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # Authentication API routes
│   ├── category/[slug]/   # Category pages
│   ├── product/[slug]/    # Product detail pages (protected)
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   ├── profile/           # User profile pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── loading.tsx        # Global loading UI
│   └── not-found.tsx      # 404 page
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Skeleton.tsx
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   ├── PriceTicker.tsx
│   │   └── Footer.tsx
│   └── home/              # Home-specific components
│       ├── Hero.tsx
│       └── ProductCard.tsx
├── lib/
│   ├── api.ts             # API client with failover
│   ├── auth.ts            # BetterAuth configuration
│   ├── design-tokens.ts   # Design system tokens
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript definitions
└── styles/
    └── globals.css        # Global styles & Tailwind
```

## 🌐 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /products` | All products |
| `GET /products?category={slug}` | Products by category |
| `GET /products/{id}` | Single product |
| `GET /categories` | All categories |
| `GET /categories/{slug}` | Category with products |

**Primary API**: `https://api.api-store.workers.dev/api/bazardor`  
**Fallback API**: `https://api.abcz.workers.dev/api/bazardor`

## 🎨 Design Tokens

The project uses a comprehensive design system defined in `src/lib/design-tokens.ts` including:

- **Colors**: Primary, Accent, Success, Danger, Warning, Neutral scales
- **Typography**: Hind Siliguri font with responsive sizing
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corners
- **Shadows**: Elevation levels
- **Animations**: Marquee, fade-in, slide-up, pulse
- **Breakpoints**: Mobile, Tablet, Desktop, Large Desktop

## ♿ Accessibility Features

- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels and roles for dynamic content
- Focus-visible outlines for keyboard navigation
- WCAG AA color contrast compliance
- Screen reader compatible price ticker (aria-live)
- Bengali language support (`lang="bn"`)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (1 column grid)
- **Tablet**: 640px - 1024px (2 column grid)
- **Desktop**: 1024px - 1280px (3 column grid)
- **Large Desktop**: > 1280px (4 column grid)

## 🔐 Authentication Flow

1. User visits `/signin` or `/signup`
2. Email/password or social login (Google/GitHub)
3. BetterAuth creates session
4. Protected routes (`/product/[slug]`, `/profile`, `/profile/update`) check session
5. Unauthenticated users redirected to `/signin` with toast notification
6. Profile update via BetterAuth's `updateUser` API

## 🚀 Deployment

The application is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Cloudflare Pages**

Build command: `npm run build`  
Output directory: `.next`

## 📄 License

This project is created for educational purposes (Programming Hero Assignment 7).

## 🔗 Links

- **Live Demo**: [https://bazardor-assignment-7.vercel.app](https://bazardor-assignment-7.vercel.app)
- **Repository**: [https://github.com/ariandesu/Assignment-7-ph](https://github.com/ariandesu/Assignment-7-ph)

---

Made with ❤️ for Bangladesh's smart shoppers