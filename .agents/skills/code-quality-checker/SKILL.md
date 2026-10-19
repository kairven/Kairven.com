---
name: code-quality-checker
description: Check code changes for correctness, regressions, maintainability, accessibility, performance, and missing tests. Use when asked to check, review, inspect, or validate code quality. Report evidence and prioritize actionable findings; do not modify code unless asked.
---

# Code Quality Checker

Review the requested scope, not unrelated parts of the repository. Read relevant project instructions and follow existing conventions.

## Review process

1. Establish the intended behavior and inspect the changed code plus directly related call sites and tests.
2. Trace relevant inputs, state changes, errors, and user-visible output. Check boundary cases and regressions.
3. Check accessibility, security, and performance when they are directly affected by the change.
4. Run the narrowest relevant existing tests, type checks, builds, and linters. Do not claim a check passed if it was not run.
5. Do not make edits during a review unless the user also requested fixes.

## Findings

- Report only actionable issues introduced by the reviewed change or clearly in scope.
- Order findings by severity: critical, high, medium, low.
- For each finding, include file and line, concrete evidence, impact, and a specific correction.
- Separate confirmed problems from risks or missing coverage. Include confidence.
- Avoid style-only suggestions unless they cause a concrete maintenance or correctness problem.
- If no issues are found, say so and list the checks actually performed.
