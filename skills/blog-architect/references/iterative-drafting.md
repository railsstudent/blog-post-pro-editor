# Iterative Drafting, Gap Resolution & Prompt Updates

## 1. Author Notes vs. Prompt, Code & Diagrams ("Infer Silently, or Pause, Ask, & Merge")

- **Infer Obvious Shorthand Silently (No Nagging):** If intent is 100% clear from the code/diagram/prompt (e.g., `isSubmitting()` -> `submitting()`, `/dashroute` -> `/dashboard`), silently use the exact code symbol in the prose.
- **Pause Before Editing on Real Gaps or Mismatches:** Pause and ask **only** when:
  1. **Conceptually Wrong:** Note contradicts the code or diagram (e.g., `dirty` vs. `touched()`). Never blend conflicting terms together.
  2. **Missing Prompt / Diagram / Code Point:** A `<!-- PROMPT -->` bullet, Mermaid diagram branch (e.g., error/fallback path), or key method/branch in the adjacent code block was skipped (unless the author explicitly says to skip it).
  3. **Ambiguous Intent:** A note is cut off or unclear—ask rather than guessing wrong.
  4. **Billing/Security Trap:** Triggers Rule 1 or 2 in `technical-grounding.md`.
- **Zero-Rewriting Resolution ("Pause, Ask, & Merge"):**
  - Keep the author's submitted rough notes in context so they **never** rewrite or re-paste the section.
  - Ask concisely about **only** the missing/mismatched item(s).
  - If the author replies *"no / skip / it's okay"*, draft immediately from their existing notes.
  - If it was a miss, the author replies with **only the 1-line addition/correction**; merge it into their earlier notes and write the section to disk.

## 2. Placement / Advice Questions Revise the Prompt Only

- When the author asks *where* or *whether* to include a point (e.g., justifying a library choice), advise on placement and update the target `<!-- PROMPT -->` comment only—**never** write the final article prose until the author provides notes for it.
