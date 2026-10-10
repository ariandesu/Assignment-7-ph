# BazarDor QA & Security Test Plan

## 1. Automated & Manual Test Matrix (Fail-Closed)

Status Key: `[ ]` Not Run | `[P]` Pass | `[F]` Fail | `[B]` Blocked

### 1.1 API Resilience & Failover Logic
| Test Case | Steps / Conditions | Expected Result (Fail-Closed) | Status |
| :--- | :--- | :--- | :--- |
| **API-01: Primary Success** | Fetch `/products` from `BASE_URL_1` (200 OK) | Data loads correctly, no failover triggered. | `[ ]` |
| **API-02: 5xx Sever Error** | Intercept `BASE_URL_1` and mock 500/502/503 | Seamless failover to `BASE_URL_2`; UI remains functional; no unhandled exceptions. If both fail, show friendly error state. | `[ ]` |
| **API-03: Network Timeout** | Delay `BASE_URL_1` response > 10s | Abort request, failover to `BASE_URL_2`; UI displays skeleton loaders during wait. | `[ ]` |
| **API-04: 4xx Client Error** | Request invalid endpoint (404) | Fail gracefully (log error, show empty state/404); do NOT auto-failover to secondary for 4xx errors. | `[ ]` |

### 1.2 Data Processing & Sorting (Bengali Numerals)
| Test Case | Steps / Conditions | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **SORT-01: Low to High** | Select `দাম: কম থেকে বেশি` | Items sorted correctly by numeric value, overriding string character codes (e.g., ৯ < ১০). | `[ ]` |
| **SORT-02: High to Low** | Select `দাম: বেশি থেকে কম` | Items sorted strictly descending by numeric value. | `[ ]` |
| **DATA-01: Formatting** | Inspect price and % change across all cards | Must render in Bengali font/digits (`১৪৮ টাকা`, `১,৮৫০ টাকা`). | `[ ]` |

### 1.3 Routing & Navigation
| Test Case | Steps / Conditions | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **NAV-01: Home Route** | Navigate to `/` | Navbar, Ticker, Hero, Risers, Fallers, All Products, and Footer visible. | `[ ]` |
| **NAV-02: Hero CTA** | Click primary CTA button on Hero | Smooth scroll to `#সব-পণ্য` without page reload. | `[ ]` |
| **NAV-03: Category Route** | Navigate to `/category/chal` | Specific category listed; active nav highlighted. | `[ ]` |
| **NAV-04: 404 Catch-All** | Navigate to `/invalid-url` | Custom 404 page with "হোম পেজে ফিরে যান" button. | `[ ]` |
| **NAV-05: Missing Slug** | Navigate to `/category/nonexistent` | Matches Empty category state with 404-style message and return button. | `[ ]` |

### 1.4 Authentication & Protected Routes
| Test Case | Steps / Conditions | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **AUTH-01: Guest Access** | Unauthenticated user visits `/product/1` | Intercepted -> Redirect to `/signin` -> Toast: "অনুগ্রহ করে প্রথমে সাইন ইন করুন". | `[ ]` |
| **AUTH-02: Sign In / Up** | Submit valid BetterAuth credentials | Session created -> Redirect to Home -> Success Toast. | `[ ]` |
| **AUTH-03: Social Login** | Click Google / GitHub OAuth | Handled by BetterAuth -> Redirect Home -> Success Toast. | `[ ]` |
| **AUTH-04: Session Persist**| Refresh while logged in | Session preserves; Navbar shows profile and sign-out button. | `[ ]` |
| **AUTH-05: Profile Update** | Submit Name change at `/profile/update` | BetterAuth session updated -> Confirm Toast -> Renders new name. | `[ ]` |

### 1.5 Loading, Empty States & Layout
| Test Case | Steps / Conditions | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **UI-01: Grid Loaders** | Throttle network to 'Slow 3G' | Skeleton cards display while fetching `/products` and `/categories`. | `[ ]` |
| **UI-02: Ticker** | Inspect marquee under Navbar | Infinite scroll behaves smoothly across full screen width. | `[ ]` |
| **UI-03: Color Badging** | Inspect price change badges | `▲` = Green, `▼` = Red, `—` = Gray text with WCAG AA contrast. | `[ ]` |

### 1.6 Responsive Breakpoints & Accessibility
| Test Case | Steps / Conditions | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **RES-01: Mobile Grid** | Viewport < 640px | 1 column layout; responsive header spacing; readable fonts. | `[ ]` |
| **RES-02: Tablet Grid** | Viewport > 640px and < 1024px | 2-3 column layout. | `[ ]` |
| **RES-03: Desktop Grid** | Viewport > 1024px | 3-4 column layout; `max-w-6xl` container bounded. | `[ ]` |
| **A11Y-01: Keyboard Nav** | Tab through UI | Focus rings visible on buttons, links, inputs. | `[ ]` |
| **A11Y-02: Screen Reader** | Screen reader enabled | `alt` tags on emojis/images; `aria-live` on ticker and toasts. | `[ ]` |

### 1.7 Production & Deployment
| Test Case | Steps / Conditions | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **PROD-01: Vercel Refresh**| Hard reload on `/category/[slug]` | Correctly renders route via dynamic handling (no hard 404). | `[ ]` |
| **PROD-02: Build Checks** | Run `npm run build` | Zero type errors, linting warnings, or strict mode faults. | `[ ]` |

## 2. Required Commands & Tools

### Local Environment Setup
```bash
npm install
npm run dev
```

### Static Analysis & Linter
```bash
npm run lint
npm run build
```

### OpenCodeReview QA Gate Mandate
Before merging or validating any code changes across branches, you MUST run this command at the root of the repository to satisfy the OpenCodeReview pre-approval gate.

#### Reviewing a specific pull request / branch diff:
```bash
ocr review --audience agent --format json --repo . --from main --to HEAD --output ~/.hermes/data/ocr/qa-engineer/bazardor_audit.json --concurrency 1 --timeout 15
```

#### Reviewing uncommitted local changes (working tree):
```bash
ocr review --audience agent --format json --repo . --output ~/.hermes/data/ocr/qa-engineer/bazardor_audit.json --concurrency 1 --timeout 15
```

*Note: Ensure `status` returns complete and identify any Security/Logic blockers from the JSON before approving merge or deployment.*
