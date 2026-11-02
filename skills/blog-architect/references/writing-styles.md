# Authoring & Line-Editing Styles

When an author provides rough notes, bullet points, or draft sentences to replace a `<!-- PROMPT: ... -->` placeholder during iterative drafting, apply their selected style. If the author has not specified a style, default to **Style A (Voice-Preserving Line Editing)**.

---

## Style A: Voice-Preserving Line Editing (Plain-English Technical Prose) [Default]

Designed for engineers who want their article to sound authentically like *them*—preserving their reasoning and voice while eliminating awkward phrasing and grammar errors.

### Core Rules
1. **Preserve the Author's Ideas & Flow:** Keep the author's original claims, reasoning order, and causal connections intact. Do not invent extra concepts or reorganize their thought process unless asked.
2. **Keep the Author's Perspective:** Retain first-person singular (`I`) or plural (`we`) exactly as the author wrote it.
3. **Plain English + Technical Precision:** Use simple, direct everyday words paired with accurate technical terms ("simple English with a stroke of professionalism").
4. **Zero AI Fluff:** Never inject marketing adjectives ("seamless", "powerful", "cutting-edge", "effortlessly") or generic LLM transitional filler ("In today's fast-paced world...", "It is crucial to remember that...").

### Example (Before vs. After)
- **Author's Raw Notes:**
  > The `canActivate` property of the dashboard route accepts the `canActivateDashboard` function in a list. When a user types `/dashboard` on the address bar or navigate to the path programmatically, the function is executed. If the user is authenticated, he can navigate to the dashboard successfully. Otherwise, the user's attempt is block, and he is redirected back to the home screen.
- **Voice-Preserving Line Edit:**
  > The `canActivate` property of the dashboard route accepts the `canActivateDashboard` function in an array. When a user types `/dashboard` in the address bar or navigates to the path programmatically, this route guard function is executed. Authenticated users proceed to the dashboard, while unauthenticated visitors are blocked and redirected back to `/home`.

---

## Style B: Polished Technical Narrative (Tutorial / Publication Style)

Designed for authors who want rough bullet points expanded into a cohesive, magazine-grade tutorial narrative.

### Core Rules
- Expand terse notes into smooth, guided paragraphs using inclusive second-person (`you`) or plural (`we`).
- Add brief context transitions between code blocks and architectural steps so readers unfamiliar with the codebase can follow along.

---

## Style C: Concise Recipe / Reference Style

Designed for fast-moving engineering notes, changelogs, or "how-to" cookbooks.

### Core Rules
- Minimize paragraph prose in favor of scannable bullet points, numbered steps, and short imperative sentences.
- Keep explanations to 1–2 sentences per code block.

---

## Style D: Custom Author Persona

- Follow any explicit tone, vocabulary, or structural constraints provided in the author's prompt or workspace rules.
