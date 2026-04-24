# DENTARA

```text
██████╗ ███████╗███╗   ██╗████████╗ █████╗  █████╗ ██████╗  █████╗
██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗
██║  ██║█████╗  ██╔██╗ ██║   ██║   ███████║███████║██████╔╝███████║
██║  ██║██╔══╝  ██║╚██╗██║   ██║   ██╔══██║██╔══██║██╔══██╗██╔══██║
██████╔╝███████╗██║ ╚████║   ██║   ██║  ██║██║  ██║██║  ██║██║  ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

> **Premium dental care coordination for students and patients, engineered for trust, speed, and clinical clarity.**

**Operational Origin:** [Philippines]

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Auth.js-111111?style=for-the-badge&logo=auth0&logoColor=white" alt="Auth.js" />
  <img src="https://img.shields.io/badge/License-Proprietary-lightgrey?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
</p>

<br>

## 📖 About Dentara

Dentara is a high-end digital platform built to bridge two sides of the dental ecosystem that are often underserved by traditional workflows: dentistry students who need structured clinical exposure, and patients who need accessible, organized, and trustworthy dental care. It transforms fragmented communication into a unified experience where case matching, scheduling, and conversation happen in one secure environment.

For students, Dentara provides a modern pipeline to discover clinical opportunities, manage case requirements, and coordinate with patients efficiently. For patients, it removes friction from finding care, booking appointments, and communicating with the right student or clinic representative. The result is a premium, role-aware system that supports both education and patient access with the same level of care.

<br>

## ✨ Key Features

- **Real-Time Chat Engine** — Enables live conversation between students and patients for fast coordination, case follow-up, and booking clarity.
- **Smart Booking & Scheduling** — Supports secure appointment workflows, helping users manage availability and reduce scheduling friction.
- **Clinical Case Matching** — Connects students with relevant patient cases based on clinical needs, requirements, and workflow context.
- **Role-Based Dashboards** — Delivers tailored experiences for **Student** and **Patient** users, with paths designed around their distinct goals.
- **Secure Authentication** — Uses modern authentication patterns to protect access and keep user sessions controlled.
- **Premium UI Experience** — Combines motion, layout precision, and polished visual hierarchy for a refined clinical product feel.

<br>

## 🛠 Tech Stack

| Category         | Technologies                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend         | <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" /> <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" /> <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />              |
| Backend          | <img src="https://img.shields.io/badge/Next.js%20App%20Router-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js App Router" /> <img src="https://img.shields.io/badge/Auth.js-111111?style=flat-square&logo=auth0&logoColor=white" alt="Auth.js" /> <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" /> |
| Database         | <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" /> <strong>PostgreSQL</strong> <strong>Realtime</strong>                                                                                                                                                                                                             |
| Styling          | <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /> <strong>shadcn/ui</strong> <strong>CSS Variables</strong>                                                                                                                                                                                              |
| Validation       | <strong>Zod</strong> <strong>React Hook Form</strong>                                                                                                                                                                                                                                                                                                                                       |
| Deployment Ready | <strong>App Router</strong> <strong>Server Actions</strong> <strong>Middleware</strong>                                                                                                                                                                                                                                                                                                     |

<br>

## 🚀 Getting Started (Local Development)

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd dentara
npm install
```

2. Configure your environment variables by creating a `.env` file at the project root. The exact values are private, but the application typically expects keys similar to the following:

```env
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
AUTH_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

3. Generate the Prisma client:

```bash
npx prisma generate
```

4. Run the development server:

```bash
npm run dev
```

5. Open the application in your browser:

```bash
http://localhost:3000
```

<br>

## 🛡 Security & Architecture

Dentara is designed with an enterprise-grade security posture. Supabase Row Level Security (RLS) helps constrain data access at the database layer, while edge-based middleware can be used for route protection and request throttling. Passwords are hashed with bcrypt to ensure sensitive credentials are never stored in plain text, and the overall architecture favors least-privilege access, role separation, and secure session handling.

<br>

## 📄 License & Contact

This project is maintained as a premium platform for dental coordination and clinical workflow management. If you plan to reuse, adapt, or extend Dentara, please confirm the applicable licensing terms before distribution.

For questions, partnerships, or support, contact the Dentara maintainers through your official project channel or repository discussions.

---

> Built to connect clinical ambition with patient access, beautifully and securely.
