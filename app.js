let games = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let downloads = JSON.parse(localStorage.getItem("downloads")) || [];
let selectedGame = null;

fetch("games.json")
  .then(res => res.json())
  .then(data => {
    games = data;
    loadFeatured();
    loadCategories();
    renderGames(games);
  });

/* SEARCH */
document.getElementById("searchInput").addEventListener("input", e => {
  renderGames(games.filter(g =>
    g.name.toLowerCase().includes(e.target.value.toLowerCase())
  ));
});

/* RENDER */
function renderGames(list) {
  const grid = document.getElementById("gameGrid");
  grid.innerHTML = "";

  list.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
      <img src="${game.image}">
      <div class="game-info">
        <h4>${game.name}</h4>
        <div class="rating">⭐ ${game.rating}</div>
      </div>
    `;
    card.onclick = () => openModal(game);
    grid.appendChild(card);
  });
}

/* FEATURED */
function loadFeatured() {
  const slider = document.getElementById("featuredSlider");
  games.slice(0,3).forEach(g => {
    slider.innerHTML += `
      <div class="featured-card">
        <img src="${g.image}">
      </div>`;
  });
}

/* CATEGORIES */
function loadCategories() {
  const bar = document.getElementById("categoryBar");
  [...new Set(games.map(g => g.category))].forEach(cat => {
    const span = document.createElement("span");
    span.textContent = cat;
    span.onclick = () => renderGames(games.filter(g => g.category === cat));
    bar.appendChild(span);
  });
}

/* MODAL */
function openModal(game) {
  selectedGame = game;
  document.getElementById("modalImage").src = game.image;
  document.getElementById("modalTitle").textContent = game.name;
  document.getElementById("modalCategory").textContent = "Category: " + game.category;
  document.getElementById("modalRating").textContent = "⭐ " + game.rating;
  document.getElementById("downloadBtn").onclick = () => downloadGame(game);
  document.getElementById("gameModal").style.display = "block";
}

function closeModal() {
  document.getElementById("gameModal").style.display = "none";
}

/* DOWNLOAD */
function downloadGame(game) {
  downloads.push(game.name);
  localStorage.setItem("downloads", JSON.stringify(downloads));
  window.open(game.link, "_blank");
}

/* FAVORITES */
function toggleFavorite() {
  if (!favorites.includes(selectedGame.name)) {
    favorites.push(selectedGame.name);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

/* FILTERS */
function showFavorites() {
  renderGames(games.filter(g => favorites.includes(g.name)));
}

function showDownloads() {
  renderGames(games.filter(g => downloads.includes(g.name)));
}

function showAll() {
  renderGames(games);
}

function sortGames(type) {
  let sorted = [...games];
  if (type === "rating") sorted.sort((a,b)=>b.rating-a.rating);
  if (type === "name") sorted.sort((a,b)=>a.name.localeCompare(b.name));
  renderGames(sorted);
}