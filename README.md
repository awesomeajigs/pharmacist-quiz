# What Kind of Pharmacist Are You?

A BuzzFeed-style personality quiz for World Pharmacist Day (Sept 25) — 10
questions, 5 pharmacist archetypes, a tap-to-reveal moment with confetti, and
a shareable result page.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Framer
Motion-free CSS/Web-Animations for the confetti + glow/pulse effects.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    page.tsx              Home
    quiz/page.tsx          10-question flow (client-side state machine)
    reveal/page.tsx         "Tap to Reveal" screen + confetti burst
    result/[slug]/page.tsx  Result screen per archetype (dynamic route)
  components/               Shared UI: AnswerOption, PrimaryButton,
                             ProgressBar, BackButton, Mascot, MascotCluster,
                             ConfettiAccents, GlowPulseCircle, ShareSheet
  lib/
    quiz-data.ts             Questions, answers, archetypes, scoring logic
public/
  mascots/                   Drop real exported mascot PNGs here (see below)
```

## Mascot images

This sandbox couldn't reach Figma's asset CDN to pull the real mascot
artwork, so the app ships with simple colored SVG placeholder mascots that
render automatically. To use the real ones:

1. In Figma, select each archetype's mascot image layer and export as PNG.
2. Drop the files into `public/mascots/` named exactly:
   `counselor.png`, `detective.png`, `sprinter.png`, `mentor.png`,
   `guardian.png`.
3. That's it — no code changes needed, the app prefers the real file and
   falls back to the SVG placeholder only if a file is missing.

## Scoring

Each of the 10 questions has 4 answers, each tagged with one of the 5
archetypes (Counselor, Detective, Sprinter, Mentor, Guardian). Points are
tallied across all 10 answers; ties are broken in this order: Counselor →
Detective → Sprinter → Mentor → Guardian.

The archetype tag on each answer wasn't stored anywhere retrievable from the
Figma file (it only existed as design intent), so it was reconstructed in
`src/lib/quiz-data.ts` from each answer's tone, balanced so every archetype
scores exactly 8 out of the 40 total answer slots. Worth a read-through if
you want to double check or tweak any assignment.

## Deploying to Vercel

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, keep the
   defaults (Next.js is auto-detected) and click Deploy.
3. Done — you'll get a `*.vercel.app` URL, and can attach a custom domain
   from the Vercel project settings if you want one.

## Pushing to GitHub

```bash
git add -A
git commit -m "Initial commit: quiz app"
gh repo create pharmacist-quiz --public --source=. --remote=origin --push
```

(Or create the repo manually on github.com and `git remote add origin <url>`
then `git push -u origin main`.)
