# EvoluteIQ website

Static site: plain HTML + CSS + JavaScript, with three.js (r128) for the scroll-driven 3D world. No build step.

## Run it

The page loads its scripts and images from local files, so serve the folder over HTTP rather than double-clicking `index.html` (some browsers block local files and WebGL textures on `file://`).

Pick any one:

**Python (already on macOS / most Linux):**
```bash
cd evoluteiq-site
python3 -m http.server 5173
```
Windows: `py -m http.server 5173`

**Node.js:**
```bash
cd evoluteiq-site
npm start          # uses `serve`
# or: npm run dev  # live reload while editing
```

**VS Code:** install the "Live Server" extension, right-click `index.html` → *Open with Live Server*.

Then open **http://localhost:5173**

## Files

```
index.html            page markup (all sections)
css/style.css         design tokens (colours, type scale), layout, responsive rules
js/main.js            content arrays, icon generator, scroll choreography, 3D scene
vendor/three.min.js   three.js r128 (bundled so it works offline)
vendor/lenis.min.js   Lenis smooth scrolling (bundled)
assets/images/        photos, news/blog art, plan illustrations, badges, logo
assets/logos/         customer, press and analyst logos (monochrome)
```

## Where to edit

- **Copy:** top of `js/main.js` — `STEPS`, `STATS`, `TOOLS`, `IND` (+ `IND_URL`), `DOMAINS`, `ROLES`, `ANALYSTS`, `NEWS`, `BLOGS`, `PLANS`. Hero, CTA and footer text are in `index.html`.
- **Colours / type sizes:** `:root` variables at the top of `css/style.css` (`--accent`, `--ink`, `--sky`, …).
- **Scroll timing:** `BOUNDS` (step boundaries, in viewport-heights) and the `DIST` / `ELEV` camera keyframes in `js/main.js`. The 3D section length is `.stage{height:650vh}` in the CSS.
- **3D world layout:** inside `build3D()` — city, HQ (pixel "EIQ" sign in `EIQ`), industry, agent grid + control tower (`agents`, `tower`), satellite agent pads (`pad()`), arrow; rails in `railPts`, glowing trail in `trailPts`.
- **Industry product visual:** the `PV` array in `js/main.js` sets the process steps shown for each industry.
- **Newsletter:** the form in the footer only validates and shows a message — connect it to your email provider in the `#nl` submit handler.


## Design system (matches the EvoluteIQ site)

- Fonts: **Inter Tight** (200–500, headings in 300 light) + **Instrument Serif Italic** for the blue accent phrases (`<em>` inside headings).
- Colours: EIQ blue `#0068DE` (also the CTA + footer band), soft blue `#BCD5F5`, ink `#17181D`, navy `#0A1C3C` for the "iq" in the footer wordmark, 3D sky `#E2ECF8`.
- Square geometry, hairline blue outline buttons with a fill-sweep hover, pixel-art icons (`PXI` in `js/main.js`) that print in on scroll.

- Results section ("See real results"): numbered list with a filling progress line; the pixel illustration on the right scatters and re-forms into each stat (`MORPH` in `js/main.js` — shapes are drawn on a 48×34 grid in `S`).
- Roles section (white): five tabs with a sliding underline; switching tabs scatters the blue pixel art and re-forms it into that role's picture (shapes in `roles()` in `js/main.js`, copy in `ROLES`). Arrow keys move between tabs.
- Industries grid (white): 3×2 cells with hairline dividers and flat blue pixel icons (`MONO`), each linking to its evoluteiq.com solution page.
- Functional domains section (between the 3D story and the results): six teams from the EvoluteIQ site's Solutions menu, each with a pixel icon. Edit `DOMAINS` in `js/main.js`.
- Pixel icons (`PXI`) sit on the tools, industries and functional domains. Any `.ico.pxg` container scatters its pixels when it leaves the screen and gathers them again each time it scrolls back into view; `--gd` staggers cards in a row.

## Testimonial videos

Put `testimonial-1.mp4` and `testimonial-2.mp4` in `assets/videos/` (see the README there). The story row drifts left→right, pauses while a card is hovered, and plays that card's video. Edit quotes in the `VOICES` array.


## Performance & device support

- One shared animation loop drives everything (smooth scroll, 3D, marquee, pixel morph); layout is measured once and cached, so scrolling never forces reflows.
- Smooth scrolling via Lenis on mouse/trackpad; phones and tablets keep native touch scrolling (no hijacking). Reduced-motion users get plain scrolling.
- 3D pixel budget: total rendered pixels are capped (≈4.2M desktop, ≈2.1M phones/low-power), so 4K monitors and TVs don't render 8M+ pixels a frame.
- Off-screen work pauses: the product-visual animations and counters, the testimonial row, the results canvas and the pixel-gather icons do nothing while not visible; the loader is removed from the page once it fades.
- TVs and 2.5K/4K screens (≥2400px wide) get larger type, buttons and icons.
- Adaptive 3D quality: pixel density starts at 2× on desktop / 1.5× on phones and steps down automatically if frames get slow (and back up when there is headroom). Lighter shadows and fewer particles on phones and low-memory devices.
- Stable viewport height on mobile (the address bar showing/hiding doesn't make the page jump).
- Hover effects only on devices with a real pointer; tap states on touch. Landscape-phone and very small screen layouts included. iOS Safari 15+, Chrome, Edge, Firefox, Samsung Internet.

## Scrollbar

The browser's scrollbar is hidden on every browser. A thin blue thumb (`#sbar` / `.sbar` in the CSS, `SB` in `js/main.js`) follows the smooth scroll instead:
- On mouse devices it stays faint while idle, brightens while scrolling, and widens on hover so you can drag it.
- On touch screens it only appears while scrolling.
- Over the navy CTA and footer it switches to a lighter blue.

## Deploy

Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, S3, cPanel). No server code needed.

Fonts load from Google Fonts (Roboto, Unbounded); offline, the page falls back to system fonts.
