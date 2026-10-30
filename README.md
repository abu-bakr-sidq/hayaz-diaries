# Hayaz Diaries

Portfolio of **S. Thasneem (Haya)** — content writer and SEO analyst, Chennai — laid out as a magazine: a diary that opens on load, then one chapter per screen.

Live: <https://hayaz-diaries.vercel.app> · Next.js 16, React 19, Tailwind CSS 4, GSAP + Lenis.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build — the same thing Vercel runs
npm run lint
```

## Folder structure

```
src/
  app/              layout, page (chapter order), globals.css, icons, OG image, sitemap, robots
  components/
    layout/         Header, Footer, Preloader (the diary opening), Cursor, BackToTop
    sections/       one file per chapter, in reading order — see app/page.tsx
    motion/         MotionController: page-wide scroll effects driven by data-* attributes
    providers/      Lenis smooth scrolling, synced to GSAP ScrollTrigger
    ui/             shared bits: Icons, SectionHead, Marquee, Magnetic, Barcode, RotatingBadge
  content/          all copy and data (edit these, not the components)
  lib/              GSAP setup, intro state, media-query hook, site URL
  assets/           images imported by components (optimised by next/image)
    images/         portrait, tools, Under the Hood art, Wall screenshots
    reels/          poster frames for the reels
    og/             fonts and portrait for the social share image
public/
  reels/            web versions of the reels (720p H.264, fast start)
  thasneem-resume.pdf
media-source/       originals — raw reels and screenshots (git-ignored, local only)
```

## Changing content

Most edits are data in `src/content/`:

| File | What it holds |
| --- | --- |
| `profile.ts` | name, handle, email, phone, follower counts, résumé link |
| `sections.ts` | chapter list — contents page, menu, header folio |
| `scripts.ts` | Hook Lab scripts (beat by beat) |
| `reels.ts` | Now Playing reels; `script` links a reel to its Hook Lab script |
| `carousels.ts` | Swipe File carousel sets |
| `seo.ts` | SEO Desk search results and skills |
| `tools.ts` | In Her Bag tools and their spots on the flat-lay |
| `journey.ts` | experience, education, languages |
| `wall.ts` | brands and notes pinned to the Wall |

## Adding a reel

1. Drop the original into `media-source/reels/`.
2. Make the web version and a poster frame:

   ```bash
   ffmpeg -i media-source/reels/NAME.mp4 -c:v libx264 -preset slow -crf 27 -maxrate 1.7M -bufsize 3.4M \
     -pix_fmt yuv420p -vf scale=720:-2 -c:a aac -b:a 96k -movflags +faststart public/reels/NAME.mp4
   ffmpeg -ss 3 -i public/reels/NAME.mp4 -frames:v 1 -q:v 3 src/assets/reels/NAME.jpg
   ```

3. Add an entry to `src/content/reels.ts`.

## Deploying

Every push to `main` deploys to production on Vercel. Set `NEXT_PUBLIC_SITE_URL` there once the site has its own domain.
