# SkillEn — Product Requirements Document

## Original Problem Statement
Build a modern, responsive marketing website + admin dashboard for SkillEn — a career development & talent solutions platform that bridges Students, Companies and Colleges. 10 marketing pages + admin console. Tagline: "Learn. Grow. Lead." Use brand color palette from official brochures (Deep Teal #06252C + Vibrant Orange #F26C21).

## User Choices (Feb 2026)
- Scope: Marketing site + working Admin Dashboard
- Lead capture: Save to DB only (no email/WhatsApp notifications)
- Contact: info@skillen.in, +91 7070330407, Instagram, LinkedIn (provided by user)
- Mock interviews: Capture booking requests for manual follow-up (no payment gateway)
- Blog: Admin can create/publish posts (hardcoded sample posts seed on startup)

## User Personas
1. **Student** — fresh graduate / final-year, searching for jobs, internships, interview practice
2. **Hiring Manager** — wants pre-screened entry-level talent, fewer rounds
3. **College T&P Officer** — needs placement training, bootcamps, drives on campus
4. **SkillEn Admin** — manages leads & blog content

## Core Requirements
- 10 marketing pages: Home, Students, Companies, Colleges, Courses, Mock Interviews, Success Stories, About, Blog, Contact
- Lead capture forms on 5 pages → MongoDB
- Admin dashboard with JWT login, lead viewer (filter/status/delete), blog CRUD
- Brand colors: #06252C primary, #F26C21 accent; Cabinet Grotesk + Satoshi fonts
- Mobile responsive, sticky glass nav, floating WhatsApp button

## Architecture
- Backend: FastAPI + Motor (MongoDB async) + JWT (Bearer) + bcrypt
- Frontend: React 19 + React Router 7 + Tailwind + Shadcn + Sonner + Lucide
- Routes prefixed `/api`. Collections: `users`, `leads`, `blogs`
- Admin seeded from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env on startup. 5 sample blogs seeded.

## What's Implemented (Feb 2026 — v1)
- ✅ All 10 marketing pages with hero, stats counter, ecosystem, why-choose, programs, placement steps, testimonials, partner marquee, final CTA
- ✅ Lead forms: contact, student-enroll, hiring, college, mock-booking
- ✅ Admin login + protected dashboard (overview / leads / blog tabs)
- ✅ Blog: public list+detail (with category filter) + admin CRUD modal
- ✅ Floating WhatsApp CTA
- ✅ Brand-correct color palette + custom Cabinet Grotesk + Satoshi typography

## Admin Credentials
- `admin@skillen.in` / `SkillEn@2026` (see `/app/memory/test_credentials.md`)

## Prioritized Backlog (P0/P1/P2)
- **P1**: Email notification on new lead (Resend/SendGrid)
- **P1**: Razorpay/Stripe integration for mock-interview payments
- **P1**: Job & internship posting (public listings + apply form)
- **P2**: Student dashboard / LMS hooks (login, course progress)
- **P2**: SEO meta tags per route (react-helmet), sitemap.xml
- **P2**: Rich-text editor for blog (replace markdown textarea)

## Next Tasks
1. Add Resend email notifications for incoming leads
2. Add job/internship posting CRUD
3. SEO meta + sitemap
