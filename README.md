# Kanban Board — InnCode Lab · Project 01

A three-column Kanban board (To do, In progress, Done) built to show how React hooks fit together: `useReducer` + `useContext` for shared state, `useState` for local UI state, and a handful of small custom hooks.

**Live demo:** _add your Vercel URL here_

## Features

- Create tasks (title, description, priority) with form validation
- Move tasks with native HTML5 drag and drop, or with keyboard-accessible ← → buttons
- Inline title editing (Enter saves, Esc cancels)
- Delete tasks, reset the board to demo data
- Progress bar of completed tasks
- Light / dark theme
- Tasks and theme persisted in `localStorage`

## Concept → file

| Concept | File |
| --- | --- |
| `useReducer` with a discriminated union of actions | `src/state/boardReducer.ts`, `src/types.ts` |
| `useContext` + custom `useBoard` hook | `src/state/boardContext.ts`, `src/hooks/useBoard.ts` |
| `useMemo` to stabilise the context value | `src/state/BoardProvider.tsx` |
| `useEffect` for persistence | `src/state/BoardProvider.tsx`, `src/hooks/useLocalStorage.ts` |
| `useEffect` for theme sync | `src/hooks/useTheme.ts` |
| `useEffect` + `useRef` for focus management | `src/components/TaskCard.tsx` |
| Generic custom hook `useLocalStorage<T>` | `src/hooks/useLocalStorage.ts` |
| `useId` to link labels and inputs | `src/components/TaskForm.tsx` |
| `useRef` for DOM access | `src/components/TaskForm.tsx`, `src/components/TaskCard.tsx` |
| `useState` for local state | `Header`, `TaskForm`, `Column`, `TaskCard`, `Board` |
| HTML5 drag and drop | `src/components/Column.tsx`, `src/components/TaskCard.tsx` |
| Form validation | `src/lib/validation.ts`, `src/components/TaskForm.tsx` |
| Tailwind v4 design tokens | `src/index.css` |

## Stack

React 19 · Vite · TypeScript (strict) · Tailwind CSS v4 · self-hosted fonts via Fontsource (Space Grotesk, DM Sans, Space Mono)

## Commands

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and build for production into dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
├── components/   UI: Header, Board, Column, TaskCard, TaskForm, ProgressBar, ...
├── hooks/        useBoard, useLocalStorage, useTheme
├── state/        reducer, context object, provider
├── lib/          columns config, demo data, storage helpers, validation
├── types.ts      shared types and the action union
├── index.css     Tailwind import + design tokens
├── App.tsx
└── main.tsx
```
