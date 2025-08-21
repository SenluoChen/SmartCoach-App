# SmartCoach-App

SmartCoach-App is a sports AI-driven training and strategy assistant (starting with badminton, extendable to basketball and other sports).
The main goal is to connect court position → shot selection → rally outcome → strategy insights, helping coaches and players improve decision-making with data visualization and AI-powered recommendations.

## Features

-Court Zone Selection & Contextual Shot Suggestions: Select front/mid/rear court zones; available shots filtered by context (clear, drop, smash, drive, net, lift, push, block, etc.)
-Rally Recording & Review: Log each shot with origin, destination, type, and outcome (win, forced error, unforced error)
-Visualization & Analytics: Heatmaps, trends, and opponent shot preferences
-AI Smart Coach : Export match data in structured JSON and send to an LLM for personalized advice
-Import/Export: CSV/JSON for easy backup and sharing
-Cross-Platform Vision: Web-first with mobile (Android/iOS) planned

## Tech Stack

-Frontend: TypeScript, React

-Styling: Tailwind CSS 

-State Management: Redux Toolkit / Zustand

-AI : ChatGPT API integration for match insights

-Languages in repo: Mainly TypeScript, with some Kotlin / Objective-C / Ruby for future mobile/tooling support

## Project Structure

```
SmartCoach-App/
├─ badminton-strategy-main/        # Badminton strategy prototype (current main code)
│  ├─ src/
│  │  ├─ components/               # UI components (CourtGrid, ShotPicker, StatsCards…)
│  │  ├─ features/
│  │  │  ├─ recording/             # Match logging logic
│  │  │  └─ analysis/              # Charts and data analytics
│  │  ├─ lib/                      # Utilities (csv/json converters, heatmap logic)
│  │  ├─ store/                    # State management
│  │  ├─ pages/                    # Pages (Record, Review, Settings…)
│  │  └─ app.tsx / main.tsx
│  ├─ public/
│  ├─ package.json
│  └─ README.md
├─ mobile/                         # (optional) Native / cross-platform app
└─ docs/                           # API specs, JSON samples, screenshots
```

## Development & Run

```
# 1) Install dependencies
npm install

# 2) Start development server
npm run dev

# 3) Build for production
npm run build

# 4) Preview production build
npm run preview

# 5) Lint / Format (if configured)
npm run lint
npm run format
```

## Data Types 

```
type CourtZone = "front_left" | "front_center" | "front_right"
               | "mid_left"   | "mid_center"   | "mid_right"
               | "rear_left"  | "rear_center"  | "rear_right";

type ShotType = "clear" | "drop" | "smash" | "drive" | "net" | "lift" | "push" | "block";

interface RallyEvent {
  id: string;
  timestamp: number;
  side: "player" | "opponent";
  from: CourtZone;
  to?: CourtZone;
  shot?: ShotType;
  outcome?: "win" | "lose" | "error_forced" | "error_unforced";
}

```
## AI Input/Output Example

```
interface MatchSummary {
  meta: { opponent: string; date: string; level?: string };
  stats: { shotsByZone: Record<CourtZone, number>; winRateByShot: Record<ShotType, number> };
  issues: string[];
}

interface CoachAdvice {
  focusAreas: string[];
  drills: { name: string; goal: string; reps: string }[];
  inMatchTips: string[];
}
```

## Environment Variables (if AI enabled)

-OPENAI_API_KEY=xxxxxx
-ANALYTICS_WRITE_KEY=xxxxxx

## Testing

Unit tests: Vitest / Jest
Component tests: Testing Library
E2E tests: Playwright / Cypress
```
npm run test
npm run test:e2e
```

## Demo

-SmartCoach Web App (https://www.behance.net/gallery/228677495/SmartCoach-AI-Powered-Badminton-Coaching-App)


## Contributing & Contact

For questions, suggestions, or collaboration opportunities, feel free to reach out:

Email: ray191714@gmail.com


