# FPTV — IPTV Subscription Platform

A full‑stack IPTV subscription platform with an **Express + MongoDB backend** and a **React Native (Expo) mobile app**. Users register, pick a plan, pay via Stripe, and get automatically provisioned IPTV credentials on an XUI.ONE panel.

## Architecture

```
dev-fptv/
├── iptv-backend/       # Node.js + Express API server
└── SmartIPTV/          # React Native mobile app (Expo SDK 55)
```

### High‑Level Flow

```
User → SmartIPTV app → POST /api/subscriptions/checkout → Stripe session URL
                                                                    ↓
User completes payment on Stripe ←── opens in browser ←── Linking.openURL(url)
        ↓
Stripe webhook → POST /api/webhooks/stripe
                     ↓
          ┌─ Activate subscription (MongoDB)
          └─ Create IPTV account on XUI.ONE panel
                     ↓
App polls GET /api/subscriptions/status → gets iptvCredentials
                     ↓
App opens IPTV player with credentials
```

---

## Backend (`iptv-backend/`)

### Stack

- **Node.js** + **Express** — REST API
- **MongoDB** + **Mongoose** — data persistence
- **JWT** — access + refresh token auth
- **Stripe** — payment processing + webhooks
- **XUI.ONE** — IPTV account provisioning

### Quick Start

```bash
cd iptv-backend
npm install
cp .env.example .env      # fill in your values
npm run seed               # seed plan data into MongoDB
npm run dev                # http://localhost:5001
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| POST | /api/auth/refresh | — | Refresh access token |
| POST | /api/auth/logout | Yes | Logout |
| GET | /api/auth/me | Yes | Current user + IPTV status |
| GET | /api/plans | — | List all plans |
| POST | /api/subscriptions/checkout | Yes | Create Stripe checkout session |
| GET | /api/subscriptions/status | Yes | Poll for subscription + IPTV creds |
| POST | /api/subscriptions/cancel | Yes | Cancel subscription |
| POST | /api/webhooks/stripe | — | Stripe event webhook |

### Payment / Deep Link Flow

1. App calls `POST /api/subscriptions/checkout` → backend creates a Stripe session with `success_url` pointing to the backend's own `/payment/success` endpoint (a valid HTTP URL required by Stripe).
2. After payment, Stripe redirects to `GET /payment/success?session_id=xxx`.
3. That endpoint issues a **302 redirect** to `smartiptv://payment/success?session_id=xxx`.
4. The device OS opens the app via the registered `smartiptv://` deep link scheme.

| Env Var | Purpose |
|---------|---------|
| `STRIPE_REDIRECT_BASE_URL` | HTTP URL Stripe redirects to after checkout (e.g. `http://localhost:5001`) |
| `APP_DEEP_LINK` | Custom scheme the mobile app registers (e.g. `smartiptv://`) |

### Environment Variables

See `iptv-backend/.env.example` for the full list — MongoDB, Stripe keys, JWT secrets, XUI.ONE panel credentials.

### Production

```bash
npm install --production
pm2 start src/server.js --name iptv-backend
```

Configure a Stripe webhook at `https://yourdomain.com/api/webhooks/stripe` for events `checkout.session.completed` and `payment_intent.payment_failed`.

---

## Mobile App (`SmartIPTV/`)

### Stack

- **Expo SDK 55** with `expo-router` (file‑based routing)
- **React Native** 0.83.4
- **NativeWind** (Tailwind CSS)
- **Zustand** — state management
- **TanStack Query** — data fetching
- **React Hook Form** — form handling

### Quick Start

```bash
cd SmartIPTV
npm install
npx expo start            # press i / a / w for platform
```

Deep link scheme: `smartiptv://` (configured in `app.json`)

See `SmartIPTV/README.md` for detailed build and deployment instructions.

---

## Project Structure

```
dev-fptv/
├── iptv-backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas (User, Plan, Subscription, IptvAccount)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Stripe, XUI.ONE integration
│   │   ├── utils/           # Logger, response helpers, ApiError
│   │   └── server.js        # Express app entry point
│   ├── scripts/             # Seed scripts
│   ├── .env.example
│   └── package.json
│
└── SmartIPTV/
    ├── src/
    │   ├── app/             # Expo Router pages
    │   ├── components/      # Reusable UI
    │   ├── hooks/           # Custom hooks
    │   ├── services/        # API client
    │   ├── store/           # Zustand stores
    │   └── api/             # Axios config
    ├── app.json             # Expo config (scheme, plugins)
    └── package.json
```
