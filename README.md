# Mountainview Institute of Technology — Scholarship & Financial Aid Portal

**ISM 6225 — Application Development for Analytics**
**Assignment 1: Look and Feel**
**Author:** Christopher Biroc — MS Business Analytics & Information Systems, University of South Florida (December 2026)

Content theme: **Educational Institution**, built around scholarship and financial aid data.

Mountainview Institute of Technology is a fictional institution created for this
assignment. Every dollar figure, deadline and award count on the site is sample data.

---

## Live Site

https://cbirocusf.github.io/Assignment_LookAndFeel/

## Repository

https://github.com/cbirocUSF/Assignment_LookAndFeel

---

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home page. Overview of the aid program, portfolio totals calculated from the dataset, and four featured awards. |
| `aboutus.html` | Developer profile, the build write-up, and the list of technologies used. |
| `managescholarships.html` | Mock CRUD. Create, read, update and delete scholarship records, with search and category/status filters. |
| `analytics.html` | Three Chart.js visualizations built from the same dataset. |

A single navigation bar appears on all four pages. `js/main.js` marks the current
page by comparing each link's filename to the address bar, so the same markup can be
copied onto every page without editing an `active` class by hand.

---

## Project Structure

```
.
├── index.html                  Home
├── aboutus.html                About the developer
├── managescholarships.html     CRUD page
├── analytics.html              Charts
├── css/
│   └── main.css                Custom stylesheet layered over Bootstrap
├── js/
│   ├── data.js                 Shared dataset + aggregation helpers
│   ├── main.js                 Nav highlighting, footer year, formatters
│   ├── home.js                 Home page stat tiles and featured cards
│   ├── scholarships.js         CRUD logic for the catalog
│   └── analytics.js            The three Chart.js charts
├── img/
│   ├── logo.svg                Institutional crest
│   └── hero-miner.svg          Hero illustration
└── README.md
```

---

## How the Data Works

All four pages read from one array, `SCHOLARSHIPS`, defined in `js/data.js`:

- **Home** calls `portfolioSummary()` to compute total dollars committed, awards
  available, open programs and the average award.
- **Manage Scholarships** works against a deep copy, so edits never mutate the
  original array.
- **Analytics** calls `totalDollarsByCategory()` and `awardCountByCategory()` to
  build its chart series.

Because there is only one source of data, the figures on the home page, the rows in
the table and the bars on the charts cannot disagree. In a data-driven version of
this site, `data.js` would be replaced by a database query.

CRUD changes are held in browser memory only. Refreshing the page restores the
original sample catalog, which is the intended behavior for a static mock.

---

## Technologies

- **HTML5** — semantic structure, shared nav and footer
- **CSS3** — custom properties for the brand palette, media queries for small screens
- **JavaScript (ES5 syntax)** — DOM manipulation, events, array filtering and aggregation, no framework
- **Bootstrap 5.3.3** (CDN) — grid, collapsible navbar, form validation styling, alerts, modal
- **Chart.js 4.4.1** (CDN) — the three charts, loaded only on `analytics.html`
- **SVG** — hero illustration and crest, hand-authored so they scale and never 404

Brand palette: `#367588` (teal), `#2f4f4f` (slate), with a `#c9a227` gold accent.

---

## Running Locally

The site is plain static files with no build step. Open `index.html` in a browser,
or use the VS Code **Live Server** extension. A local server is preferred so that
relative paths behave exactly as they do on GitHub Pages.

---

## Accessibility and Performance Notes

- Chart.js is loaded only on the analytics page, so the other three pages stay light.
- Artwork is inline SVG rather than raster images — no large downloads, no broken links.
- Every chart canvas carries `role="img"` and a descriptive `aria-label`.
- Status messages use `aria-live="polite"` so screen readers announce CRUD results.
- Verified at 390px and 1280px wide with no horizontal overflow and no console errors.
