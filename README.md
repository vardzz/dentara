# Dentara 🦷
### Where Care Meets Career

Dentara is a specialized B2B2C clinical requirement platform designed to tackle the dental quota crisis in the Philippines. It connects dentistry students directly with pre-screened indigent patients, streamlining the path to licensure and graduation.

## 🚀 Key Features
- **Smart Quota Matching**: Algorithmically pair syllabus requirements with patient needs.
- **AI Digital Triage**: Powered by Google Gemini to pre-screen patient complaints in Tagalog/English.
- **LGU Partnerships**: Batch-scheduling and community oversight to prevent patient "ghosting".
- **Institutional Dashboard**: Comprehensive oversight for clinical coordinators and university administrators.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase) via Prisma
- **Auth**: Auth.js (NextAuth v5)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project (PostgreSQL)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vardzz/dentara.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```
4. Push the database schema:
   ```bash
   npm run db:push
   ```
5. Seed the database:
   ```bash
   npm run db:seed
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security
Dentara includes a multi-layer security perimeter:
- **Rate Limiting**: Sliding window protection on auth and API routes.
- **CSRF Hardening**: Origin validation for all state-changing requests.
- **Security Headers**: HSTS, CSP, and X-Frame-Options configured via `proxy.ts`.

## 📜 License
Private/School Project - All Rights Reserved.
