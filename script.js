// Lista de obras
const artworks = [
    { artist: "Monet", img: "images/monet1.jpg", desc: "Obra clásica del impresionismo." },
    { artist: "Monet", img: "images/monet2.jpg", desc: "Paisaje lleno de luz y color." },
    { artist: "Van Gogh", img: "images/vangogh1.jpg", desc: "Tonos vibrantes y expresivos." },
    { artist: "Van Gogh", img: "images/vangogh2.jpg", desc: "Trazos intensos y emocionantes." }
];

let first = null;
let lock = false;
let matched = 0;
let time = 60;
let interval;

// DOM
const startBtn = document.getElementById("start-btn");
const welcome = document.getElementById("welcome");
const game = document.getElementById("game");
const end = document.getElementById("end");
const board = document.getElementById("board");
const timerBox = document.getElementById("timer");
const endTitle = document.getElementById("end-title");
const gallery = document.getElementById("gallery");

// Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalDesc = document.getElementById("modal-desc");
const closeModal = document.getElementById("close-modal");

/* ───────────────────────────── START ───────────────────────────── */

startBtn.onclick = () => {
    welcome.classList.add("hidden");
    game.classList.remove("hidden");

    buildBoard();
    startTimer();
};

function startTimer() {
    interval = setInterval(() => {
        time--;
        timerBox.textContent = `Tiempo: ${time}s`;

        if (time <= 0) {
            clearInterval(interval);
            finish(false);
        }
    }, 1000);
}

/* ───────────────────────────── BOARD ───────────────────────────── */

function buildBoard() {
    let cards = [...artworks, ...artworks];
    cards = cards.sort(() => Math.random() - 0.5);

    cards.forEach((art) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.artist = art.artist;

        const img = document.createElement("img");
        img.src = art.img;

        card.appendChild(img);

        card.onclick = () => flip(card);
        board.appendChild(card);
    });
}

function flip(card) {
    if (lock || card === first) return;

    card.querySelector("img").style.display = "block";

    if (!first) {
        first = card;
    } else {
        checkMatch(card);
    }
}

function checkMatch(card) {
    lock = true;

    if (card.dataset.artist === first.dataset.artist) {
        matched++;

        card.classList.add("matched");
        first.classList.add("matched");

        if (matched === artworks.length) {
            clearInterval(interval);
            finish(true);
        }

        reset();
    } else {
        setTimeout(() => {
            card.querySelector("img").style.display = "none";
            first.querySelector("img").style.display = "none";
            reset();
        }, 900);
    }
}

function reset() {
    first = null;
    lock = false;
}

/* ───────────────────────────── END ───────────────────────────── */

function finish(win) {
    game.classList.add("hidden");
    end.classList.remove("hidden");

    endTitle.textContent = win
        ? "🎉 ¡Completaste el recorrido del museo!"
        : "⏳ Se acabó el tiempo, intentá otra vez";

    loadGallery();
}

function loadGallery() {
    artworks.forEach((a) => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        const img = document.createElement("img");
        img.src = a.img;

        item.appendChild(img);

        item.onclick = () => openModal(a);

        gallery.appendChild(item);
    });
}

/* ───────────────────────────── MODAL ───────────────────────────── */

function openModal(a) {
    modalImg.src = a.img;
    modalDesc.textContent = a.desc;
    modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");
