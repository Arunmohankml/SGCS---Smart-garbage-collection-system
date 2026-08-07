# CivicEye

**See It. Report It. Fix It.**

An intelligent, transparent civic-complaint platform that bridges citizens and municipal authorities. Citizens photograph and report public issues in seconds; municipalities manage, prioritize, and resolve them through a live dispatch console. AI assists at every stage and the community verifies each resolution.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Database Schema](#database-schema)
8. [API Routes](#api-routes)
9. [Component Library](#component-library)
10. [User Flows](#user-flows)
11. [Deployment](#deployment)

---

## Project Overview

CivicEye is a full-stack civic-tech application built with Next.js 15. It enables:

- **Citizens** to photograph public infrastructure issues, auto-tag GPS location, and submit complaints in under a minute
- **Municipal authorities** to view, filter, prioritize, and advance complaints through a dashboard
- **Community** to upvote issues and verify whether reported fixes are real
- **AI** to auto-categorize issues, detect spam, and compute priority scores

The platform uses a transparent public feed where every report is visible to everyone, creating accountability.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server-side rendering, API routes, file-based routing |
| **Language** | TypeScript | Type safety across the entire codebase |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS with custom design tokens |
| **UI Components** | Custom + Lucide React | Reusable primitives (Button, Badge, Logo) |
| **State Management** | React Context + Custom Hooks | Auth state, issues store with localStorage sync |
| **Database** | Supabase (PostgreSQL) | Primary data store for issues, profiles, votes |
| **Auth** | Firebase Authentication | Google Sign-In for citizens; mock auth for authorities |
| **Image Storage** | Cloudinary | Image upload, transformation, and CDN delivery |
| **Push Notifications** | Firebase Cloud Messaging | Notify citizens of status changes |
| **Maps** | Google Maps / Mapbox | Location picker and issue map view |
| **AI** | Placeholder (ready for OpenAI/Google Vision) | Image classification, spam detection, priority scoring |
| **Deployment** | Vercel | Serverless hosting with edge functions |

---

## Features

### For Citizens
- One-tap photo reporting with camera capture or gallery upload
- Auto GPS detection with manual fallback
- Category selection (pothole, garbage, water leakage, streetlight, drainage, road damage, other)
- Optional landmark and remarks fields
- Public feed with real-time filtering and search
- Upvote issues to increase priority
- Issue detail view with image gallery
- Community verification voting (fixed / still exists)

### For Municipalities
- Live department dashboard with KPI cards (open, in-progress, resolved)
- Department-wise filtering
- One-click status advancement (open → in progress → resolved)
- Thumbnail previews for each issue
- Live sync indicator

### For Everyone
- Transparent public feed with all reports
- AI priority scoring visible on every card
- Status badges with color coding
- Reference codes for tracking
- Responsive design (mobile + desktop)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js 15 App                       │
├─────────────────────────────────────────────────────────┤
│  App Router (pages + API routes)                        │
├─────────────────────────────────────────────────────────┤
│  Components Layer                                        │
│  ├── landing/ (13 marketing sections)                   │
│  ├── report/ (citizen reporting form)                   │
│  ├── issues/ (public feed + detail + voting)            │
│  ├── municipality/ (authority dashboard)                │
│  ├── auth/ (Firebase Google sign-in)                    │
│  └── ui/ (Button, Badge, Logo primitives)               │
├─────────────────────────────────────────────────────────┤
│  lib/ (business logic + clients)                        │
│  ├── auth.tsx (React Context: AuthProvider)             │
│  ├── issues-store.ts (custom hook + localStorage sync)  │
│  ├── supabase/ (browser + server clients)               │
│  ├── firebase/ (client + admin SDK)                     │
│  ├── mock.ts (static demo data)                         │
│  └── types.ts (domain types)                            │
├─────────────────────────────────────────────────────────┤
│  External Services                                       │
│  ├── Supabase (PostgreSQL + Auth)                       │
│  ├── Firebase (Auth + FCM)                              │
│  ├── Cloudinary (Image CDN)                             │
│  └── Google Maps / Mapbox (Location)                    │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Firebase project (for auth)
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/civiceye.git
cd civiceye

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
# → http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

### Required Variables

| Variable | Service | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Public anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Server-only service role key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary | Cloud name (e.g. `dtqeqyym4`) |
| `CLOUDINARY_API_KEY` | Cloudinary | API key |
| `CLOUDINARY_API_SECRET` | Cloudinary | API secret (server-only) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase | Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase | Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase | Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase | App ID |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Admin | JSON service account (single-line) |

### Optional Variables

| Variable | Service | Description |
|---|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary | Public cloud name (for client-side) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary | Unsigned upload preset |
| `NEXT_PUBLIC_MAPS_PROVIDER` | Maps | `google` or `mapbox` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps | Maps API key |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox | Mapbox access token |
| `NEXT_PUBLIC_APP_URL` | App | Canonical URL (default: `http://localhost:3000`) |

---

## Database Schema

### Tables

#### `public.profiles`
```sql
create table public.profiles (
  id          text primary key,                    -- Firebase Auth UID
  email       text not null,
  name        text,
  avatar_url  text,
  role        text not null default 'citizen' check (role in ('citizen', 'authority')),
  fcm_token   text,
  created_at  timestamptz not null default now()
);
```

#### `public.issues`
```sql
create table public.issues (
  id                    text primary key default gen_random_uuid()::text,
  reporter_id           text references public.profiles (id),
  reference             text unique,
  category              public.issue_category not null,
  title                 text not null,
  description           text,
  status                public.issue_status not null default 'open',
  location              text,                         -- PostGIS POINT string
  address               text,
  landmark              text,
  images                jsonb not null default '[]',  -- IssueImage[]
  department            text,
  ai_category_confidence numeric(4,3) default 0,
  ai_spam_score          numeric(4,3) default 0,
  ai_duplicate_of        text references public.issues (id),
  priority_score         smallint default 0,
  votes                  integer not null default 0,
  fixed_votes            integer not null default 0,
  still_exists_votes     integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  resolved_at            timestamptz
);
```

#### `public.resolution_votes`
```sql
create table public.resolution_votes (
  id        text primary key default gen_random_uuid()::text,
  issue_id  text not null references public.issues (id) on delete cascade,
  voter_id  text not null references public.profiles (id) on delete cascade,
  vote      text not null default 'fixed',
  created_at timestamptz not null default now(),
  unique (issue_id, voter_id)
);
```

### Enums

```sql
create type public.issue_category as enum (
  'pothole', 'garbage', 'water_leakage', 'streetlight', 'drainage', 'road_damage', 'other'
);

create type public.issue_status as enum (
  'open', 'in_progress', 'resolved', 'reopened', 'rejected'
);
```

### Indexes
```sql
create index issues_status_idx on public.issues (status);
create index issues_priority_idx on public.issues (priority_score desc);
```

### Triggers
- `set_updated_at` — Auto-updates `updated_at` on row changes
- `maybe_reopen` — Auto-reopens issue when `still_exists_votes >= 5`

### Row Level Security (RLS)
- **Issues**: Public read; authenticated insert only (`auth.uid()::text = reporter_id`)
- **Profiles**: Authenticated access
- **Resolution Votes**: Authenticated access

---

## API Routes

### `GET /api/issues`
Returns all issues ordered by priority score (descending), limited to 50.

**Response:**
```json
{
  "issues": [ { "id": "...", "category": "pothole", "status": "open", ... } ]
}
```

### `POST /api/issues`
Creates a new issue. Requires `location.lat`, `location.lng`, and `image`.

**Request Body:**
```json
{
  "image": "https://res.cloudinary.com/...",
  "category": "pothole",
  "landmark": "Near Metro Exit 2",
  "remarks": "Causing traffic delay",
  "location": { "lat": 13.0827, "lng": 80.2707 }
}
```

**Response:**
```json
{
  "id": "1234567890",
  "reference": "CE-26-7890",
  "status": "open",
  "ai": { "category": "pothole", "priorityScore": 70, ... }
}
```

### `PATCH /api/issues/[id]`
Updates issue status (used by municipality dashboard).

**Request Body:**
```json
{ "status": "in_progress" }
```

### `POST /api/issues/[id]/vote`
Records a citizen verification vote.

**Request Body:**
```json
{ "vote": "fixed" }
```

### `POST /api/upload`
Uploads an image to Cloudinary. Accepts `multipart/form-data` with a `file` field.

**Response:**
```json
{
  "url": "https://res.cloudinary.com/.../civiceye/abc123.jpg",
  "publicId": "civiceye/abc123",
  "width": 1600,
  "height": 1200
}
```

### `POST /api/auth/session`
Exchanges a Firebase ID token for a Supabase session.

### `POST /api/auth/logout`
Destroys the current session.

---

## Component Library

### UI Primitives (`components/ui/`)

| Component | Props | Description |
|---|---|---|
| `Button` | `variant?: "primary" \| "secondary" \| "ghost" \| "danger" \| "outline" \| "accent"`, `size?: "sm" \| "md" \| "lg"` | Action button with multiple variants |
| `Badge` | `children`, `className` | Generic badge wrapper |
| `StatusBadge` | `status: IssueStatus` | Colored status indicator with dot |
| `Logo` | `size?: "sm" \| "md"`, `className` | Brand logo mark with text |

### Landing Sections (`components/landing/`)

| Section | Description |
|---|---|
| `Hero` | Main headline + metrics widget + CTA |
| `Trusted` | Trusted-by logos / social proof |
| `Problem` | Problem statement with 3 pain-point cards |
| `HowItWorks` | 12-step citizen-to-resolution flow |
| `AiFeatures` | AI categorization, spam detection, priority engine |
| `DashboardPreview` | Live preview of the dashboard with sample data |
| `Community` | Community stats + verification flow |
| `Municipality` | Municipal features + CTA |
| `Stats` | Key metrics bar |
| `Roadmap` | Phase timeline (Q1-Q4 2026) |
| `Faq` | Accordion FAQ section |
| `Cta` | Final call-to-action |
| `Footer` | Links + copyright |

---

## User Flows

### Citizen Reporting Flow
```
1. Open /report
2. Take/upload photo (uploaded to Cloudinary via /api/upload)
3. Auto-detect GPS location
4. Select category, add landmark/remarks
5. Submit (POST /api/issues → Supabase)
6. Redirect to /issues (public feed)
```

### Municipality Dashboard Flow
```
1. Sign in at /municipality (mock auth)
2. View dashboard at /municipality/dashboard
3. Filter by department
4. Click "Dispatch Field Crew" or "Mark Fixed & Resolved"
5. Status updates via PATCH /api/issues/[id]
```

### Community Verification Flow
```
1. Browse public feed at /issues
2. Click issue card → detail view
3. If status is "resolved", vote "Fixed" or "Still Exists"
4. Vote recorded via POST /api/issues/[id]/vote
5. If 5+ "still_exists" votes, auto-reopen trigger fires
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Manual

```bash
npm run build
npm start
# → http://localhost:3000
```

---

## Notes

- Demo data in `lib/mock.ts` is used for landing page previews
- The `issues-store` merges localStorage custom issues with API data
- FCM messaging must only be initialized client-side
- Cloudinary API secret is never exposed to the browser
- All Supabase service role operations are server-side only

---

## License

MIT
