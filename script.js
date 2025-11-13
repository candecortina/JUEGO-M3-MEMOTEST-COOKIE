// Lista de obras con imagen + artista + descripción
const artworks = [
    {
        artist: "Claude Monet",
        img: "mlaperla,jpg",
        desc: "Impresionismo puro, lleno de luz y pinceladas sueltas."
    },
    {
        artist: "Claude Monet",
        img: "scream.jpg",
        desc: "Una de las obras más representativas de la serie de estanques."
    },
    {
        artist: "Van Gogh",
        img: "lanochestrellada.jpg",
        desc: "Colores vibrantes y movimiento intenso característicos del artista."
    },
    {
        artist: "Van Gogh",
        img: "monalisa.jpg",
        desc: "Una obra que refleja el estilo postimpresionista y la emoción del autor."
    }
];

let timer = 60;
let countdown;
let firstCard = null;
let lockBoard = false;
let matched = 0;

// DOM
const board = document.getElementById("board");
const startBtn = document.getElementById("start-btn");
const timerBox = document.getElementById("timer");
const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const gallery = document.getElementById("gallery");
const endMessage = document.getElementById("end-message");

const previewModal = document.getElementById("preview-modal");
const previewImg = document.getElementById("preview-img");
const previewDesc = document.getElementById("preview-desc");
const closePreview = document.getElementById("close-preview");

// --- INICIO DEL JUEGO ---
startBtn.onclick = () => {
    welcomeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    startTimer();
    loadBoard();
};

function startTimer() {
    countdown = setInterval(() => {
        timer--;
        timerBox.textContent = `Tiempo: ${timer}s`;

        if (timer <= 0) {
            clearInterval(countdown);
            loseGame();
        }
    }, 1000);
}

// --- CARGA DE MEMOTEST ---
function loadBoard() {
    let cards = [...artworks, ...artworks]; // duplicar
    cards = shuffle(cards);

    cards.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.dataset.artist = item.artist;

        const img = document.createElement("img");
        img.src = item.img;

        div.appendChild(img);
        div.onclick = () => flipCard(div);
        board.appendChild(div);
    });
}

// Mezclar cartas
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Voltear carta
function flipCard(card) {
    if (lockBoard || card.classList.contains("matched")) return;

    card.querySelector("img").style.display = "block";

    if (!firstCard) {
        firstCard = card;
    } else {
        checkMatch(card);
    }
}

// Verificar match
function checkMatch(card) {
    lockBoard = true;

    if (card.dataset.artist === firstCard.dataset.artist) {
        card.classList.add("matched");
        firstCard.classList.add("matched");
        matched++;

        if (matched === artworks.length) {
            winGame();
        }

        reset();
    } else {
        setTimeout(() => {
            card.querySelector("img").style.display = "none";
            firstCard.querySelector("img").style.display = "none";
            reset();
        }, 900);
    }
}

function reset() {
    firstCard = null;
    lockBoard = false;
}

// --- FIN DEL JUEGO ---
function winGame() {
    clearInterval(countdown);
    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");

    endMessage.textContent = "🎉 ¡Completaste el recorrido del museo!";

    loadGallery();
}

function loseGame() {
    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");

    endMessage.textContent = "⏳ Se acabó el tiempo. ¡Intentalo de nuevo!";
    loadGallery();
}

// --- GALERÍA FINAL ---
function loadGallery() {
    artworks.forEach((a) => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        const img = document.createElement("img");
        img.src = a.img;

        item.appendChild(img);

        item.onclick = () => openPreview(a);

        gallery.appendChild(item);
    });
}

// --- MODAL ---
function openPreview(a) {
    previewImg.src = a.img;
    previewDesc.textContent = a.desc;
    previewModal.classList.remove("hidden");
}

closePreview.onclick = () => {
    previewModal.classList.add("hidden");
};
