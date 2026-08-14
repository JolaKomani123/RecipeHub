# Cursor intern cheat sheet

Short reference for any project. Open this file in **Markdown Preview** (`Ctrl + Shift + V` on Windows).

## Everyday

- Open Preview for `.md` files
- `@file` / `@folder` to point the agent at context
- Be specific: "fix X", "plan Y", "don't commit yet"

## Magic phrases

- `Plan: …` → write/update `plan.md`, wait
- `OK implement` → code from the plan
- `verify` → run checks + short retest list
- `explain like I'm new` → simpler words
- `show me the files you will touch first` → no surprise edits
- `read this Figma link` → use Figma MCP (don't guess UI)
- `check ClickUp task …` → use ClickUp MCP (don't invent AC)

## Rules vs Skills vs MCP

- **Rules** = always-on project manners
- **Skills** = named workflows (plan, verify, PR, etc.)
- **MCP** = live connection to apps (Figma designs, ClickUp tasks)

## Don't

- Don't paste secrets
- Don't ask the agent to force-push / skip hooks
- Don't skip the plan for big changes
- Don't invent Figma / ClickUp details when MCP isn't connected — say "not connected" instead

## Tiny daily habit (3 steps)

1. Open today’s task (or say `Plan: …`).
2. Read the plan in Preview → say `OK implement` only when it looks right.
3. Say `verify`, then skim the result in Preview or the app.
