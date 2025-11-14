/* script.js - ArtMatch final
   5 obras (duplicadas) -> 10 cartas -> 5 columnas x 2 filas (desktop)
   Timer: 45 minutos (2700s)
*/

// ----- CONFIG: obras con datos (titulo, artista, año y breve historia) -----
const ARTWORKS = [
    {
      id: 'monalisa',
      img: 'monalisa.jpg',
      title: 'La Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: 'c. 1503–1506',
      desc: 'Retrato pintado por Leonardo. Famosa por su enigmática sonrisa y la técnica sfumato; pieza central del Renacimiento.'
    },
    {
      id: 'scream',
      img: 'scream.jpg',
      title: 'El Grito',
      artist: 'Edvard Munch',
      year: '1893',
      desc: 'Icono del expresionismo. Munch plasmó la angustia moderna en una figura y un paisaje distorsionados, reflejando el temor existencial.'
    },
    {
      id: 'starry',
      img: 'lanochestrellada.jpg',
      title: 'La Noche Estrellada',
      artist: 'Vincent van Gogh',
      year: '1889',
      desc: 'Pintada durante la estancia en Saint-Rémy; destaca por su cielo en espiral y la intensidad emocional del color.'
    },
    {
      id: 'girl_pearl',
      img: 'laperla.jpg',
      title: 'La Joven de la Perla',
      artist: 'Johannes Vermeer',
      year: 'c. 1665',
      desc: 'Retrato íntimo y enigmático, llamado la "Mona Lisa del Norte", reconocido por el uso magistral de luz y color.'
    },
    {
      id: 'persistence',
      img: 'persistencia_memoria.jpg',
      title: 'La persistencia de la memoria',
      artist: 'Salvador Dalí',
      year: '1931',
      desc: 'Obra surrealista famosa por los relojes blandos que desafían la percepción del tiempo; símbolo del subconsciente.'
    }
  ];
  
  // ----- Estado global -----
  let durationSeconds = 45 * 60; // 45 minutos = 2700 segundos (45 * 60)
  let timeLeft = durationSeconds;
  let timerInterval = null;
  
  let firstCard = null;
  let lockBoard = false;
  let matchesFound = 0;
  
  // ----- Elementos DOM -----
  const startBtn = document.getElementById('startBtn');
  const startScreen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');
  const resultScreen = document.getElementById('result-screen');
  const board = document.getElementById('board');
  const timerEl = document.getElementById('timer');
  const foundEl = document.getElementById('found');
  
  const previewModal = document.getElementById('previewModal');
  const previewImg = document.getElementById('previewImg');
  const previewTitle = document.getElementById('previewTitle');
  const previewDesc = document.getElementById('previewDesc');
  const previewClose = document.getElementById('previewClose');
  
  const winModal = document.getElementById('winModal');
  const winGalleryBtn = document.getElementById('winGalleryBtn');
  const winCloseBtn = document.getElementById('winCloseBtn');
  
  const loseModal = document.getElementById('loseModal');
  const loseRetryBtn = document.getElementById('loseRetryBtn');
  const loseCloseBtn = document.getElementById('loseCloseBtn');
  
  const resultTitle = document.getElementById('result-title');
  const resultText = document.getElementById('result-text');
  const galleryEl = document.getElementById('gallery');
  const replayBtn = document.getElementById('replayBtn');
  
  // guardamos nodos nulos si no existen (compatibilidad)
  function safeGet(id){ return document.getElementById(id) || null; }
  
  // Inicializar modales ocultos por si sobra algo
  [previewModal, winModal, loseModal].forEach(m => m && m.classList.add('hidden'));
  
  /* ---------- UTIL ---------- */
  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function formatTime(seconds){
    const m = Math.floor(seconds/60).toString().padStart(2,'0');
    const s = (seconds%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }
  
  /* ---------- START GAME ---------- */
  startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startNewGame();
  });
  
  function startNewGame(){
    // reset estado
    timeLeft = durationSeconds;
    matchesFound = 0;
    firstCard = null;
    lockBoard = false;
    board.innerHTML = '';
    foundEl.textContent = '0';
  
    // crear deck: duplicar las 5 obras = 10 cartas
    const deck = shuffle([ ...ARTWORKS, ...ARTWORKS ]); // cada item tiene id,img,title...
  
    // por accesibilidad asignamos índice y dataset-id
    deck.forEach((art, idx) => {
      const card = document.createElement('button');
      card.className = 'card';
      card.type = 'button';
      card.dataset.artId = art.id;
      card.dataset.index = idx;
      card.setAttribute('aria-label', `Carta ${idx+1}`);
      // el front (imagen)
      const img = document.createElement('img');
      img.src = art.img;
      img.alt = `${art.title} — ${art.artist}`;
      card.appendChild(img);
  
      // click
      card.addEventListener('click', () => handleFlip(card, art));
      board.appendChild(card);
    });
  
    // iniciar timer visible
    timerEl.textContent = formatTime(timeLeft);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = formatTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame(false);
      }
    }, 1000);
  }
  
  /* ---------- FLIP / MATCH ---------- */
  function handleFlip(cardEl, art){
    if (lockBoard) return;
    if (cardEl.classList.contains('flipped')) return;
  
    // mostrar imagen
    cardEl.classList.add('flipped');
  
    if (!firstCard){
      firstCard = { cardEl, art };
      return;
    }
  
    // segundo click
    lockBoard = true;
    const second = { cardEl, art };
  
    if (firstCard.art.id === second.art.id){
      // match
      firstCard.cardEl.classList.add('matched');
      second.cardEl.classList.add('matched');
      matchesFound++;
      foundEl.textContent = String(matchesFound);
  
      // reset
      firstCard = null;
      lockBoard = false;
  
      // si completó todas las 5 parejas
      if (matchesFound === ARTWORKS.length){
        clearInterval(timerInterval);
        // mostrar cartel de ganaste
        showWin();
      }
    } else {
      // no coincide -> ocultar después
      setTimeout(() => {
        firstCard.cardEl.classList.remove('flipped');
        second.cardEl.classList.remove('flipped');
        firstCard = null;
        lockBoard = false;
      }, 900);
    }
  }
  
  /* ---------- MODALES ---------- */
  // PREVIEW modal open/close
  function openPreview(art){
    if (!previewModal) return;
    previewImg.src = art.img;
    previewTitle.textContent = `${art.title} — ${art.artist} (${art.year || ''})`;
    previewDesc.textContent = art.desc;
    previewModal.classList.remove('hidden');
  }
  if (previewClose) previewClose.addEventListener('click', () => previewModal.classList.add('hidden'));
  if (previewModal) previewModal.addEventListener('click', (e) => { if (e.target === previewModal) previewModal.classList.add('hidden'); });
  
  // WIN modal
  function showWin(){
    if (!winModal) return;
    winModal.classList.remove('hidden');
  }
  if (winCloseBtn) winCloseBtn.addEventListener('click', () => winModal.classList.add('hidden'));
  if (winGalleryBtn) winGalleryBtn.addEventListener('click', () => { winModal.classList.add('hidden'); showResult(true); });
  
  // LOSE modal
  function showLose(){
    if (!loseModal) return;
    loseModal.classList.remove('hidden');
  }
  if (loseCloseBtn) loseCloseBtn.addEventListener('click', () => loseModal.classList.add('hidden'));
  if (loseRetryBtn) loseRetryBtn.addEventListener('click', () => { loseModal.classList.add('hidden'); startNewGame(); });
  
  /* ---------- END GAME / GALLERY ---------- */
  function endGame(win){
    // hide game, show result
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
  
    // if win show win modal first
    if (win){
      resultTitle.textContent = '¡Felicidades! Completaste el museo';
      resultText.textContent = 'Acá está la galería con cada obra y su historia.';
    } else {
      resultTitle.textContent = 'Tiempo agotado';
      resultText.textContent = 'No lograste completar todas las parejas. Igual podés ver la galería.';
    }
  
    // show gallery grid
    renderGallery();
  }
  
  // show result triggered by win modal or timer lose -> consistent
  function showResult(wasWin){
    // hide modals and panel screens, show result-screen
    winModal && winModal.classList.add('hidden');
    loseModal && loseModal.classList.add('hidden');
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
  
    if (wasWin){
      resultTitle.textContent = '¡Felicidades! Completaste el museo';
      resultText.textContent = 'Acá está la galería con cada obra y su historia.';
    } else {
      resultTitle.textContent = 'Tiempo agotado';
      resultText.textContent = 'No lograste completar todas las parejas. Igual podés ver la galería.';
    }
  
    renderGallery();
  }
  
  function renderGallery(){
    galleryEl.innerHTML = '';
    ARTWORKS.forEach(art => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img src="${art.img}" alt="${art.title} — ${art.artist}">
        <h3>${art.title}</h3>
        <p><em>${art.artist} — ${art.year}</em></p>
        <p>${art.desc}</p>
      `;
      // preview when click
      item.addEventListener('click', () => openPreview(art));
      galleryEl.appendChild(item);
    });
  }
  
  /* ---------- REPLAY ---------- */
  replayBtn && replayBtn.addEventListener('click', () => {
    // reset screens
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    // reset timer and matches
    if (timerInterval) clearInterval(timerInterval);
    timeLeft = durationSeconds;
    timerEl.textContent = formatTime(timeLeft);
  });
  
  /* ---------- ESC key closes modals ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      previewModal && previewModal.classList.add('hidden');
      winModal && winModal.classList.add('hidden');
      loseModal && loseModal.classList.add('hidden');
    }
  });
  
  // Safety handlers for modal buttons that might be missing in some setups:
  winGalleryBtn && (winGalleryBtn.onclick = () => showResult(true));
  loseRetryBtn && (loseRetryBtn.onclick = () => { startNewGame(); loseModal.classList.add('hidden'); });
  loseCloseBtn && (loseCloseBtn.onclick = () => loseModal.classList.add('hidden'));
  
  // When timer reaches 0, show lose modal and result screen
  // (Timer routine already calls endGame(false) which shows result screen; to show loseModal too:)
  (function attachLoseFlow(){
    // intercept endGame call: show lose modal shortly after result screen appears
    const origEndGame = endGame;
    endGame = function(win){
      origEndGame(win);
      if (!win){
        // small delay to let result screen render then show lose modal
        setTimeout(() => { loseModal && loseModal.classList.remove('hidden'); }, 350);
      } else {
        // when win endGame called directly by match logic we also show winModal
        setTimeout(() => { winModal && winModal.classList.remove('hidden'); }, 200);
      }
    };
  })();
  