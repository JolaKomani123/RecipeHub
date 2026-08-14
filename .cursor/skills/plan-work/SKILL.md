---
name: plan-work
description: Write or update plan.md before coding. Use when the user says plan, Plan:, write a plan, or wants to plan work first.
---

# Plan work

When the user says "plan …" or "write a plan":

1. Investigate first. Read the repo and any linked Figma / ClickUp. Do not invent APIs, ticket IDs, requirements, or design details.
2. Write or update `plan.md` at the project root (use `docs/plan.md` only if the user prefers that).
3. Use this structure exactly:

```md
# Plan — {short title}

## Goal
One sentence.

## Done when
- [ ] …

## Steps
1. …
2. …

## Files likely touched
- …

## Risks / questions
- …

## Out of scope
- …
```

4. Remind the user to open Markdown Preview to read the plan.
5. Wait for OK (`OK implement` or **continue**) before coding, unless they asked to implement immediately.
6. If Figma or ClickUp MCP is not connected, say so. Do not invent the design or acceptance criteria.
