// --- CONFIGURACIÓN DE OBRAS ---
const artworks = [
    {
        img: "monalisa.jpg",
        title: "La Mona Lisa",
        artist: "Leonardo da Vinci",
        desc: "Pintada entre 1503 y 1506. Considerada la obra más famosa del mundo, destaca por su técnica sfumato y la expresiva ambigüedad de la sonrisa."
    },
    {
        img: "scream.jpg",
        title: "El Grito",
        artist: "Edvard Munch",
        desc: "Realizada en 1893. Representa la angustia existencial moderna, con un cielo ondulante y un personaje en estado de desesperación emocional."
    },
    {
        img: "lanochestrellada.jpg",
        title: "La Noche Estrellada",
        artist: "Vincent van Gogh",
        desc: "Pintada en 1889 durante la estancia de Van Gogh en Saint-Rémy. Destaca por su cielo en espiral icónico y la intensidad emocional del color."
    },
    {
        img: "laperla.jpg",
        title: "La Joven de la Perla",
        artist: "Johannes Vermeer",
        desc: "Realizada alrededor de 1665. Conocida como la 'Mona Lisa del Norte', destaca por el uso magistral de luz y la mirada directa de la modelo."
    }
];

let timeLeft = 45;
let timerInterval;
let firstCard = null;
let lock = false;
let matches = 0;

// ELEMENTOS
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const gameBoard = document.getElementById("game-board");
const timer = document.getElementById("timer");

const previewModal = document.getElementById("preview-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
document.getElementById("close-modal").onclick = () => previewModal.classList.add("hidden");

// INICIO
document.getElementById("start-btn").addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    startGame();
});

function startGame() {
    const doubled = [...artworks, ...artworks];
    shuffle(doubled);
    gameBoard.innerHTML = "";

    doubled.forEach((art) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `<img src="${art.img}">`;
        card.addEventListener("click", () => flipCard(card, art));

        gameBoard.appendChild(card);
    });

    startTimer();
}

// TIMER
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = `Tiempo: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
}

// MECÁNICA
function flipCard(card, art) {
    if (lock || card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = { card, art };
    } else {
        lock = true;

        if (firstCard.art.img === art.img) {
            firstCard.card.classList.add("matched");
            card.classList.add("matched");
            matches++;

            if (matches === artworks.length) {
                endGame(true);
            }

            lock = false;
            firstCard = null;
        } else {
            setTimeout(() => {
                firstCard.card.classList.remove("flipped");
                card.classList.remove("flipped");
                lock = false;
                firstCard = null;
            }, 800);
        }
    }
}

// FIN DEL JUEGO
function endGame(win) {
    clearInterval(timerInterval);
    gameScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    document.getElementById("result-title").textContent =
        win ? "🎉 ¡Felicidades!" : "⏳ ¡Tiempo agotado!";

    document.getElementById("result-text").textContent =
        win ? "Completaste todas las obras. Mirá la galería final:" :
              "No lograste completar el memotest. ¡Intentá de nuevo!";

    showGallery();
}

// GALERÍA FINAL
function showGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    artworks.forEach(art => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        item.innerHTML = `
            <img src="${art.img}">
            <h3>${art.title} — ${art.artist}</h3>
            <p>${art.desc}</p>
        `;

        item.addEventListener("click", () => openPreview(art));

        gallery.appendChild(item);
    });
}

// MODAL PREVIEW
function openPreview(art) {
    modalImg.src = art.img;
    modalTitle.textContent = `${art.title} — ${art.artist}`;
    modalDesc.textContent = art.desc;
    previewModal.classList.remove("hidden");
}

// SHUFFLE
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
