const startBtn = document.getElementById('start-btn');
const instructions = document.getElementById('instructions');
const gameArea = document.getElementById('game-area');
const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

const pairs = [
  { ingredients: ['🥜 Pistacho', '🍫 Chocolate blanco'], name: 'Cookie Pistacho Dream' },
  { ingredients: ['🌾 Avena', '🍯 Miel'], name: 'Cookie Natural Crunch' },
  { ingredients: ['🍪 Chips de chocolate', '🌼 Vainilla'], name: 'Cookie Classic Chip' }
];

let cards = [];
let flippedCards = [];
let matched = 0;

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function startGame() {
  instructions.classList.add('hidden');
  gameArea.classList.remove('hidden');
  createBoard();
}

function restartGame() {
  location.reload();
}

function createBoard() {
  cards = [];
  pairs.forEach(pair => {
    pair.ingredients.forEach(ingredient => {
      cards.push({ ingredient, pairName: pair.name });
    });
  });

  cards.sort(() => Math.random() - 0.5);

  gameBoard.innerHTML = '';
  cards.forEach(card => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.dataset.pair = card.pairName;
    div.dataset.ingredient = card.ingredient;
    div.addEventListener('click', () => flipCard(div));
    gameBoard.appendChild(div);
  });
}

function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.ingredient;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 600);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.pair === card2.dataset.pair && card1 !== card2) {
    showMessage(`🍪 ¡Combinación perfecta! Has creado la ${card1.dataset.pair}.`);
    matched += 2;
    flippedCards = [];

    if (matched === cards.length) {
      setTimeout(() => {
        showMessage('🎉 ¡Felicitaciones! Creaste todas las cookies 🍪');
        restartBtn.classList.remove('hidden');
      }, 800);
    }
  } else {
    flippedCards.forEach(c => {
      c.classList.remove('flipped');
      c.textContent = '';
    });
    flippedCards = [];
  }
}

function showMessage(text) {
  message.textContent = text;
  message.classList.remove('hidden');
  setTimeout(() => message.classList.add('hidden'), 2000);
}
