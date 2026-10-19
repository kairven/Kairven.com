---
name: kairven-experience-autopsy
description: Pressure-test Kairven websites and interactive experiences as a skeptical customer, devil's advocate, and defensive UX red team. Use when asked to critique, autopsy, expose weaknesses, or challenge a website's visual design, interaction, motion, content, conversion flow, accessibility, or performance.
---

# Kairven Experience Autopsy

Review the experience with evidence, not taste alone. Be candid and specific; do not praise generic patterns just for being polished.

## Review sequence

1. **First impression:** In a few seconds, can a new visitor tell who this is for, what Kairven does, why it is credible, and what to do next?
2. **Devil's advocate:** Challenge the design premise. Identify decorative effects, copy, features, or complexity that do not improve comprehension, trust, or action.
3. **Journey autopsy:** Follow a plausible visitor from entry to enquiry. Expose confusing transitions, missing context, competing calls to action, dead ends, and avoidable form friction.
4. **Interaction and motion:** Check that every animation communicates hierarchy or feedback. Look for scroll hijacking, motion that obscures content, unstable layouts, timing conflicts, and effects that fail on touch or low-powered devices.
5. **Inclusive use:** Check keyboard access, focus visibility, semantic controls, contrast, zoom/reflow, reduced-motion behavior, and whether essential meaning survives without animation.
6. **Trust and claims:** Flag unsupported promises, ambiguous pricing or scope, unclear contact behavior, misleading social proof, and missing privacy context.
7. **Defensive red team:** Try ordinary, non-destructive visitor paths and edge cases. Do not submit real enquiries, spam services, probe third-party systems, or perform exploit testing unless separately and explicitly authorized.

## Evidence and output

- Inspect the running page at mobile and desktop sizes when browser tools are available. Otherwise state that findings are based on source inspection.
- Never claim to have tested a behavior, device, or metric that was not actually tested.
- Report actionable findings in priority order. For each, include the observed evidence, user/business impact, confidence, and a specific fix.
- Separate confirmed defects from hypotheses. Note what is working only when it is materially relevant.
- Prefer the smallest change that improves clarity, usability, trust, accessibility, or performance. Avoid adding effects just to make a page feel more animated.
- For requested code fixes, preserve existing project patterns and verify the changed behavior with the available checks.
