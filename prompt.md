# prompt.md: Paste this into ChatGPT

Brian: for a **new ChatGPT chat**, copy everything inside the first box into ChatGPT (with repo access turned on). To run one task at a time, change the last line, for example "Start with Task 2, the logo." For the **dry agate redo**, use the second box.

---

```
You're joining my store project, Heavy Pockets Co., as Claude's teammate. Claude has built the plan, the homepage prototype, and the checks. You're here for what you do best: images, the logo, and animation design. Give us an honest review too.

The repo is im-brain/Marketplace. Read from the branch claude/gifted-clarke-u7rlbp. Your access is read-only, so you deliver every task as a zip.

1. Read ChatGPT.md at the repo root first. It's your full brief: the project, the visual world, the hard rules, which files you own, exact specs for every image, logo, and animation slot, and how to hand off to Claude. Then read the files it lists in section 2.
2. Follow my rules everywhere, including code comments and commit messages: no em dashes, always the Oxford comma, pages readable in dark mode, and plain language (I'm new to coding).
3. Don't just agree with Claude. If something could be better, say so and say why.
4. Check your work at phone and desktop sizes in light and dark mode, and with reduced motion.
5. Deliver each task the way "How to deliver a task (a zip)" in ChatGPT.md section 5 says: one zip per task with files at their repo paths, patches for changed files, and a HANDOFF.md that includes your Handoff log entry. I'll bring it to Claude.

Start with Task 0: write ChatGPT_Review.md with your top 3 improvements, any disagreements, and 2 or 3 directions each for the stone images, the logo, and the animation. Show me those directions before building anything big.
```

---

## Dry agate redo (paste this into ChatGPT)

```
Next job: Task 1b in ChatGPT.md, the hero agate's dry image. Read it from the branch claude/gifted-clarke-u7rlbp.

Short version: the dry and wet hero images look too alike, so "Dry rocks lie" doesn't land. Edit the revision 3 dry master (site/prototype/assets/stones/src/agate-hero-dry.png). Don't generate a new stone: the outline, bands, cutout, and shadow must not move. Make it matte with no shine, slightly lighter, a little muted, and with a faint dusty film that sits more in the pits and rind than on the open face. Keep the rust color and readable bands, as your revision 3 notes said. Leave the wet image alone.

Claude made a code stand-in for comparison (src/agate-hero-dry-matte.png, made by scripts/matte_dry.py). Beat it. Include a side-by-side PNG: revision 3 dry, Claude's stand-in, your new dry, and the wet.

Deliver one zip as ChatGPT.md section 5 describes. Same rules as always: no em dashes, the Oxford comma, and plain language.
```

---

## Tips for Brian

- **One task per chat** keeps ChatGPT focused: Task 0 (review), then 1 (stones), 2 (logo), and 3 (animation).
- **ChatGPT is read-only,** so every task comes back as a zip (for example `gpt-stones-2026-11-04.zip`) with a `HANDOFF.md` inside. Upload the zip here and say "Unpack ChatGPT's zip." Claude puts every file in place, checks it, and merges it.
- **Stone images:** if you shoot your own dry and wet pairs, give them to ChatGPT with "clean these up to the Task 1 specs" in place of generating new ones. Real stones beat AI stones.
