# Authoring & Line-Editing Styles

When an author provides rough notes, bullet points, or draft sentences to replace a `<!-- PROMPT: ... -->` placeholder during iterative drafting, **automatically select the best-fit style for that specific section** (unless the author explicitly specifies a style) and announce the selected style in 1 short line:

- **Auto-Select Style A (Voice-Preserving Paragraphs):** For introductions, high-level architecture narratives, and single-concept "why" explanations (1–2 short paragraphs).
- **Auto-Select Style B (Tutorial Bullet Walkthrough):** For code or feature walkthroughs covering 2+ fields, methods, signals, or conditional branches.
- **Auto-Select Style C (Concise Recipe / Reference):** For dependency installations (`npm install`), CLI commands, `package.json` scripts, and configuration files (`firebase.json`, `.env`, `tsconfig.json`).
- **Auto-Select Style D (Narrative / General-Purpose & Custom Override):** For non-coding blog posts or sections (event recaps, retrospectives, opinion pieces, general topics), side-note callouts/comparison tables, or whenever the author overrides the format.

**Universal Voice Rule:** Across all styles (A, B, C, and D), always preserve the author's authentic voice, avoid AI fluff, and never narrate every line of code.

---

## Style A: Voice-Preserving Line Editing (Plain-English Technical Prose) [Default]

Designed for engineers who want their article to sound authentically like *them*—preserving their reasoning and voice while eliminating awkward phrasing and grammar errors.

### Core Rules

1. **Preserve the Author's Ideas & Flow:** Keep the author's original claims, reasoning order, and causal connections intact. Do not invent extra concepts or reorganize their thought process unless asked.
2. **Keep the Author's Perspective:** Retain first-person singular (`I`) or plural (`we`) exactly as the author wrote it.
3. **Plain English + Technical Precision:** Use simple, direct everyday words paired with accurate technical terms ("simple English with a stroke of professionalism").
4. **Zero AI Fluff:** Never inject marketing adjectives ("seamless", "powerful", "cutting-edge", "effortlessly") or generic LLM transitional filler ("In today's fast-paced world...", "It is crucial to remember that...").
5. **The "One-Sentence Why" for Pragmatic Shortcuts:** When the author uses a practical DX workaround or demo simplification (e.g., loading public Firebase/reCAPTCHA keys from `.env` into a gitignored config file to prevent GitHub secret-scanner false alarms, or using `CORS=*` in a demo endpoint), state the practical reason in **one concise sentence or a 1-line code comment** so readers understand the trade-off without derailing the narrative. Conversely, if the author's draft contains a factual mismatch with the repo or a real cloud billing/security footgun, flag it explicitly rather than silently polishing it.
6. **High-Signal Explanation Only (No Line-by-Line Code Narration):** Do not explain every line of a code block. Skip self-explanatory boilerplate (such as `try/catch` blocks, setting error signals, standard imports, static HTML/CSS classes, or static metadata arrays) and focus prose strictly on the important architectural mechanics and non-obvious implementation details.

### Example (Before vs. After)

- **Author's Raw Notes:**
  > The `canActivate` property of the dashboard route accepts the `canActivateDashboard` function in a list. When a user types `/dashboard` on the address bar or navigate to the path programmatically, the function is executed. If the user is authenticated, he can navigate to the dashboard successfully. Otherwise, the user's attempt is block, and he is redirected back to the home screen.
- **Voice-Preserving Line Edit:**
  > The `canActivate` property of the dashboard route accepts the `canActivateDashboard` function in an array. When a user types `/dashboard` in the address bar or navigates to the path programmatically, this route guard function is executed. Authenticated users proceed to the dashboard, while unauthenticated visitors are blocked and redirected back to `/home`.

---

## Style B: Polished Technical Narrative (Tutorial / Publication Style)

Designed for authors who want rough notes structured into a clear, step-by-step tutorial walkthrough.

### Core Rules

- Use inclusive second-person (`you`) or plural (`we`) with a brief 1-sentence lead-in before bullet lists or code blocks.
- **One Idea Per Bullet (Split Compound Sentences):** Keep each bullet point to a single, concise sentence (`* **Bold label**: One clear point.`). Whenever a rough note contains a compound sentence or chains multiple steps/actions together, split it into separate bullet points (or nested sub-bullets) instead of joining clauses with semicolons or `which...`.
- **Succinct, High-Signal Explanations Only:** Apply Rule 4 (Zero AI Fluff), Rule 5 ("One-Sentence Why"), and Rule 6 (No Line-by-Line Code Narration) from Style A. Focus on *why* and *how* the key mechanism works without narrating every line of code.

### Example (Splitting a Compound Note into Atomic Tutorial Bullets)

- **Author's Raw Note:**
  > The `isAuthenticated()` computed signal controls when the `SignOutIconComponent` button displays when `isAuthenticated()` is true, and when the user clicks it, `onSignOut()` logs out the user, recomputes `isAuthenticated()`, and returns to `/home`.
- **Tutorial Style Edit:**
  > * **Conditional visibility**: Renders the `<app-sign-out-icon />` button only when the `isAuthenticated()` computed signal is `true`.
  > * **Sign-out action**: Clicking the button calls `onSignOut()` to sign out the user, update `isAuthenticated()`, and navigate back to `/home`.

---

## Style C: Concise Recipe / Reference Style

Designed for dependency installations (`npm install`), CLI commands, `package.json` scripts, and configuration files (`firebase.json`, `.env`, `tsconfig.json`) where you want fast, actionable instructions without personal backstory.

### Core Rules

- Replace narrative backstory paragraphs with a 1-line imperative lead-in (`Add the Auth Emulator and concurrent launch scripts to package.json:`) or numbered steps (`1. Install concurrently as a dev dependency:`).
- Follow config/script blocks with compact, 1-sentence key-by-key reference bullets.

### Example (Before vs. After)

- **Author's Raw Notes:**
  > During local development, I connect the Angular application to the Firebase Authentication Emulator to seed a test user for login. `start` starts `ng serve` on 4200, `firebase:emulate:auth` reads `firebase/firebase.json` to start only the auth emulator, and `launch` runs both concurrently.
- **Concise Recipe Edit:**
  > Add the Auth Emulator and concurrent launch scripts to `package.json`:
  > *(code block)*
  > * **`start`**: Starts the Angular dev server (`ng serve`) on `http://localhost:4200`.
  > * **`firebase:emulate:auth`**: Starts only the Authentication Emulator using `firebase/firebase.json`.
  > * **`launch`**: Runs the Auth Emulator and Angular dev server together via `concurrently`.

---

## Style D: Narrative / General-Purpose Blog Style & Direct Override

Designed for non-coding blog posts or sections (community/GDE event recaps, retrospectives, career/opinion pieces, general-interest topics) and custom formatting overrides where code-tutorial styles (A/B/C) do not fit:

- **Natural Storytelling & Flow:** Write in smooth, conversational paragraphs that preserve the author's personal voice (`I` or `we`) and story arc without forcing bold-labeled technical bullets, architecture diagrams, or code blocks.
- **Callout Boxes & Comparison Tables:** When a section is a side-note, caveat, or multi-option trade-off rather than narrative prose, use a concise callout (`> [!NOTE]` / `> [!WARNING]`) or a compact Markdown table.
- **Direct Author Override:** Whenever the author rejects or adjusts a draft's format (e.g., *"too wordy"*, *"use plain bullets without bold labels"*, *"just 2 sentences"*), immediately drop preset templates and follow the author's exact instructions.
