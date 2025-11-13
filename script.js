const obras = [
    {
      nombre: "La Gioconda",
      artista: "Leonardo da Vinci",
      descripcion: "Retrato icónico del Renacimiento que simboliza la perfección del equilibrio y la armonía.",
      imagen: "img/monalisa.jpg"
    },
    {
      nombre: "La noche estrellada",
      artista: "Vincent van Gogh",
      descripcion: "Una visión expresiva y turbulenta del cielo nocturno sobre Saint-Rémy.",
      imagen: "img/lanocheestrellada.jpg"
    },
    {
      nombre: "El grito",
      artista: "Edvard Munch",
      descripcion: "Expresión del miedo existencial y la angustia humana, una de las obras más reconocibles del arte moderno.",
      imagen: "img/scream.jpg"
    },
    {
      nombre: "La joven de la perla",
      artista: "Johannes Vermeer",
      descripcion: "Retrato delicado que capta la luz y el misterio con una composición simple y equilibrada.",
      imagen: "img/laperla.jpg"
    },
    {
      nombre: "La persistencia de la memoria",
      artista: "Salvador Dalí",
      descripcion: "Obra surrealista que representa el paso del tiempo con relojes derretidos.",
      imagen: "img/cuadro1.jpg"
    },
    {
      nombre: "Los girasoles",
      artista: "Vincent van Gogh",
      descripcion: "Serie de naturalezas muertas vibrantes que simbolizan la amistad y la gratitud.",
      imagen: "img/cuadro2.jpg"
    }
  ];
  
  let cards = [];
  let flipped = [];
  let matched = 0;
  
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const galleryScreen = document.getElementById("gallery-screen");
  const gameBoard = document.getElementById("game-board");
  const gallery = document.getElementById("gallery");
  
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", () => location.reload());
  
  function startGame() {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    createBoard();
  }
  
  function createBoard() {
    cards = [...obras, ...obras].sort(() => Math.random() - 0.5);
    gameBoard.innerHTML = "";
    cards.forEach((obra, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.index = index;
  
      const img = document.createElement("img");
      img.src = obra.imagen;
      card.appendChild(img);
  
      card.addEventListener("click", () => flipCard(card));
      gameBoard.appendChild(card);
    });
  }
  
  function flipCard(card) {
    if (flipped.length === 2 || card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    flipped.push(card);
  
    if (flipped.length === 2) {
      setTimeout(checkMatch, 600);
    }
  }
  
  function checkMatch() {
    const [card1, card2] = flipped;
    const obra1 = cards[card1.dataset.index];
    const obra2 = cards[card2.dataset.index];
  
    if (obra1.nombre === obra2.nombre) {
      matched += 2;
      flipped = [];
      if (matched === cards.length) {
        setTimeout(showGallery, 1000);
      }
    } else {
      flipped.forEach(c => c.classList.remove("flipped"));
      flipped = [];
    }
  }
  
  function showGallery() {
    gameScreen.classList.add("hidden");
    galleryScreen.classList.remove("hidden");
    gallery.innerHTML = "";
  
    obras.forEach(obra => {
      const item = document.createElement("div");
      item.classList.add("gallery-item");
  
      item.innerHTML = `
        <img src="${obra.imagen}" alt="${obra.nombre}">
        <h3>${obra.nombre}</h3>
        <p><strong>${obra.artista}</strong></p>
        <p>${obra.descripcion}</p>
      `;
      gallery.appendChild(item);
    });
  }
  