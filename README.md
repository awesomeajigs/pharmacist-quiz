# What Kind of Pharmacist Are You?

A BuzzFeed-style personality quiz for World Pharmacist Day (Sept 25) — 10
questions, 5 pharmacist archetypes, a tap-to-reveal moment with confetti, and
a shareable result page.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Framer
Motion-free CSS/Web-Animations for the confetti + glow/pulse effects.

## Live

- App: https://kindofpharmacist.vercel.app (also https://pharmacist-quiz.vercel.app)
- Every push to `main` deploys to Vercel automatically.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the Supabase URL + publishable key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    page.tsx                Home
    quiz/page.tsx           10-question flow (client-side state machine)
    reveal/page.tsx         "Tap to Reveal" screen + confetti; POSTs answers
    result/[slug]/page.tsx  Result per archetype (+ per-result OG metadata)
    api/submit/route.ts     POST: validate answers, score, store in Supabase
    api/stats/route.ts      GET: live count/percentage per archetype
  components/               UI: AnswerOption, PrimaryButton, ProgressBar,
                            Mascot, MascotCluster, GlowPulseCircle,
                            ResultView, ShareSheet, ...
  lib/
    quiz-data.ts            Questions, answers, archetypes, scoring logic
    supabase-server.ts      Server-only Supabase client (RPC calls)
    share-card.ts           Canvas renderer for the 1080x1920 story card
public/
  mascots/                  Mascot artwork exported from Figma
  confetti.gif              Result-screen confetti overlay (from Figma)
supabase/migrations/        Database schema (quiz_results + RPC functions)
```

## Backend

Results are stored in Supabase (`quiz_results` table). The table has RLS
enabled with no policies, so it can't be read or written directly; the app
only calls two `SECURITY DEFINER` functions:

- `submit_quiz_result(archetype, answers)` — insert one result
- `archetype_stats()` — aggregate counts per archetype

Scoring happens on the server in `/api/submit`. If the API is unreachable the
reveal page falls back to scoring in the browser, so the quiz never breaks.
The result page shows the live percentage once 20+ results exist, and the
designed "1 in N" copy before that.

## Scoring

Each of the 10 questions has 5 answers, one per archetype (Counselor,
Detective, Sprinter, Mentor, Guardian). Points are tallied across all 10
answers; ties are broken in this order: Mentor → Detective → Sprinter →
Counselor → Guardian. Questions, answers and their archetype tags live in
`src/lib/quiz-data.ts`.
