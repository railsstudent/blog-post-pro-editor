# Technical Grounding & Adversarial Pre-Flight Check (No Rubber-Stamping)

Whenever inspecting a repo/concept (Phase 1), generating scaffold prompts (Phase 2), or expanding/revising author notes, **never blindly validate ("good good good") or extrapolate from memory**.

## 1. Tiered Grounding Chain (Works With or Without MCP)

1. **Repo Source, Tests & Manifests (Primary — Near-Zero Cost):**
   - Verify exact symbol names, runtime behavior, and library versions against the repo's implementation files, unit tests, and manifests (`package.json`, `pyproject.toml`, `go.mod`, etc.).
2. **Local Installed Types & Docstrings (`node_modules` / Local SDKs):**
   - When no documentation MCP server is configured, inspect local `.d.ts` files, JSDoc comments, and `@deprecated` tags in installed packages for exact version-matched API signatures.
3. **Official Docs (MCP if available, else `search_web`):**
   - For framework internals, cloud service pricing/quotas, security rules, or concept-only posts without a local repo, verify against official documentation via MCP tools or built-in web search.
4. **No Unverified Extrapolation:**
   - If a technical claim cannot be verified from the repo, local types, or official docs, flag the uncertainty to the author rather than inventing plausible-sounding internals.

---

## 2. The 3-Rule Balance: Real Traps vs. Pragmatic Demo/DX Choices

Evaluate whether the code/idea works only on Day 1 ("syntax runs") versus what happens on Day 2 in production or on the author's cloud bill. Classify non-standard patterns into three categories before writing:

| Category | Examples | Required Agent Action |
| :--- | :--- | :--- |
| **Rule 1: Cloud Billing & Resource Accumulation Traps** | • Scripts creating new active Secret Manager versions on every push without diffing (`isSecretUpToDate`) or pruning old versions<br>• Storing 7 separate secrets instead of 1 bundled JSON secret<br>• Unbounded retries/loops on paid APIs | **Stop & Warn Before Writing:** Calculate and explain the Day-2 billing/quota impact (verified via docs/web search). Propose the cost-safe pattern or a `> [!WARNING]` callout before drafting. |
| **Rule 2: True Security Misconfigurations** | • Adding `localhost` to a production reCAPTCHA Enterprise key instead of using separate dev/test keys or App Check debug tokens<br>• Committing real private credentials/service account keys | **Stop & Warn Before Writing:** Flag why the setup compromises production security and suggest the official best practice. |
| **Rule 3: Pragmatic Demo & Open-Source DX Shortcuts** | • Storing public client keys (Firebase web `AIza...` config, reCAPTCHA site keys) in `.env` + generating a gitignored config file to avoid GitHub secret-scanner false alarms<br>• Using `CORS=*` (`cors: true`) in a demo Cloud Function | **Do Not Nag or Block:** Respect the author's pragmatic choice. Frame it in the post using the **"One-Sentence Why"** rule (e.g., one sentence explaining the false-alarm avoidance, or a 1-line inline code comment `// Open CORS for demo; restrict to your domain in prod`). |
