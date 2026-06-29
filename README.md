# Mallosrhis Plays

A personal video game tracker hosted as a static GitHub Pages site. Tracks games played and a backlog, with cover art pulled from [RAWG](https://rawg.io), modal details, an interactive statistics dashboard, and a simple admin page for adding games directly from the browser.

---

## Features

- **Played** and **Backlog** sections with cover art posters
- Game modals with personal notes, rating, platform, date played, genres, and Metacritic score
- Dropped game indicator on posters
- Search and sort (by date, rating, or title)
- **Statistics dashboard** — rating distribution, completion status, platform and genre breakdowns, games over time, and a month heatmap
- **Admin page** — search RAWG, fill in details, commit directly to the repo with one click (no manual file editing)

---

## How to Fork and Use

### 1. Fork this repo

Click **Fork** at the top right of this page. Then rename the forked repo to `yourusername.github.io` (replacing `yourusername` with your actual GitHub username). This is GitHub's special username repo — it serves the site directly at your root GitHub Pages URL.

### 2. Enable GitHub Pages

Go to your forked repo → **Settings** → **Pages** → set Branch to `main`, folder to `/(root)` → Save.

Your site will be live at `https://yourusername.github.io` within a minute.

### 3. Get a RAWG API key

Sign up for free at [rawg.io/apidocs](https://rawg.io/apidocs). It's instant and free — 20,000 requests/month.

### 4. Generate a GitHub Personal Access Token

Go to **GitHub Settings** → **Developer Settings** → **Personal Access Tokens** → **Fine-grained tokens** → **Generate new token**.

Scope it to your forked repo only, with **Contents: read and write** permission. This lets the admin page commit to your `games.json` without touching anything else.

### 5. Open the admin page

Go to `https://yourusername.github.io/admin.html`.

Paste your RAWG API key and GitHub token into the Credentials fields (a password manager like Bitwarden makes this seamless — save both and autofill on every visit).

Fill in your repo as `yourusername/yourusername.github.io`.

### 6. Add your first game

Search for a game by name, pick it from the results, fill in your platform, date played, rating, and notes, then hit **Add to Site**. The page commits directly to `games.json`. GitHub Pages rebuilds in about 30–60 seconds.

---

## games.json Schema

Each game entry looks like this:

```json
{
  "id": 3498,
  "slug": "grand-theft-auto-v",
  "title": "Grand Theft Auto V",
  "year": 2013,
  "coverImage": "https://media.rawg.io/...",
  "rawgUrl": "https://rawg.io/games/grand-theft-auto-v",
  "genres": ["Action", "Open World"],
  "metacritic": 97,
  "played": true,
  "platform": "PS5",
  "platformType": "PlayStation",
  "datePlayed": "2024-03",
  "completionStatus": "Completed",
  "rating": 9,
  "description": "Your personal notes."
}
```

`platformType` is set automatically by the admin page — it's used by the statistics dashboard to group platforms into families (PlayStation, PC, Xbox, Nintendo, Mobile).

For backlog games, `played` is `false` and `platform`, `datePlayed`, `completionStatus`, `rating`, and `description` are all `null`.

---

## Tech

- Vanilla HTML, CSS, JavaScript — no frameworks, no build step
- [RAWG API](https://rawg.io/apidocs) for game data and cover images
- [Chart.js](https://www.chartjs.org/) for the statistics dashboard
- [Google Fonts — Exo 2](https://fonts.google.com/specimen/Exo+2) for typography
- [GitHub Contents API](https://docs.github.com/en/rest/repos/contents) for admin page commits

---

## Contact

[mallosrhis@gmail.com](mailto:mallosrhis@gmail.com)
