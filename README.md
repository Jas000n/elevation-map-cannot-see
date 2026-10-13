# What the Elevation Map Cannot See — project page

Project page for *What the Elevation Map Cannot See: Semantic-Aware Locomotion and Execution-Aware Navigation
for Humanoid Robot*. Built on
[RomanHauksson/academic-project-astro-template](https://github.com/RomanHauksson/academic-project-astro-template)
(Astro + MDX + Tailwind + React islands); the template's own documentation is in `documentation.md`.

Paper: [arXiv:2610.07396](https://arxiv.org/abs/2610.07396). The page presents the work as a project and names no
venue. Authors, affiliations and the Paper / arXiv / Code buttons are props of `<Header>` in `src/paper.mdx`; a
button without a `url` is shown greyed out with its `pending` note (the Code button, until the code is released).

## Build and preview

Node 22 or later (the GitHub workflow uses 24).

```bash
npm ci
npm run dev        # http://localhost:4321, live reload
npm run build      # astro check + static site in dist/
npm run preview    # serve dist/
```

## Where things are

| Path | What |
|---|---|
| `src/paper.mdx` | the whole page: text, figures, clips, tables |
| `src/data/results.ts` | the paper's Table V and VI (simulated locomotion, hazard contact by visibility) for the charts |
| `src/data/real_profiles.json` | scan vs LiDAR-map height profiles through the real box, bottle, phone and spill |
| `src/components/charts/` | the three interactive charts (React, hydrated when scrolled into view) |
| `src/components/LayerSlider.*` | RGB / scan / LiDAR-map comparison slider |
| `src/components/Clip.astro`, `ClipGrid.astro` | labelled clips; `Video.astro` loads muted loops only while they are on screen |
| `src/assets/videos`, `posters`, `figures`, `maps` | generated media, see below |

## Media

All of `src/assets/{videos,posters,figures,maps}` and `src/data/real_profiles.json` are produced from the research
repository's demo-video outputs by one script there:

```bash
cd /storage/shunyu/icra_wbc
python demo_video/website_media.py --site /storage/shunyu/icra27_website            # everything
python demo_video/website_media.py --site ... --only videos --videos sim_pair_1     # one clip
```

It re-encodes the same footage the demo video cuts from (H.264, faststart, no audio), extracts the paper's
figures as embedded, renders the map layers once per scene from a fixed camera (Blender, GPU), and renders the
six short `teaser_*` loops under the header (three real-world, three simulated). The page has no long video: each part of the demo sits in its
section as a short loop.

## Deploy

Live at <https://jas000n.github.io/elevation-map-cannot-see/>, served from this repository
(`Jas000n/elevation-map-cannot-see`) by GitHub Pages with source "GitHub Actions". Every push to `main` rebuilds and
redeploys through `.github/workflows/astro.yml`, which passes the `/elevation-map-cannot-see` base path to Astro;
asset URLs in the page all go through it, so nothing needs changing if the repository is renamed.
