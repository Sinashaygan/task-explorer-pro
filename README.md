# Kanban Board

A simple Kanban board for organizing work across columns and cards.

## Main features

- Create, edit, archive, and delete cards
- Add card descriptions, labels, priorities, assignees, and due dates
- Drag and drop cards between columns
- Reorder cards within a column
- Collapse and expand columns
- Undo recent card actions
- Responsive Material UI interface

## Technologies

- Next.js
- React
- TypeScript
- Redux Toolkit
- Redux Persist
- dnd-kit
- Material UI
- React Hook Form
- Zod

## Installation and running

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — start the production server
- `npm run lint` — run ESLint

## Basic project structure

```text
app/                 Next.js app entry points and providers
src/entities/        Board, column, and card data models and selectors
src/features/        Board, column, and card UI
src/shared/           Shared types and UI components
src/store/            Redux store and slices
src/theme/            Material UI theme
```

## Persistence

Redux Persist stores only the normalized `board` state in browser storage. UI state and undo state are not persisted. The store uses persist version `2` and includes a migration scaffold for future state changes. Sample board data is initialized only when no board data is available after rehydration.

## Drag-and-drop and CRUD

Cards use dnd-kit for pointer and keyboard drag-and-drop. Card CRUD actions are handled through Redux Toolkit reducers while card entities and column entities remain normalized. Column `cardIds` define the card order.
