# WOD Architect

Fast workout programming for CrossFit coaches. Build WODs, track weekly balance, catch exercise overlap, export to WhatsApp or PDF.

Web app today. Mobile app later.

## Vision

A coach opens the app, builds tomorrow's WOD in under 60 seconds, and immediately sees:
- Whether they already programmed thrusters this week (and when/where)
- Whether their week is skewed toward weightlifting and neglecting gymnastics
- A sharable card ready for the athlete group chat

No login. No backend. Everything runs locally in the browser.

## Current Features

| Feature | Status | Notes |
|---------|--------|-------|
| WOD builder (AMRAP, For Time, EMOM, Strength) | Working | Multi-section support (Warm-up, Strength, Metcon, etc.) |
| Exercise search with 61 built-in exercises | Working | Fuzzy match on name + aliases |
| Custom exercise creation | Working | Saved to localStorage |
| Weekly duplicate warning | Working | Search results flag if exercise appeared in last 7 days |
| Weekly modality balance rings | Working | G/W/M percentage breakdown on dashboard |
| Neglect alert | Working | Warns when a modality drops below 10% over 3 days |
| Stimulus intent + time domain estimator | Working | Warns if estimated duration conflicts with chosen intent |
| Dual Rx weights (male/female) | Working | Per-exercise in builder |
| Date navigation + 14-day strip | Working | Tap a day to view/plan |
| Toggle workout complete | Working | Per-workout on dashboard |
| Day streak counter | Working | Consecutive days with completed workouts |
| Benchmark WODs (11 Girls + 3 Heroes) | Partial | Some WODs have incorrect exercises (see Known Issues) |
| WhatsApp export (copy to clipboard) | Broken | Ignores sections; reads missing `weight` field |
| PDF export | Broken | Same issues as WhatsApp export |
| PWA install | Broken | Manifest references missing icon files; no service worker |
| Delete workout | Not wired | Backend exists, no UI |
| Edit existing workout | Partial | Only first workout per day is loadable in builder |

## User Flows

### Build a WOD
1. Tap **Builder** tab
2. Pick date (arrows or day strip)
3. Choose type (AMRAP / For Time / EMOM / Strength)
4. Optionally set time cap / EMOM config / stimulus intent
5. Search and add exercises to a section (default: Metcon)
6. Add more sections (Warm-up, Strength, Accessory, etc.) via chips
7. Adjust sets, reps, weights inline
8. Tap **Save WOD**

### Check Weekly Balance
1. Open **Dashboard** tab
2. The ring chart shows G/W/M distribution for the past 7 days
3. If a modality is under 10% in the last 3 days, a yellow neglect alert appears

### Catch Weekly Duplicates
1. In the builder, search for an exercise
2. If that exercise was programmed in the last 7 days, an amber warning appears below the search result showing: days ago, reps, and weight used
3. The coach can still add it — the warning is informational, not blocking

### Load a Benchmark WOD
1. Tap **Benchmarks** tab
2. Tap a WOD card to see details
3. Tap **Load into Builder** to populate the builder with that WOD's exercises

### Export a WOD
1. Build and save a WOD
2. Tap the share icon in the builder
3. Choose **Copy for WhatsApp** or **Download PDF**

## Glossary

| Term | Definition |
|------|-----------|
| **WOD** | Workout of the Day |
| **Modality** | One of three movement categories: **G** (Gymnastics), **W** (Weightlifting), **M** (Monostructural/cardio) |
| **AMRAP** | As Many Rounds/Reps As Possible within a time cap |
| **EMOM** | Every Minute On the Minute — perform prescribed work at the start of each interval |
| **For Time** | Complete all prescribed work as fast as possible |
| **Strength** | Focused barbell/resistance work, typically sets x reps at a given load |
| **Rx** | "As prescribed" — the intended load/standard for a workout |
| **Section** | A named block within a session (Warm-up, Buy-In, Strength, Metcon, Accessory, Buy-Out, Cool-down) |
| **Stimulus intent** | The coach's target time domain for the workout (sprint / moderate / long / endurance) |
| **Time domain** | Estimated duration based on exercise count, reps, and modality |

### "Weekly Duplicate" Definition

An exercise is flagged as a **weekly duplicate** when:
- The same exercise name (case-insensitive) appears in any saved workout
- Within the last **7 calendar days** from today
- Across **all sections** of all workouts (Warm-up, Metcon, etc.)

The flag shows: how many days ago, rep count, and weight used. It does **not** block the coach from adding the exercise — it provides context so the coach can decide whether repetition is intentional (e.g., progressive overload) or an oversight.

## Run Scripts

```bash
npm install          # install dependencies
npm run dev          # start dev server (Vite)
npm run build        # production build
npm run preview      # preview production build
npm run lint         # run ESLint
```

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Framer Motion 12 (animations + drag reorder)
- date-fns 4 (date math)
- jsPDF 4 (PDF export)
- localStorage (persistence, no backend)

## Known Issues

Ordered by severity.

**P0 — Broken**
1. **Benchmark WODs have wrong exercises.** Cindy and Murph use Burpees/Sit-ups instead of Push-ups/Air Squats. Chad uses Box Jumps instead of Box Step-ups. Root cause: Push-ups, Air Squats, and Box Step-ups are missing from the exercise database.
2. **Exports show no weight.** PDF and WhatsApp export read `ex.weight` but the builder stores `ex.weightMale`/`ex.weightFemale`. Every exported workout shows blank weight.
3. **Exports ignore sections.** Both export paths iterate a flat `exercises` array and skip section headers entirely.
4. **`useAnalytics` memos recompute every render.** `today`, `sevenDaysAgo`, `threeDaysAgo` are new Date objects each render, defeating all useMemo dependencies.

**P1 — Missing or Degraded**
5. No UI to delete a workout (function exists, not wired).
6. Only the first workout per day is editable in the builder; additional workouts for the same day are orphaned.
7. Streak resets to 0 if today's workout isn't completed yet, even with a long streak through yesterday.
8. Weight data model is inconsistent across built-in exercises, custom exercises, and saved exercises.
9. `ExerciseSearch` parses localStorage on every render.
10. PWA icons missing, no service worker.

## Next Steps

1. Add Push-ups, Air Squats, Box Step-ups to exercise database
2. Fix benchmark WOD data (Cindy, Murph, Chad)
3. Unify weight model (single `formatWeight` util, canonical field names)
4. Fix PDF + WhatsApp export (sections, correct weight fields)
5. Fix useAnalytics performance (stabilize date references)
6. Fix streak logic (start from yesterday if today is incomplete)
7. Wire up delete workout UI
8. Fix multi-workout-per-day editing
9. Add PWA icons + service worker
10. Add routing (preserve tab state on refresh, enable deep links)
