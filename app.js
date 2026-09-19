const USER = 'MCXiaoyang';
const API  = `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`;

const LANG_COLORS = {
  'C++': '#f34b7d',
  'C': '#555555',
  'Python': '#3572A5',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Makefile': '#427819',
  'CMake': '#DA3434',
  'Java': '#b07219',
  'Rust': '#dea584',
  'Go': '#00ADD8',
  'Shell': '#89e051'
};

/* ---------- theme ---------- */
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch(e) {}
}

(function initTheme() {
  try {
    const saved = localStorage.getItem('theme');
    const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();

/* ---------- utils ---------- */
function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function timeAgo(iso) {
  const d = new Date(iso);
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  if (s < 2592000) return Math.floor(s/86400) + 'd ago';
  if (s < 31536000) return Math.floor(s/2592000) + 'mo ago';
  return Math.floor(s/31536000) + 'y ago';
}

/* ---------- render ---------- */
function renderRepo(r) {
  const langColor = LANG_COLORS[r.language] || '#888';
  const lang = r.language
    ? `<span class="chip"><span class="dot" style="background:${langColor}"></span>${esc(r.language)}</span>`
    : '';
  const stars = r.stargazers_count > 0
    ? `<span class="chip">★ ${r.stargazers_count}</span>` : '';
  const forks = r.forks_count > 0
    ? `<span class="chip">⑂ ${r.forks_count}</span>` : '';
  const updated = `<span class="chip">${timeAgo(r.updated_at)}</span>`;
  const homepage = r.homepage
    ? `<a class="chip" href="${esc(r.homepage)}" target="_blank" rel="noopener">↗ Demo</a>` : '';

  return `
    <div class="card">
      <h3><a href="${esc(r.html_url)}" target="_blank" rel="noopener">${esc(r.name)}</a></h3>
      ${r.description ? `<p class="desc">${esc(r.description)}</p>` : ''}
      <div class="meta">
        ${lang}${stars}${forks}${updated}${homepage}
      </div>
    </div>
  `;
}

/* ---------- load ---------- */
async function load() {
  const box = document.getElementById('projects');
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const repos = await res.json();

    const list = repos
      .filter(r =>
        !r.fork &&
        !r.archived &&
        r.name !== `${USER}.github.io` &&
        r.name !== USER
      )
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count)
          return b.stargazers_count - a.stargazers_count;
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

    if (list.length === 0) {
      box.innerHTML = '<div class="loading">No public repos yet.</div>';
      return;
    }

    box.innerHTML = list.map(renderRepo).join('');

    document.getElementById('lastUpdated').textContent =
      'Updated ' + new Date().toLocaleTimeString();
  } catch (e) {
    box.innerHTML = `<div class="error">Failed to load: ${esc(e.message)}</div>`;
  }
}

load();
setInterval(load, 5 * 60 * 1000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) load();
});