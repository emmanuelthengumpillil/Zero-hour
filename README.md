# ⚡ Zero Hour

An enterprise-ready, real-time email engagement platform built with **Next.js 14**, **Python 3.14 (FastAPI)**, **Resend**, and **Supabase (PostgreSQL)**, featuring fine-grained 3-tier **Role-Based Access Control (RBAC)**, an interactive **drag-and-drop customer conversion pipeline**, a customizable **email studio with live preview and pre-send confirmation**, and production-grade resilience patterns.

---

## 🏗️ Architecture & Technology Stack

- **Frontend & App Framework:** Next.js 14 (App Router, React 18, Tailwind CSS, Lucide React, Canvas Confetti)
- **Analytics & Scoring Microservice:** Python 3.14 (FastAPI, Uvicorn, Pydantic)
- **Email Infrastructure:** Resend API with Circuit Breakers, Exponential Backoff, Rate Limiting, and Graceful Sandbox Fallbacks
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) & Google OAuth 2.0 PKCE flow
- **Hosting:** Vercel

---

## 👥 Fine-Grained Role-Based Access Control (RBAC)

| Role | Hierarchy Level | Capabilities & Access Scope |
| :--- | :--- | :--- |
| **Software Owner** (`software_owner`) | **Level 1** | **Global Superuser**: Full access across all tenants, circuit breaker telemetry, security audits, and administrative overrides. |
| **Business Owner / Admin** (`business_admin`) | **Level 2** | **Workspace Control**: Plays with the drag-and-drop demo pipeline, customizes email templates, executes dispatches with confirmation prompts, views business conversion analytics, and delegates employees. |
| **Employee** (`employee`) | **Level 3** | **Scoped Operations**: Adds new contact prospects, views customer directories, and inspects delivery audit logs. Resticted from deleting templates or altering administrative settings. |

---

## 🛡️ Production-Ready Reliability & Security

1. **Data Protection at Rest & Transit:**
   - Sensitive email payloads and contact metadata are encrypted using **AES-256-GCM** before persistence.
   - **TLS 1.3** is enforced via strict HTTP security headers (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`).
   - Zero hardcoded secrets; configuration validated through `.env.local`.

2. **Input Validation & Sanitization:**
   - Server-side payload validation powered by **Zod**.
   - Strict HTML escaping and tag sanitization mitigating **XSS** and **email header injection**.
   - Parameterized queries and PostgreSQL RLS protecting against **SQL Injection**.

3. **Circuit Breaker Pattern:**
   - Integrated state machine (`CLOSED` &rarr; `OPEN` &rarr; `HALF_OPEN`) protecting against cascading failures during downstream Resend, Supabase, or Python engine outages.

4. **Graceful Fallbacks & Degradation:**
   - Operates in **Live Mode** when credentials (`RESEND_API_KEY`, Supabase) are supplied.
   - Gracefully degrades into an authentic **Sandbox Simulation Mode** with realistic logs and zero crashes if offline or unconfigured.

5. **Rate Limiting & Exponential Backoff:**
   - Token-bucket sliding window limiter restricting requests per IP/user.
   - Automatic retry logic with randomized jitter on transient network/API errors.

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. (Optional) Run Python Analytics Microservice
```bash
python -m uvicorn backend_py.main:app --port 8000 --reload
```
*Note:* The Next.js app has built-in graceful degradation: if the Python service is offline, local fallback scoring is automatically applied!

### 3. Run Automated Security & Resilience Tests
```bash
node scripts/verify_security.js
python scripts/test_python_backend.py
```

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Key Project Structure

```
zero-hour/
├── src/
│   ├── app/
│   │   ├── demo/page.tsx               # Drag & Drop Pipeline (Contacts -> Customers)
│   │   ├── builder/page.tsx            # Email Content Studio & Confirmation
│   │   ├── dashboard/
│   │   │   ├── owner/page.tsx          # Level 1: Software Owner Telemetry
│   │   │   ├── admin/page.tsx          # Level 2: Business Admin Command Center
│   │   │   └── employee/page.tsx       # Level 3: Employee Directory & Logs
│   │   ├── api/
│   │   │   ├── email/send/route.ts     # Protected Resend email dispatch route
│   │   │   ├── analytics/route.ts      # Python service bridge with fallback
│   │   │   └── health/route.ts         # Circuit breaker & security status
│   │   ├── auth/callback/route.ts      # OAuth 2.0 PKCE callback
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── demo/
│   │   │   ├── DragDropBoard.tsx       # Interactive 2-box conversion board
│   │   │   └── ContactCard.tsx         # Tactile draggable card
│   │   ├── builder/
│   │   │   ├── TemplateEditor.tsx      # Email customizer & deliverability scorer
│   │   │   ├── LivePreview.tsx         # Live Desktop & Mobile previewer
│   │   │   └── ConfirmModal.tsx        # Pre-send safety confirmation dialog
│   │   └── shared/
│   │       ├── AuthContext.tsx         # Session state & interactive role switcher
│   │       └── Navbar.tsx              # Brand nav & RBAC switcher
│   └── lib/
│       ├── security/
│       │   ├── encryption.ts           # AES-256-GCM data protection
│       │   └── sanitize.ts             # Input sanitization & XSS filter
│       ├── resilience/
│       │   ├── circuitBreaker.ts       # Circuit breaker state machine
│       │   ├── rateLimiter.ts          # Sliding window token bucket
│       │   └── retry.ts                # Exponential backoff with jitter
│       └── email/
│           └── resendClient.ts         # Resend SDK client with sandbox mode
├── backend_py/
│   ├── analytics.py                    # Deliverability & usage analytics engine
│   ├── main.py                         # FastAPI microservice
│   └── requirements.txt
└── supabase/
    └── schema.sql                      # PostgreSQL schema, RLS policies, RBAC roles
```
