# AI Coding Agent Instructions for Eco Quiz Game

## Architecture Overview
This is a full-stack environmental education quiz game built as a React SPA with Express static file server. The app gamifies learning about recycling, biodiversity, and climate change through RPG-style battles against "monsters" (environmental problems).

**Key Structure:**
- `client/src/`: React app with TypeScript
- `server/`: Express server for production static file serving
- `shared/`: Common constants/types
- Game data: Quiz questions in `client/public/quizzes.json`, game logic in `client/src/lib/gameData.ts`

## Core Game Mechanics
- **Battle System**: Answer quiz questions to defeat monsters representing environmental issues
- **Dynamic Difficulty**: EASY→NORMAL→HARD progression based on 3 consecutive correct answers; wrong answers decrease difficulty
- **Scoring**: Base points (100/200/300) + time bonus (remaining seconds × base score ÷ time limit)
- **Progression**: 50 XP per correct answer, level up every 100 XP, job titles unlock at levels 10/20/30/40
- **Persistence**: Game state saved to localStorage as `eco_quiz_game_state`

## Development Workflow
- **Install**: `pnpm install`
- **Dev**: `pnpm dev` (Vite dev server on port 3000)
- **Build**: `pnpm build` (bundles client to `dist/public`, server to `dist/index.js`)
- **Prod**: `npm start` (serves built files)
- **Type Check**: `pnpm check`
- **Format**: `pnpm format`

## Code Patterns & Conventions
- **Components**: Functional React with hooks, shadcn/ui components in `client/src/components/ui/`
- **Routing**: Wouter library (`<Route>`, `<Switch>`)
- **State Management**: Custom hooks (e.g., `useBattleGame`) for game logic, React state for UI
- **Styling**: Tailwind CSS with custom design tokens in `client/src/index.css`
- **Data Flow**: Quiz data loaded from JSON, game state managed in hooks, persisted via `usePersistFn`
- **Error Handling**: `ErrorBoundary` component wraps app
- **Theming**: `ThemeProvider` with light default theme

## Game Data Structures
- **QuizQuestion**: id, theme, difficulty, question, options[], correctAnswer (0-based index), feedback {correct,incorrect}, timeLimit, baseScore
- **GameState**: selectedTheme, currentStage, currentBattle (player stats, monster, scores), gameOver, stageClear
- **Enums**: GameTheme (recycling|biodiversity|climate), DifficultyLevel (EASY|NORMAL|HARD), JobTitle (explorer→hero progression)

## Common Tasks
- **Add Quiz**: Edit `client/public/quizzes.json` with new questions following existing format
- **Modify Game Logic**: Update `client/src/hooks/useBattleGame.ts` or `client/src/lib/gameData.ts`
- **UI Changes**: Use shadcn components from `client/src/components/ui/`, follow Tailwind classes
- **New Features**: Add routes in `App.tsx`, create pages in `client/src/pages/`, hooks in `client/src/hooks/`

## Testing & Validation
- Manual testing documented in `TEST_RESULTS.md`
- Run `pnpm dev` and test game flow: Home → StageSelect → BattleGame
- Verify difficulty scaling, scoring, level progression, localStorage persistence
- Check console for errors, validate TypeScript with `pnpm check`

## Deployment Notes
- Built app serves as static files from Express
- No database; all data client-side
- Environment variables: VITE_* prefixed for client, others for server
- Reset game state: `localStorage.removeItem('eco_quiz_game_state')` in browser console