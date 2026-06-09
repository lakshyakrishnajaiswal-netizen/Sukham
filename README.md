# Sukham Yoga & Physiotherapy Centre Website

Premium Next.js prototype for Sukham, built from the supplied PRD and brochure references.

## Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion
- Supabase Auth, Database and Storage integration points
- Vercel-ready project structure

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Routes

- `/` public website with breathing intro, hero slider, reviews, experts, plans, workshops, blogs, gallery, appointment form and footer
- `/admin` dashboard prototype for managing homepage, experts, plans, workshops, blogs, gallery, reviews and appointments
- `/api/appointments` appointment submission endpoint stub

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the SQL editor.
3. Create Storage buckets for `hero`, `experts`, `certificates`, `workshops`, `blogs`, `gallery` and `reviews`.
4. Copy `.env.example` to `.env.local` and fill in the Supabase keys.
5. Replace the placeholder appointment route with a real insert using `SUPABASE_SERVICE_ROLE_KEY`.

## Admin Auth

The admin page is currently a complete UI prototype. For production, wrap `/admin` with Supabase Auth middleware and restrict write policies to authenticated admin users.
