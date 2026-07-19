# DESIGN.md — Amreel Nuqman Portfolio

The single source of truth for the redesign. Every visual/code change should trace
back to a decision here. If something on the page can't be justified by this file,
it's either wrong or this file needs updating first.

---

## 1. Concept

**Direction:** Editorial dev-native (dark).

**Scene sentence:** A hiring manager or fellow engineer opens this at night on a
laptop, skimming fast between other tabs, deciding in ~15 seconds whether Amreel is
worth a reply. The page should feel like a well-kept README from someone senior —
technical, calm, and deliberately composed — not a decorated template.

**One-line positioning:** *Fullstack developer who designs — builds intuitive,
user-first products.* (Confident present tense. No "evolving", no "growing every
day", no "recent graduate" hedging in the hero.)

**What it is NOT:** the green-on-black "matrix terminal" cliché, a neon hacker
aesthetic, or the stock BootstrapMade look it's replacing. Mono type and dark
surface carry the dev-native signal; restraint and typography carry the craft.

---

## 2. Theme & Color

**Theme:** Dark. Justified by the scene — evening, focused, screen-first; dark
reduces glare and lets the single warm accent do the pointing.

**Color strategy:** Restrained. A cool near-black neutral scale carries ~90% of the
surface; one warm amber accent appears on <10% (links, active nav, section numbers,
the primary button, key hairlines). No second accent. Color is a spotlight, not
decoration.

**Accent rationale:** Amber/saffron, not blue (SaaS reflex) and not green (terminal
reflex). Warm-on-cool gives contrast and personality while staying professional.

### Tokens (author in OKLCH; hex is reference/fallback)

| Token | OKLCH | Hex | Use |
|---|---|---|---|
| `--bg` | `oklch(0.16 0.008 265)` | `#0E0F12` | Page background |
| `--surface` | `oklch(0.21 0.010 265)` | `#16181D` | Raised panels, cards, inputs |
| `--surface-2` | `oklch(0.25 0.012 265)` | `#1E2128` | Hover / nested fills |
| `--border` | `oklch(0.31 0.014 265)` | `#2A2E37` | Hairlines, dividers, input borders |
| `--ink` | `oklch(0.93 0.006 265)` | `#E8EAED` | Primary text, headings |
| `--ink-muted` | `oklch(0.74 0.010 265)` | `#A0A6B0` | Secondary text, body de-emphasis |
| `--ink-faint` | `oklch(0.62 0.012 265)` | `#8A909B` | Meta, labels (large/bold only) |
| `--accent` | `oklch(0.79 0.14 70)` | `#F2A93B` | Links, active nav, numbers, focus |
| `--accent-strong` | `oklch(0.84 0.15 72)` | `#FFB84D` | Hover state of accent |
| `--on-accent` | `oklch(0.16 0.008 265)` | `#0E0F12` | Text on an accent-filled button |

**Contrast rules (WCAG AA, non-negotiable):**
- `--ink` on `--bg` → ~15:1. Body copy uses `--ink` or `--ink-muted`, never fainter.
- `--ink-muted` on `--bg` → ~8:1. OK for body.
- `--ink-faint` on `--bg` → ~4.6:1. **Only** for ≥14px bold or ≥18px text (labels,
  eyebrows, section numbers). Never for paragraph body.
- `--on-accent` on `--accent` (button) → high contrast, passes for the label.
- Placeholder text = `--ink-faint`, not the browser default gray.

### Light theme (opt-in toggle)

Dark remains the concept and the **default** (justified by the scene above). Light
is an accommodation for daytime/high-glare readers and system-light users who ask
for it, not a repositioning. It's a manual toggle in the header (sun in dark / moon
in light); the choice persists in `localStorage`; first visit falls back to dark. An
inline pre-paint script sets `data-theme` on `<html>` so there's no flash.

Implemented as a `:root[data-theme="light"]` re-valuing of the **same token names** —
no component CSS changed. Light is a **warm paper**, not clinical white, to echo the
amber warmth.

| Token | Light value | Notes |
|---|---|---|
| `--bg` | `#f7f5f1` | Warm paper |
| `--surface` | `#ffffff` | Raised panels, cards, inputs |
| `--surface-2` | `#efece6` | Hover / nested fills |
| `--border` | `#e0dcd3` | Hairlines |
| `--ink` | `#1a1c20` | Primary text |
| `--ink-muted` | `#55595f` | Body de-emphasis |
| `--ink-faint` | `#6b7079` | Meta/labels (≥14px bold or ≥18px only) |
| `--accent` | `#a5560a` | **Darkened** amber — bright `#f2a93b` fails AA on white (~1.9:1); this reads ~4.9:1 as link text and ~5.3:1 white-on-accent for the button |
| `--accent-strong` | `#8a4708` | Accent hover (darker in light) |
| `--on-accent` | `#ffffff` | Text on accent-filled button |

**Portfolio caption scrim flips with the theme.** The `figcaption` scrim and its
caption text are a matched pair that both flip: **dark** scrim + **light** caption in
dark mode; **warm-paper** scrim (`rgba(247,245,241,…)`) + **dark** caption in light
mode. Tokens: `--scrim` / `--scrim-hover` (whole-gradient) and `--on-scrim` /
`--on-scrim-muted` (caption ink). Rationale: pinning the scrim dark in light mode
(the earlier plan) forced a dark band into a paper page *and* left the theme-flipped
`--ink` caption text dark-on-dark → invisible. Flipping both keeps the caption
readable and lets the light theme stay light end-to-end.

Other themed effects (`--header-bg`, `--mobilenav-bg`, `--focus-ring`,
`--hero-glow-*`) also flip. The one warm-amber identity holds in both modes; only the
link/heading accent darkens for contrast — the button keeps its amber fill.

---

## 3. Typography

**Superfamily pairing (IBM Plex — coherent, distinctive, not on the overused list):**
- **Mono — `IBM Plex Mono`:** hero name, section headings, nav, section numbers,
  labels/eyebrows, metadata, buttons. Carries the "dev-native" voice.
- **Sans — `IBM Plex Sans`:** all prose/body, list items, testimonials.

Replaces Open Sans / Raleway / Poppins entirely. Load only the weights used
(Mono 400/500/600, Sans 400/500) to keep it fast.

**Rules:**
- Display letter-spacing floor: `-0.02em` on mono headings (mono runs wide; don't go
  tighter than `-0.03em`).
- Hero clamp ceiling: `clamp(2.5rem, 6vw, 4.5rem)` — never above ~5rem. Confident,
  not shouting.
- Body: 16–18px, line-height 1.6, max width **68ch**.
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on long prose.
- Numbers/labels in mono, uppercase allowed with `+0.04em` tracking (mono only).

---

## 4. Layout

- **Numbered sections are the spine, and they're earned here:** `01 Work /
  02 Experience / 03 Skills / 04 Contact` read as a real, ordered index the eye
  follows — a deliberate system, not a decorative eyebrow on every block. Numbers in
  mono, in `--accent`.
- Content column max ~1080px, generous gutters. Left-aligned, editorial — not
  centered-everything.
- Vary vertical rhythm (section padding alternates) so it breathes; avoid the
  uniform template stack.
- **Retire the card-grid reflex:** skills become inline tag rows, experience becomes
  a typographic timeline, interests collapse to one line. Reserve bordered panels for
  the portfolio thumbnails and contact only.
- Hairline dividers (`--border`, 1px) separate sections instead of boxes.
- Radii: small and sharp — 4px on inputs/buttons, 6px on thumbnails. No pills.
- Responsive grids: `repeat(auto-fit, minmax(280px, 1fr))`; flex-wrap for 1D rows.

---

## 5. Motion

- Intentional and quiet. Ease-out only (`cubic-bezier(0.16, 1, 0.3, 1)`), ~200–500ms.
  No bounce, no elastic.
- Section content is **visible by default**; reveals are a subtle enhancement
  (short fade + 8–12px rise), staggered per list, never gating visibility on a class.
- Accent underline on nav/links wipes in on hover (transform, not layout).
- `@media (prefers-reduced-motion: reduce)`: replace all reveals/transitions with an
  instant or crossfade state. Required.

---

## 6. Component notes

- **Hero:** name in large mono, one-line positioning below in `--ink-muted`, a primary
  amber button ("View work" or "Get in touch") + text links to GitHub/LinkedIn/Behance.
- **Nav:** mono, numbered, active item in `--accent` with an underline; keyboard
  focus shows a visible `--accent` ring everywhere.
- **Skills:** grouped tag rows (Languages / Frameworks / Design) — **no percentage
  bars.** No invented precision.
- **Experience/Education:** typographic list; role in mono `--ink`, org + dates in
  mono `--ink-faint`, bullets in sans `--ink-muted`.
- **Portfolio:** bordered thumbnails, mono caption, accent link icons on hover.
- **Contact:** working form (FormSubmit) on `--surface`, accent submit button,
  clickable email/phone, real social links.

---

## 7. Accessibility & performance baseline

- All images have meaningful `alt` (done).
- Visible focus states on every interactive element (accent ring).
- Contrast per §2, verified.
- Self-host or preconnect fonts; ship only used weights; keep the fixed hero image
  light on mobile.
- Respect `prefers-reduced-motion`.
