# Blog Post Pro Editor

A repository containing custom editorial skills and commands for AI coding agents to improve the quality, tone, and correctness of technical blog posts and prose.

## AI Agent Installation Guide: Skills & Custom Commands

This guide explains how to install, configure, and use the custom editorial skills and commands contained in this repository across various common coding agents and AI IDEs.

---

## 1. Gemini CLI / Antigravity CLI

Gemini CLI supports custom plugins and skills using the configuration directory structure.

### Installing Skills

1. Copy the skill directories from `/skills` into your Gemini config plugins directory (typically located at `~/.gemini/config/plugins/` or your project plugin directory).
2. Ensure each skill folder contains a valid `SKILL.md` specifying the behavior constraints.

### Installing Custom Commands

1. Gemini CLI registers custom commands defined via TOML configuration files.
2. Copy the command definitions from the `/commands` directory into your active project configuration folder or configuration mapping.

---

## 2. GitHub Copilot

GitHub Copilot respects workspace-level instructions through a specialized markdown file.

### Installing Custom Instructions

1. Create a directory named `.github` in the root of your workspace if it doesn't already exist.
2. Create or append to a file named `.github/copilot-instructions.md`.
3. Include references to the editorial guidelines from `/skills` directly in `.github/copilot-instructions.md`. For example:

   ```markdown
   # Editorial Standards
   Refer to the rules in the following workspace files to review and edit prose:
   - [Active Voice Rules](./skills/active-voice-reviewer/SKILL.md)
   - [Conciseness Rules](./skills/conciseness-reviewer/SKILL.md)
   ```

---

## 3. Claude (Claude Desktop & Claude.ai Projects)

### Claude.ai Projects (Web)

If you are using Claude.ai Pro/Team Projects:

1. Open your project on Claude.ai.
2. In the right panel, click **Set Custom Instructions**.
3. Copy and paste the core prompt instructions from the relevant `SKILL.md` files (such as `active-voice-reviewer` or `technical-accuracy-reviewer`) directly into the project instructions text box.
4. Upload the files in the `skills` and `commands` directories to the **Project Knowledge** section so Claude can reference them directly.

### Claude Desktop (Local)

For Claude Desktop, you can configure custom MCP (Model Context Protocol) servers to expose skills or commands, or point it to workspace directories:

1. Expose the directories containing instructions by adding directory path parameters to your workspace reader MCP server in `~/Library/Application Support/Claude/claude_desktop_config.json`.

---

## 4. Cursor / Kiro IDE

Many modern AI-first IDEs (like Cursor and Kiro IDE) utilize workspace-level rule files.

### Using `.cursorrules` (Cursor & Kiro IDE)

1. Create a `.cursorrules` file in the root of your project.
2. Add instructions pointing the agent to respect the workspace skills and configuration:

   ```markdown
   Always adhere to the specific review rules defined in the `./skills` directory before completing any writing, editing, or code-documenting tasks:
   - Use `./skills/active-voice-reviewer/SKILL.md` to check writing style.
   - Use `./skills/technical-accuracy-reviewer/SKILL.md` to ensure correct terminology.
   ```

3. For custom commands, list them in the `.cursorrules` under a `# Custom Workflows` section to instruct the agent on when to emulate them (e.g., executing the logic defined in `commands/blog-review.toml`).
