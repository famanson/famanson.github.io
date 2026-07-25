# phamanhson.com — static rebuild

A hand-built static copy of the Squarespace site
(`a-study-of-street.squarespace.com` / `phamanhson.com`), reproducing its
layout, typography and interactions so it can be served from GitHub Pages
with no build step.

## Layout

```
index.html              Commute gallery (homepage)
commute/                same gallery at its own URL, as Squarespace served it
escalators/  trains/  vietnam/  scrapbook/
other-works/            "work"
johannes/
blog/                   posts, 5 per page
blog/page/2..4/
blog/2019/2/16/<slug>/  individual posts, original Squarespace permalinks
404.html
assets/css/site.css     the whole stylesheet
assets/js/site.js       mobile menu, gallery, lightbox
assets/fonts/           self-hosted woff2
assets/img/             every image, at 750w and 1500w
```

Everything is plain HTML — edit the files directly. `.nojekyll` stops GitHub
Pages from running Jekyll over them.

## How the original behaviour is reproduced

**Gallery collections** open on a masonry thumbnail grid and switch to a
fitted single-image view when a thumbnail is clicked. The masonry uses the
same rule as the original: one column per 500px of container width, 10px
gutters, shortest-column-first placement. In the single-image view the left
40% of the frame goes to the previous image, the right 40% to the next, and
the middle 20% back to the thumbnails; arrow keys and `prev / next` in the
sidebar do the same. Below 800px both views collapse to a stacked list, as
before.

**Deep links to individual images** used `/<gallery>/<image-slug>` on
Squarespace. GitHub Pages can't route those, so `404.html` recognises the
shape and bounces to `/<gallery>/#<image-slug>`; the gallery opens that image
and rewrites the address bar back to the original-style path. Links that were
shared before the move keep working.

**Blog** pages keep the Squarespace permalink structure, the right-hand
sidebar, and `Prev / Next` ordering (prev = newer).

**Page content** keeps Squarespace's block markup — 12-column rows, image
blocks, gallery blocks — so the two long pages lay out exactly as they did.

## Deliberate differences from the original

- **Typeface.** The original set Proxima Nova through a Typekit kit tied to
  the Squarespace account, which can't come along. The site now uses
  [Asap](https://fonts.google.com/specimen/Asap), self-hosted. It was picked
  by measuring candidates against the live site rather than by eye: Asap
  lands within 3.6% of Proxima Nova averaged over string widths, x-height,
  cap-height and descender depth, scored second-best on a normalised
  letterform-bitmap comparison, breaks running text at the same words, and
  covers Vietnamese diacritics. Change `--font-sans` at the top of
  `assets/css/site.css` to swap it.
- **Images.** Everything that lived on Squarespace's CDN is now in
  `assets/img/`. Images the posts hotlinked from elsewhere (cl.ly, imgur,
  Flickr, xkcd) still point at those hosts, exactly as they did before.
- **Dropped.** Squarespace's comment widget, like button and social-share
  buttons — all server-side features with nothing to talk to.
