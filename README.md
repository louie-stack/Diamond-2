# $DIAMOND site (v2)

Retro-detective homepage for Diamond Hands, the anti-jeet memecoin. The page is a
case file: hero at the detective's desk, a three-panel comic strip, an evidence
board for the 1% rule, a mugshot for whales, an interrogation room, a
declassified memo, a transcript FAQ, an evidence locker for tokenomics, a
"case closed" verdict and a surveillance-photo meme wall.

Copy comes verbatim from `DIAMOND_Homepage_Copy_Draft.pdf`.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Where things live

- `src/content.ts`: contract address, external links (buy, contract, LP lock,
  DexScreener, X, Telegram), checkout settings, FAQ, tokenomics, meme captions.
  Links are `#` placeholders until launch; `#buy` opens the in-page checkout.
- `src/app/globals.css`: the design system (night, bone, lime; Big Shoulders,
  Share Tech Mono, Geist) plus each section's styles.
- `src/components/hero/`: the WebGL rain-on-glass hero (`glass.ts`).
- `src/components/Crime.tsx`: chapter one. Scroll sets `data-step` 0 to 4 and
  every visual state lives in CSS.
- `src/components/Checkout.tsx`: demo buy flow (`CHECKOUT.live` is false until launch).
- `src/components/Motion.tsx`: Lenis smooth scroll and the GSAP reveal layer
  (`data-fx`).
- `public/art/case/`: the case scenes, logo and the pre-rendered clippings wall.
  `public/video/` the teaser, `public/audio/` the theme for the sound toggle.
