/* =====================
   SCRIPT.JS — Mallosrhis Plays
   ===================== */

const playedList   = document.getElementById('played-games');
const backlogList  = document.getElementById('backlog-games');
const searchInput  = document.getElementById('search-input');
const sortSelect   = document.getElementById('sort-select');
const playedEmpty  = document.getElementById('played-empty');
const backlogEmpty = document.getElementById('backlog-empty');
const lastUpdatedEl= document.getElementById('last-updated');

const overlay         = document.getElementById('modal-overlay');
const modalClose      = document.getElementById('modal-close');
const modalPoster     = document.getElementById('modal-poster');
const modalTitle      = document.getElementById('modal-title');
const modalYear       = document.getElementById('modal-year');
const modalGenres     = document.getElementById('modal-genres');
const modalDesc       = document.getElementById('modal-description');
const modalStars      = document.getElementById('modal-stars');
const modalRating     = document.getElementById('modal-rating');
const modalMetacritic = document.getElementById('modal-metacritic');
const modalPlatform   = document.getElementById('modal-platform');
const modalDate       = document.getElementById('modal-date');
const modalStatus     = document.getElementById('modal-status');
const modalRawgLink   = document.getElementById('modal-rawg-link');

let allGames = [];

// ---- Helpers ----------------------------------------------------------------

function renderStars(rating) {
  const outOf5 = rating / 2;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (outOf5 >= i)              html += '<span class="star on">★</span>';
    else if (outOf5 >= i - 0.5)  html += '<span class="star half">★</span>';
    else                          html += '<span class="star">★</span>';
  }
  return html;
}

function metacriticClass(score) {
  if (score == null) return 'mc-none';
  if (score >= 75)   return 'mc-green';
  if (score >= 50)   return 'mc-yellow';
  return 'mc-red';
}

// YYYY-MM → "Month YYYY"
function formatDate(dateStr) {
  if (!dateStr) return null;
  const [year, month] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long' });
}

// ---- Sorting ----------------------------------------------------------------

function sortGames(games, mode) {
  const copy = [...games];
  switch (mode) {
    case 'date-desc':
      return copy.sort((a, b) => {
        if (!a.datePlayed && !b.datePlayed) return a.title.localeCompare(b.title);
        if (!a.datePlayed) return 1;
        if (!b.datePlayed) return -1;
        const cmp = b.datePlayed.localeCompare(a.datePlayed);
        return cmp !== 0 ? cmp : a.title.localeCompare(b.title);
      });
    case 'date-asc':
      return copy.sort((a, b) => {
        if (!a.datePlayed && !b.datePlayed) return a.title.localeCompare(b.title);
        if (!a.datePlayed) return 1;
        if (!b.datePlayed) return -1;
        const cmp = a.datePlayed.localeCompare(b.datePlayed);
        return cmp !== 0 ? cmp : a.title.localeCompare(b.title);
      });
    case 'rating-desc':
      return copy.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1) || a.title.localeCompare(b.title));
    case 'rating-asc':
      return copy.sort((a, b) => (a.rating ?? 999) - (b.rating ?? 999) || a.title.localeCompare(b.title));
    case 'title-asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return copy;
  }
}

// ---- Last updated -----------------------------------------------------------

function setLastUpdated(games) {
  if (!lastUpdatedEl) return;
  const played = games.filter(g => g.played && g.datePlayed);
  if (!played.length) { lastUpdatedEl.textContent = '—'; return; }
  const latest = played.map(g => g.datePlayed).sort().reverse()[0];
  lastUpdatedEl.textContent = formatDate(latest);
}

// ---- Modal ------------------------------------------------------------------

function openModal(game) {
  modalPoster.src = game.coverImage;
  modalPoster.alt = game.title;
  modalTitle.textContent = game.title;
  modalYear.textContent  = game.year || '';

  modalGenres.innerHTML = '';
  (game.genres || []).forEach(g => {
    const tag = document.createElement('span');
    tag.className = 'genre-tag';
    tag.textContent = g;
    modalGenres.appendChild(tag);
  });

  modalDesc.textContent = game.description || '';

  if (game.rating != null) {
    modalStars.innerHTML = renderStars(game.rating);
    modalRating.textContent = `${game.rating}/10`;
    document.getElementById('modal-rating-row').style.display = 'flex';
  } else {
    document.getElementById('modal-rating-row').style.display = 'none';
  }

  if (game.metacritic != null) {
    modalMetacritic.textContent = game.metacritic;
    modalMetacritic.className = 'metacritic-badge ' + metacriticClass(game.metacritic);
    document.getElementById('modal-metacritic-row').style.display = 'flex';
  } else {
    document.getElementById('modal-metacritic-row').style.display = 'none';
  }

  if (game.platform) {
    modalPlatform.textContent = game.platform;
    document.getElementById('modal-platform-row').style.display = 'flex';
  } else {
    document.getElementById('modal-platform-row').style.display = 'none';
  }

  if (game.datePlayed) {
    modalDate.textContent = formatDate(game.datePlayed);
    document.getElementById('modal-date-row').style.display = 'flex';
  } else {
    document.getElementById('modal-date-row').style.display = 'none';
  }

  // Only show status row for Dropped games
  if (game.completionStatus === 'Dropped') {
    modalStatus.textContent = 'Dropped';
    document.getElementById('modal-status-row').style.display = 'flex';
  } else {
    document.getElementById('modal-status-row').style.display = 'none';
  }

  if (game.rawgUrl) {
    modalRawgLink.href = game.rawgUrl;
    modalRawgLink.style.display = 'inline-block';
  } else {
    modalRawgLink.style.display = 'none';
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ---- Card -------------------------------------------------------------------

function createCard(game, isPlayed) {
  const li = document.createElement('li');

  const isDropped = game.completionStatus === 'Dropped';
  let cls = 'game-card';
  if (!isPlayed) cls += ' backlog-card';
  if (isDropped)  cls += ' dropped-card';

  const card = document.createElement('div');
  card.className = cls;

  const wrap = document.createElement('div');
  wrap.className = 'game-poster-wrap';

  const img = document.createElement('img');
  img.src     = game.coverImage;
  img.alt     = game.title;
  img.loading = 'lazy';
  wrap.appendChild(img);

  if (isDropped) {
    const vignette = document.createElement('div');
    vignette.className = 'dropped-overlay';
    wrap.appendChild(vignette);

    const badge = document.createElement('span');
    badge.className = 'dropped-badge';
    badge.textContent = 'Dropped';
    wrap.appendChild(badge);
  }

  card.appendChild(wrap);

  const titleLabel = document.createElement('div');
  titleLabel.className = 'game-title-label';
  titleLabel.textContent = game.title;

  const yearLabel = document.createElement('div');
  yearLabel.className = 'game-year-label';
  yearLabel.textContent = game.year || '';

  card.appendChild(titleLabel);
  card.appendChild(yearLabel);
  li.appendChild(card);

  if (isPlayed) card.addEventListener('click', () => openModal(game));

  return li;
}

// ---- Render -----------------------------------------------------------------

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const mode  = sortSelect.value;

  const played  = allGames.filter(g => g.played);
  const backlog = allGames.filter(g => !g.played);

  const sortedPlayed  = sortGames(played, mode);
  const sortedBacklog = sortGames(backlog, 'title-asc');

  playedList.innerHTML = '';
  const filteredPlayed = sortedPlayed.filter(g => !query || g.title.toLowerCase().includes(query));
  filteredPlayed.forEach(g => playedList.appendChild(createCard(g, true)));
  playedEmpty.style.display = filteredPlayed.length === 0 ? 'block' : 'none';

  backlogList.innerHTML = '';
  const filteredBacklog = sortedBacklog.filter(g => !query || g.title.toLowerCase().includes(query));
  filteredBacklog.forEach(g => backlogList.appendChild(createCard(g, false)));
  backlogEmpty.style.display = filteredBacklog.length === 0 ? 'block' : 'none';
}

// ---- Load -------------------------------------------------------------------

searchInput.addEventListener('input', render);
sortSelect.addEventListener('change', render);

fetch('games.json')
  .then(r => r.json())
  .then(data => {
    allGames = data;
    setLastUpdated(data);
    render();
  })
  .catch(err => console.error('Could not load games.json:', err));
