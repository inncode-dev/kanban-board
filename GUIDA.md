# GUIDA — Kanban Board

Guida didattica al progetto. L'obiettivo: saper spiegare ogni scelta a un colloquio.

## 1. Cosa fa l'app

Una bacheca con tre colonne: **To do**, **In progress**, **Done**. Puoi creare task (titolo, descrizione, priorità), spostarli con il drag and drop o con le frecce ← →, modificare il titolo con un doppio click (o col pulsante Edit), eliminarli e riportare la bacheca ai dati demo. Una barra mostra la percentuale di task completati. Task e tema (chiaro/scuro) restano salvati in `localStorage`.

## 2. Come avviarla

```bash
npm install     # scarica le dipendenze elencate in package.json
npm run dev     # avvia Vite in sviluppo, con hot reload (http://localhost:5173)
npm run build   # `tsc -b` controlla i tipi, poi `vite build` crea la cartella dist/
npm run preview # serve dist/ in locale per provare la versione di produzione
```

## 3. Dove sono le cose

```
index.html                    Entry HTML: meta description, favicon, script anti-flash del tema
vite.config.ts                Plugin React e Tailwind
tsconfig.app.json             TypeScript strict per il codice in src/
src/
├── main.tsx                  Monta <App/>, importa font e CSS
├── App.tsx                   Layout + <BoardProvider> che avvolge tutto
├── index.css                 Import Tailwind, variante dark, design tokens (@theme)
├── types.ts                  Task, Priority, ColumnId, BoardAction (union discriminata)
├── state/
│   ├── boardReducer.ts       Funzione pura: (state, action) => nuovo state
│   ├── boardContext.ts       L'oggetto Context (solo definizione)
│   └── BoardProvider.tsx     useReducer + persistenza + useMemo + Provider
├── hooks/
│   ├── useBoard.ts           Legge il context, errore se manca il Provider
│   ├── useLocalStorage.ts    useState generico persistito
│   └── useTheme.ts           Tema salvato e applicato a <html>
├── lib/
│   ├── columns.ts            Config colonne, priorità, helper colonna adiacente
│   ├── demoTasks.ts          Dati demo
│   ├── storage.ts            read/write localStorage sicuri (try/catch)
│   └── validation.ts         Regole di validazione del form
└── components/
    ├── Header.tsx            Etichetta "InnCode Lab", reset con conferma, tema
    ├── ThemeToggle.tsx       Pulsante tema
    ├── ProgressBar.tsx       Barra di avanzamento (role="progressbar")
    ├── TaskForm.tsx          Form controllato con validazione
    ├── Board.tsx             Le 3 colonne, logica di spostamento, annunci screen reader
    ├── Column.tsx            Drop target, evidenziazione, lista task
    ├── TaskCard.tsx          Card: drag, frecce, modifica inline, elimina
    ├── PriorityBadge.tsx     Badge priorità
    └── Button.tsx            Bottone riusabile con varianti Tailwind
```

## 4. Il percorso dei dati: spostare un task con →

1. Click su **→** in `TaskCard`. L'handler chiama `onMove(task.id, next, true)`.
2. `Board.moveTask` trova il task e chiama `dispatch({ type: 'task_moved', id, to })`.
3. React chiama `boardReducer(state, action)`: il `case 'task_moved'` restituisce un nuovo array con il task nella nuova colonna.
4. `useReducer` salva il nuovo state; `BoardProvider` si re-renderizza.
5. `state.tasks` è cambiato, quindi `useMemo` crea un nuovo `value` e tutti i componenti che usano `useBoard()` si aggiornano.
6. L'effect `[state.tasks]` in `BoardProvider` scrive il nuovo array in `localStorage`.
7. `Board` filtra i task per colonna: la card compare nella nuova colonna (nuovo elemento DOM) e `focusTaskId` le dà il focus. Un messaggio `role="status"` annuncia lo spostamento.

Col drag and drop cambia solo l'inizio: `dragstart` salva l'id in `dataTransfer`, `drop` in `Column` lo rilegge e chiama lo stesso `onMove`.

## 5. La gestione dello stato

| Stato | Dove | Perché |
| --- | --- | --- |
| Lista dei task | `useReducer` + Context (`BoardProvider`) | Molte operazioni diverse (aggiungi, sposta, rinomina, elimina, reset) sugli stessi dati, usate da molti componenti. Il reducer centralizza la logica ed è testabile. |
| Tema | `useLocalStorage` in `useTheme` | Un solo valore semplice, non serve un reducer. |
| Campi del form, errori | `useState` in `TaskForm` | Interessano solo il form. |
| Titolo in modifica, `isDragging` | `useState` in `TaskCard` | Locali alla card. |
| Colonna evidenziata | `useState` in `Column` | Locale alla colonna. |
| Conferma del reset | `useState` in `Header` | Locale all'header. |
| Messaggio annunciato, card da focalizzare | `useState` in `Board` | Servono a `Board` e ai suoi figli diretti, non all'intera app. |

Regola: lo stato vive il più vicino possibile a chi lo usa; sale (Context) solo se serve a molti componenti lontani. Zustand non è usato: il brief di questo progetto prevede Context + Reducer.

## 6. Gli hook, nel punto in cui sono usati

**`useReducer`** (`BoardProvider.tsx`). Serve quando lo state ha più operazioni. Il terzo argomento (`init`) è un inizializzatore lazy: legge `localStorage` una volta sola. Errori comuni: mutare lo state nel reducer (`push`), fare side effect nel reducer (id casuali, localStorage).

**`useContext` + `useBoard`** (`useBoard.ts`). Evita il prop drilling. L'hook custom nasconde il Context e lancia un errore chiaro se manca il Provider, così `tasks` non è mai `null` per i consumer. Errore comune: dimenticare il Provider.

**`useMemo`** (`BoardProvider.tsx`). Senza, `{ tasks, dispatch }` sarebbe un oggetto nuovo a ogni render e i consumer si aggiornerebbero sempre. `dispatch` è stabile, quindi la dipendenza è solo `state.tasks`. Errore comune: usarlo ovunque; qui ha un motivo preciso.

**`useEffect` per la persistenza** (`BoardProvider.tsx`, `useLocalStorage.ts`). Scrivere su `localStorage` è un side effect: va in un effect con le dipendenze giuste, non nel render né nel reducer.

**`useEffect` per il tema** (`useTheme.ts`). Sincronizza React con il DOM (classe `dark` su `<html>`). Lo script in `index.html` fa lo stesso prima del primo paint per evitare il flash bianco.

**`useEffect` + `useRef` per il focus** (`TaskCard.tsx`). Dopo uno spostamento da tastiera la card è un nuovo elemento: la focalizziamo, altrimenti il focus finisce sul `body`. Un secondo effect seleziona il testo quando compare l'input di modifica.

**`useRef`** (`TaskForm.tsx`, `TaskCard.tsx`). Per toccare il DOM (`focus()`, `select()`). Un ref non causa re-render. In `TaskCard` il ref `editFinished` evita il doppio salvataggio quando Enter smonta l'input e scatta anche il `blur`.

**`useId`** (`TaskForm.tsx`). Genera id unici e stabili per collegare `label htmlFor`, `aria-describedby` e messaggi di errore. Non usare `Math.random()` (cambia a ogni render) né id fissi (collidono se il componente è usato due volte).

**`useState`**: vedi la tabella nella sezione 5. Errore comune: derivare dati e salvarli in uno state (il numero di task per colonna si calcola, non si memorizza).

**`useLocalStorage<T>`** (`useLocalStorage.ts`). Generico: il tipo del valore salvato è quello passato. Il validatore opzionale (`isValid`) protegge da dati corrotti nello storage.

## 7. Concetti TypeScript

- **Strict mode** in `tsconfig.app.json`.
- **Union di stringhe**: `ColumnId`, `Priority`, `Theme`.
- **Discriminated union**: `BoardAction`, discriminata da `type`; nello `switch` TypeScript restringe il tipo.
- **Exhaustiveness check**: `const unhandled: never = action` nel `default` dà errore se dimentichi un caso.
- **Type guard**: `isTaskArray`, `isColumnId`, `isTheme` (`value is T`) per validare dati non fidati.
- **Generics**: `useLocalStorage<T>`, `readStorage<T>`.
- **`Record<K, V>` e `Partial`**: stili per priorità, `TaskFormErrors`.
- **Tipi di React**: `FormEvent`, `DragEvent`, `KeyboardEvent`, `ReactNode`, `ButtonHTMLAttributes`.
- **`interface extends`**: `ButtonProps` estende gli attributi nativi del bottone.

## 8. Le parti specifiche

**Drag and drop nativo.** La card ha `draggable`; `onDragStart` mette l'id in `dataTransfer`. La colonna deve chiamare `preventDefault()` in `onDragOver`, altrimenti il drop non è permesso. `dragleave` scatta anche entrando nei figli: si controlla `relatedTarget` per evitare lo sfarfallio.

**Alternativa da tastiera.** Il drag and drop non è accessibile da tastiera: le frecce ← → sono veri `button` con `aria-label` ("Move "X" to Done"), disabilitati ai bordi.

**Modifica inline.** Doppio click o pulsante Edit; Enter salva, Esc annulla, il blur salva. Titoli vuoti o sotto i 3 caratteri non vengono salvati.

**Validazione.** `validateTaskForm` è una funzione pura in `lib/`, quindi testabile. Al submit, se ci sono errori, il focus va sul primo campo non valido; `aria-invalid` e `aria-describedby` collegano l'errore al campo. `noValidate` sul form disattiva i popup del browser.

**Reset.** Conferma in due passaggi nell'header (niente `window.confirm`).

**Persistenza robusta.** `storage.ts` usa try/catch e un validatore: dati corrotti → si torna ai dati demo.

## 9. Lo stile

Tailwind v4 si configura in CSS, senza `tailwind.config.js`: `@import 'tailwindcss'` in `src/index.css` e il plugin `@tailwindcss/vite` in `vite.config.ts`. I token sono nel blocco `@theme`: ogni `--color-*` genera utility (`bg-paper`, `text-muted`, `border-line`, `bg-accent`, `bg-mint`...). Ho aggiunto quattro token `night-*` per il tema scuro. `@custom-variant dark` fa funzionare `dark:` con la classe `.dark` su `<html>`. I font sono in `@theme` (`--font-display`, `--font-sans`, `--font-mono`) e installati con Fontsource, quindi non dipendono da Google Fonts. Le classi ripetute sono estratte in componenti (`Button`, `PriorityBadge`).

## 10. Pubblicazione

**GitHub**
1. Crea un repository pubblico vuoto su github.com.
2. Nella cartella del progetto: `git init`, `git add .`, `git commit -m "Initial commit"`.
3. `git branch -M main`, `git remote add origin <url-del-repo>`, `git push -u origin main`.

**Vercel**
1. Su vercel.com accedi con GitHub e scegli **Add New → Project**.
2. Importa il repository. Vercel riconosce Vite: build `npm run build`, output `dist`.
3. **Deploy**. Poi copia l'URL nella riga "Live demo" del README.

## 11. Domande da colloquio

1. Perché `useReducer` + Context e non solo `useState`?
2. Perché il reducer deve essere puro? Dove metti `crypto.randomUUID()` e perché?
3. A cosa serve `useMemo` sul valore del Context? Cosa succede senza?
4. Cos'è una discriminated union e cosa fa il `never` nel `default`?
5. Come funziona il drag and drop HTML5? Perché serve `preventDefault` su `dragover`?
6. Come rendi accessibile una funzione che si fa col mouse?
7. Perché la persistenza è in un `useEffect` e non nel reducer?
8. Come gestisci dati corrotti in `localStorage`?
9. Come funziona il tema scuro con Tailwind v4? Perché lo script in `index.html`?
10. Quando useresti Zustand al posto del Context?

## 12. Esercizi

1. **(Facile)** Aggiungi una quarta priorità "urgent" con un colore suo (`types.ts`, `columns.ts`, `PriorityBadge.tsx`).
2. **(Facile)** Mostra un contatore di caratteri sotto la descrizione.
3. **(Media)** Aggiungi l'azione `task_priority_changed` e un `select` nella card per cambiarla. Il compilatore ti dice dove manca il caso?
4. **(Media)** Aggiungi un campo di ricerca che filtra i task per titolo, con `useState` in `Board`.
5. **(Difficile)** Permetti di riordinare i task dentro la stessa colonna con il drag and drop: serve sapere sopra quale card si rilascia e una nuova azione `task_reordered`.
