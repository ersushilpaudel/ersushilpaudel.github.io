# ersushilpaudel.github.io

Personal site — Sushil Paudel, PhD student in Electrical Engineering,
Georgia Southern University.

Live at <https://ersushilpaudel.github.io/>

Static HTML/CSS/JS. No build step, no framework, no dependencies, no third-party
requests at runtime.

```
index.html          the whole page
assets/style.css    design tokens + layout (light & dark)
assets/theme.js     sets the colour theme before first paint
assets/main.js      theme toggle, scroll spy, reveal-on-scroll, portrait fallback
assets/photo.jpg    hero portrait
assets/favicon.svg  tab icon
assets/flag-*.svg   Nepal (constitutional construction) and US (EO 10834) flags
assets/peak-*.jpg   Annapurna, Machhapuchhre, Everest
assets/campus-*.jpg Georgia Southern
```

## Image licences

The four photographs come from Wikimedia Commons and are **not** public domain —
three carry share-alike terms and all four require attribution. The credit line
under the photo strip in `index.html` is a licence condition, not decoration.
Do not delete it, and keep the author names and licence links intact if the
layout changes.

| File | Author | Licence |
|---|---|---|
| `peak-annapurna.jpg` | Vyacheslav Argenberg | CC BY 4.0 |
| `peak-machhapuchhre.jpg` | Bijay Chaurasia | CC BY-SA 4.0 |
| `peak-everest.jpg` | shrimpo1967, ed. Papa Lima Whiskey 2 | CC BY-SA 2.0 |
| `campus-georgiasouthern.jpg` | Richardelainechambers | CC BY-SA 3.0 |

Share-alike binds derivative works of the *images*, not the site that displays
them, so nothing here obliges you to license your own code. Swapping in a
different photo means updating the credit line to match.

They are served from `assets/` rather than hotlinked from Commons — hotlinking
would break the CSP and leans on someone else's bandwidth.

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
<https://github.com/ersushilpaudel/ersushilpaudel.github.io/settings/pages> —
Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`, and
**Enforce HTTPS** ticked.

Note: a user Pages site is always `<username>.github.io`, so the repository
name must track the account name. Renaming the account without renaming this
repo takes the site offline — GitHub redirects renamed *repositories* but never
Pages URLs.

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

**One third-party request, by choice.** Fonts are OS-native (Georgia /
system-ui) rather than Google Fonts, and there are no CDNs, analytics or
trackers. The single exception is the footer visit counter, which calls
`api.counterapi.dev` to get a global total — a static host keeps no state, so
there is no other way to have one. **Every visitor's IP reaches that service.**
That is the cost of the number in the footer; delete the counter block in
`assets/main.js` and the `connect-src` line in the CSP to go back to zero
external contact.

The counter is public and unauthenticated — anyone who finds the endpoint can
inflate it. Fine for a vanity figure, unsuitable for anything that matters.

**Strict Content-Security-Policy** (`index.html`, `<head>`). Starts at
`default-src 'none'` and re-grants only same-origin script, style, image and
font, plus `connect-src` to that one counter host. There is no `'unsafe-inline'`:
the theme script and the portrait fallback live in `.js` files precisely so
inline execution can stay banned. If anything ever manages to inject a `<script>`
into this page, the browser refuses to run it. Note the counter host is allowed
for `connect-src` only — it can return JSON, never execute code on the page.

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
