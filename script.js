const obras = [
    { nombre: "La noche estrellada", imagen: "img/lanocheestrellada.jpg", descripcion: "Vincent van Gogh, 1889." },
    { nombre: "La Gioconda", imagen: "img/monalisa.jpg", descripcion: "Leonardo da Vinci, 1503." },
    { nombre: "El grito", imagen: "img/scream.jpg", descripcion: "Edvard Munch, 1893." },
    { nombre: "La joven de la perla", imagen: "img/laperla.jpg", descripcion: "Johannes Vermeer, 1665." },
    { nombre: "La persistencia de la memoria", imagen: "img/cuadro1.jpg", descripcion: "Salvador Dalí, 1931." },
    { nombre: "El nacimiento de Venus", imagen: "img/cuadro2.jpg", descripcion: "Sandro Botticelli, 1486." }
  ];
  
  let cartas = [...obras, ...obras];
  let seleccionadas = [];
  let paresEncontrados = 0;
  let tiempoRestante = 60;
  let timer;
  
  const inicio = document.getElementById("inicio");
  const juego = document.getElementById("juego");
  const galeria = document.getElementById("galeria");
  const tablero = document.getElementById("tablero");
  const tiempo = document.getElementById("tiempo");
  const mensaje = document.getElementById("mensaje");
  const contenedorGaleria = document.getElementById("contenedorGaleria");
  
  document.getElementById("btnComenzar").onclick = iniciarJuego;
  document.getElementById("reiniciar").onclick = () => location.reload();
  
  function iniciarJuego() {
    inicio.classList.add("oculto");
    juego.classList.remove("oculto");
    iniciarTiempo();
    generarTablero();
  }
  
  function generarTablero() {
    cartas.sort(() => Math.random() - 0.5);
    tablero.innerHTML = "";
    cartas.forEach((obra, i) => {
      const carta = document.createElement("div");
      carta.classList.add("carta");
      carta.dataset.nombre = obra.nombre;
      carta.innerHTML = `<img src="${obra.imagen}" alt="${obra.nombre}">`;
      carta.onclick = () => voltearCarta(carta, obra);
      tablero.appendChild(carta);
    });
  }
  
  function voltearCarta(carta, obra) {
    if (carta.classList.contains("revelada") || seleccionadas.length === 2) return;
  
    carta.classList.add("revelada");
    seleccionadas.push({ carta, obra });
  
    if (seleccionadas.length === 2) {
      const [a, b] = seleccionadas;
      if (a.obra.nombre === b.obra.nombre) {
        paresEncontrados++;
        seleccionadas = [];
        if (paresEncontrados === obras.length) {
          ganar();
        }
      } else {
        setTimeout(() => {
          a.carta.classList.remove("revelada");
          b.carta.classList.remove("revelada");
          seleccionadas = [];
        }, 800);
      }
    }
  }
  
  function iniciarTiempo() {
    timer = setInterval(() => {
      tiempoRestante--;
      tiempo.textContent = `Tiempo: ${tiempoRestante}s`;
      if (tiempoRestante <= 0) perder();
    }, 1000);
  }
  
  function ganar() {
    clearInterval(timer);
    mensaje.textContent = "¡Excelente! Descubriste todas las obras 🏆";
    setTimeout(mostrarGaleria, 2000);
  }
  
  function perder() {
    clearInterval(timer);
    mensaje.textContent = "⏰ Se acabó el tiempo. Intentalo nuevamente.";
    setTimeout(() => location.reload(), 2500);
  }
  
  function mostrarGaleria() {
    juego.classList.add("oculto");
    galeria.classList.remove("oculto");
    contenedorGaleria.innerHTML = "";
    obras.forEach(o => {
      const img = document.createElement("img");
      img.src = o.imagen;
      img.alt = o.nombre;
      img.onclick = () => mostrarVistaPrevia(o);
      contenedorGaleria.appendChild(img);
    });
  }
  
  const vistaPrevia = document.getElementById("vistaPrevia");
  const vistaImg = document.getElementById("vistaImg");
  const vistaTitulo = document.getElementById("vistaTitulo");
  const vistaDescripcion = document.getElementById("vistaDescripcion");
  document.getElementById("cerrarVista").onclick = () => vistaPrevia.classList.add("oculto");
  
  function mostrarVistaPrevia(obra) {
    vistaImg.src = obra.imagen;
    vistaTitulo.textContent = obra.nombre;
    vistaDescripcion.textContent = obra.descripcion;
    vistaPrevia.classList.remove("oculto");
  }
  