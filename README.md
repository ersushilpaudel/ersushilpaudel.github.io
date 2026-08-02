# sushilpaudelphd.github.io

Personal site — Sushil Paudel, PhD student in Electrical Engineering,
Georgia Southern University.

Live at <https://sushilpaudelphd.github.io/>

Static HTML/CSS/JS. No build step, no framework, no dependencies, no third-party
requests at runtime.

```
index.html          the whole page
assets/style.css    design tokens + layout (light & dark)
assets/theme.js     sets the colour theme before first paint
assets/main.js      theme toggle, scroll spy, reveal-on-scroll, portrait fallback
assets/photo.jpg    hero portrait
assets/favicon.svg  tab icon
```

## Preview locally

Double-click `index.html`. All paths are relative, so it works straight off the
filesystem.

## Deploying an update

The remote is already configured. After editing:

```bash
git add -A
git commit -m "what changed"
git push
```

GitHub Pages rebuilds automatically; the change is live in a minute or two.

Pages settings live at
<https://github.com/sushilpaudelphd/sushilpaudelphd.github.io/settings/pages> —
Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`, and
**Enforce HTTPS** ticked.

### Authenticating the push

Don't paste a personal access token into a chat window or a file. Either:

- **Git Credential Manager** (ships with Git for Windows) — the first `git push`
  opens a browser login and caches it in Windows Credential Manager, or
- **`gh auth login`** (`winget install GitHub.cli`) — browser-based, same idea.

## Security posture

The threat model for a personal academic page is narrow — there's no login, no
database, no user input. What's left is *what the page discloses*, *what it
pulls in from elsewhere*, and *what an attacker could inject into a visitor's
browser*. All three are closed down:

**No third-party requests.** Fonts are OS-native (Georgia / system-ui) rather
than Google Fonts, and there are no CDNs, analytics or trackers. Nothing about a
visitor leaves their machine. This also removes every supply-chain path — a
compromised CDN cannot inject script into a page that loads no CDN.

**Strict Content-Security-Policy** (`index.html`, `<head>`). Starts at
`default-src 'none'` and re-grants only same-origin script, style, image and
font. There is no `'unsafe-inline'`: the theme script and the portrait fallback
live in `.js` files precisely so inline execution can stay banned. If anything
ever manages to inject a `<script>` into this page, the browser refuses to run it.

**`base-uri 'none'`** stops a `<base>` tag from being injected to re-point every
relative URL, and **`frame-ancestors 'none'`** blocks clickjacking via iframe.

**External links** carry `rel="noopener noreferrer"` — `noopener` prevents the
destination from reaching back through `window.opener` (reverse tabnabbing);
`noreferrer` stops the referrer leaking. `<meta name="referrer" content="no-referrer">`
applies the same site-wide.

**Nothing private in the repo.** `.gitignore` excludes every loose PDF, DOCX and
image at the folder root. Your experience letter and older resumes sit next to
`index.html`, and without that rule pushing this folder would publish them
permanently — git history keeps deleted files.

### Deliberately not on the page

- **CV download** — no PDF is served and no download button exists. The contact
  section says "available on request" instead, so you decide who gets it. A
  linked CV is a permanent, scrapable bundle of your address, phone and history.
- **Phone number** — harvested by bots off public pages.
- **Visa status (F-1)** — belongs on an application, not a public profile.

The three email addresses *are* published, as requested. That's a real
tradeoff: plain `mailto:` links get scraped for spam. Left visible because a
contact page nobody can act on defeats the point — just expect some spam, and
lean on Gmail's filtering.

### What a static host can't do

`X-Content-Type-Options`, `Strict-Transport-Security` and `Permissions-Policy`
are HTTP *headers*, and GitHub Pages doesn't let you set them. GitHub does serve
HSTS on `*.github.io` and forces HTTPS when "Enforce HTTPS" is ticked in Pages
settings — **leave that ticked**. If you ever want full header control, put
Cloudflare in front or move to Netlify/Vercel, which support a headers file.

## Things worth adding later

- ORCID / ResearchGate links alongside Google Scholar
- DOI links on the publications once available
- A separate `publications.html` if the list outgrows the section
