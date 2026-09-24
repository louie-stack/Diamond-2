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
  DexScreener, X, Telegram), FAQ, tokenomics, meme captions. All links are `#`
  placeholders until launch.
- `src/app/globals.css`: the design system (paper, ink, mustard, orange, cyan;
  halftone, grain, blinds, stamps, bursts, polaroids).
- `src/components/`: one file per group of sections. `Motion.tsx` is the GSAP
  scroll layer; elements opt in with `data-fx`.
- `public/art/`: the nine meme images.
