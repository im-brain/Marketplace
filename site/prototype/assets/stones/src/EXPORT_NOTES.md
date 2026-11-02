# Hero agate export notes

This is a first AI SAMPLE pair, pending Brian's rockhound accuracy review. It is not a photograph of one of his finds, a verified Field Guide specimen, or a print file. No garment images were made.

Source branch: claude/compassionate-fermi-lndrfd, commit db0a1e13e30ab10991a3f89af2376f539d703384.

The dry image came first. The wet image is an edit of that same source. A cleanup edit introduced unwanted shine, and the first wet edit changed the size, so neither is used. The final wet redo is the raw generated master kept in generated/.

Mechanical export uses the dry cutout for both layers, makes alpha values of 240 and above fully opaque inside the solid stone, preserves the soft edge and contact shadow, registers the wet colors to the dry geometry, and applies the same center crop and uniform scale to both. The extra shared scale corrects the generator's framing so the stone fills about 75 percent of the 1280 x 1024 export width. Image generation supplied all creative surface changes; registration and export restore the requested geometry and file format.

PAIR_QC.json records the transform, original hashes, feature-match results, dimensions, and WebP settings. The files use quality 82 and are each below 180,000 bytes. Their alpha channels are identical. Internal detail alignment is close, with a median residual of 0.505px and a 95th percentile of 1.219px. Do not describe every internal feature as pixel-perfect. Review the toggle for texture swim before approval.

The field guide, six small stones, and menu stones remain code-drawn. Make those only after Brian reviews this first pair. Keep the AI SAMPLE label. His real matched photos still take priority.

This task adds only two photo-sizing rules to motion.css. The independent gpt/motion branch already starts with those same rules, so keep that fuller motion.css when combining the branches. Rebuild the one-file preview after combining gpt/logo, gpt/motion, and gpt/stones.
