---
name: verify-change
description: Run project checks after a change and summarize results. Use when the user says verify, verify the change, or asks if it works.
---

# Verify change

When the user says "verify" after a change:

1. Look for this project's normal checks (lint, typecheck, build, tests) in files like `package.json` or `README`.
2. If checks exist, run them.
3. If none exist (this learning folder has none yet), say that clearly. Do not invent a test suite.
4. Summarize what passed / failed in plain words.
5. Give 2–3 manual clicks to retest (open the file, Preview, click around).
