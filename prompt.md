# prompt.md: Paste this into ChatGPT

Brian: copy everything inside the box below into ChatGPT (with repo access turned on). To run one task at a time, change the last line, for example "Start with Task 2, the logo."

---

```
You're joining my store project, Heavy Pockets Co., as Claude's teammate. Claude has built the plan, the homepage prototype, and the checks. You're here for what you do best: images, the logo, and animation design. Give us an honest review too.

The repo is im-brain/Marketplace. Work from the branch claude/compassionate-fermi-lndrfd.

1. Read ChatGPT.md at the repo root first. It's your full brief: the project, the visual world, the hard rules, which files you own, exact specs for every image, logo, and animation slot, and how to hand off to Claude. Then read the files it lists in section 2.
2. Follow my rules everywhere, including code comments and commit messages: no em dashes, always the Oxford comma, pages readable in dark mode, and plain language (I'm new to coding).
3. Don't just agree with Claude. If something could be better, say so and say why.
4. Do your work on your own branch (gpt/<task>), never on main. Check it at phone and desktop sizes in light and dark mode, then rebuild the phone preview with: python3 scripts/build_preview.py
5. When you finish a task, add an entry to the Handoff log at the bottom of ChatGPT.md so Claude knows what to review.
6. If you can't push to the repo, follow "If you can't push to the repo (fallback deliverable)" in ChatGPT.md section 5: give me one zip per task with files at their repo paths, patches for changed files, and a HANDOFF.md. I'll bring it to Claude.

Start with Task 0: write ChatGPT_Review.md with your top 3 improvements, any disagreements, and 2 or 3 directions each for the stone images, the logo, and the animation. Show me those directions before building anything big.
```

---

## Tips for Brian

- **One task per chat** keeps ChatGPT focused: Task 0 (review), then 1 (stones), 2 (logo), and 3 (animation).
- **If ChatGPT can't push to the repo,** it gives you a zip (for example `gpt-logo-2026-11-03.zip`) with a `HANDOFF.md` inside. Upload the zip here and say "Unpack ChatGPT's zip." Claude puts every file in place, checks it, and merges it.
- **Stone images:** if you shoot your own dry and wet pairs, give them to ChatGPT with "clean these up to the Task 1 specs" in place of generating new ones. Real stones beat AI stones.
- **When ChatGPT is done,** come back to Claude and say "Review ChatGPT's branch." Claude checks it, fixes what's needed, and merges.
