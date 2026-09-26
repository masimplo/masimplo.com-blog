# Header image (Nano Banana)

Every post gets exactly one generated header image and no inline body images. It is also the og:image / twitter:image, so it is the first thing people see when the post is shared.

## How it renders (why aspect ratio matters)

`src/templates/post.tsx` renders the header as a `background-size: cover` figure **800px tall** at roughly content width, and it is cropped to a social card elsewhere. Ultra-wide images (e.g. 1792×592, 3:1) lose their sides badly. **Target 16:9** (~1376×768). 3:2 (1536×1024) is acceptable. Keep the subject centred, with a safe margin on every edge.

The nanobanana `/generate` command has **no aspect-ratio flag**. Valid options are only `--count`, `--styles`, `--variations`, `--format`, `--seed`, and `--preview`, and anything else makes the parser error out. Ask for the aspect in the prompt text ("16:9 landscape wide blog header"), then check the real dimensions. Past outputs have ranged from 1376×768 to 1792×592.

## Procedure

1. **Invoke the `nano-banana` skill** and run its preflight: `gemini` CLI present, nanobanana extension installed, `GEMINI_API_KEY` or `GOOGLE_API_KEY` set. The key is not persisted on this machine. If it is missing, ask the user to run `! export GEMINI_API_KEY=…` themselves. Never paste a key into a command you compose, a file, a commit, or the vault.
2. **Research what the subject looks like** when the post is about a real object (a car model, a coffee machine, a printer). Past headers had to be regenerated because a generic prompt drew the wrong shape: a drip machine that wasn't cubic like the Fellow Aiden, and an EV charging from the front when the EX30's port is at the rear. Describe the geometry. Don't just name the brand, since brand-heavy prompts have also failed silently.
3. **Pick a house style** (below) and write the prompt: subject + one visual metaphor from the post's thesis + style + palette + composition + `16:9 wide blog header, centred subject, no text, no logos, no watermarks`.
4. Generate from the repo root:
   ```bash
   gemini --yolo "/generate '<prompt>' --count=2"
   ```
5. **Verify.** `ls -la nanobanana-output/` should show a new file of a few hundred KB. A CLI that prints `0` or no file path has failed. Check dimensions with `sips -g pixelWidth -g pixelHeight <file>`. If the ratio is wider than 2:1, regenerate. If it's a good image at 3:2, you can centre-crop it to 16:9 with `sips --cropToHeightWidth <round(w*9/16)> <w> <file>`. Then **view it with the Read tool**. Check for garbled text, extra limbs or fingers, wrong object geometry, a subject cropped at the edges, and anything that contradicts the post.
6. **Iterate deliberately.** Name what failed (geometry? style? text crept in? too busy?) and change only that in the prompt. Stop after 4 attempts and show the user the best candidates.
7. **Install it.** Copy the file to `src/images/headers/<keyword-bearing-name>.png` (the name matching the slug is ideal), set `image: ../../images/headers/<name>.png`, then `rm -rf nanobanana-output/`.

## House styles

Match the post's world. Both styles appear across the 2026 headers.

**A. Dark tech (AI, code, CI, tools, dev process)**
Deep indigo-to-violet gradient background, glowing semi-transparent UI elements (code windows, pipelines, nodes, shields), neon cyan/lavender/magenta accents, flat vector with soft glow, clean and slightly isometric. *Examples: `guardrails-ai-code.png` (code windows fenced by glowing guardrails), `npm-ci-two-pipelines.png` (red failed vs green passed pipelines).*
Prompt skeleton:
> Flat vector tech illustration, deep indigo to violet gradient background, glowing translucent <objects> representing <thesis metaphor>, neon cyan and lavender accents, soft glow, clean minimal composition, centred subject with generous margins, 16:9 wide blog header, no text, no logos, no watermarks

**B. Warm editorial (gadgets, home, EV, coffee, food, 3D printing, personal)**
Flat editorial illustration with soft grain, warm natural light (morning window, garage dusk), muted earthy palette with one cool accent, a real-world setting with a few lived-in props. *Examples: `fellow-aiden-coffee-maker.png` (accurate cubic machine on a wooden counter by a sunlit window), `ev-home-charging.png`.*
Prompt skeleton:
> Flat editorial illustration with subtle grain, <accurately described subject> in <real setting>, warm <light source> light, muted earthy palette with a <cool colour> accent, a few lived-in details (<props>), calm composition, centred subject with generous margins, 16:9 wide blog header, no text, no logos, no brand marks, no watermarks

## Make it about the story, not the keyword

The strongest headers show the post's **thesis as a visual metaphor**: guardrails around code windows, two pipelines with one red and one green, an Obsidian vault with a fence around it. A literal "person typing at laptop" or a stock-looking photo is filler. Ask what single image someone would remember after reading the post.

Avoid: text of any kind (it renders garbled), real people's faces, brand logos, cliché robots or glowing brains for AI posts, and photorealism (the blog's generated headers are illustrations).
