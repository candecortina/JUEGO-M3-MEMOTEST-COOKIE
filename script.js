let obras = [
    {nombre: "Mona Lisa", artista: "Leonardo da Vinci", desc: "Retrato icónico del Renacimiento.", img:"img/monalisa.jpg"},
    {nombre: "Noche estrellada", artista: "Van Gogh", desc: "Cielo turbulento lleno de movimiento.", img:"img/lanocheestrellada.jpg"},
    {nombre: "La joven de la perla", artista: "Vermeer", desc: "Retrato íntimo y misterioso.", img:"img/laperla.jpg"},
    {nombre: "El grito", artista: "Munch", desc: "Expresión del terror existencial.", img:"img/scream.jpg"}
];

let cartas = [];
let seleccionadas = [];
let tiempo = 60;
let cuentaRegresiva;
let encontradas = 0;

function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('visible'));
    document.getElementById(id).classList.add('visible');
}

function iniciarJuego() {
    mostrarPantalla('juego');
    cargarCartas();
    iniciarTiempo();
}

function cargarCartas() {
    cartas = [...obras, ...obras].sort(() => Math.random() - 0.5);
    let tablero = document.getElementById("tablero");
    tablero.innerHTML = "";

    cartas.forEach((obra, i) => {
        let c = document.createElement("div");
        c.className = "carta";
        c.dataset.indice = i;
        c.onclick = () => voltear(c);
        tablero.appendChild(c);
    });
}

function voltear(carta) {
    if (seleccionadas.length === 2) return;

    let index = carta.dataset.indice;
    carta.innerHTML = `<img src="${cartas[index].img}">`;
    seleccionadas.push(carta);

    if (seleccionadas.length === 2) {
        setTimeout(() => {
            let [c1, c2] = seleccionadas;
            let i1 = c1.dataset.indice;
            let i2 = c2.dataset.indice;

            if (cartas[i1].img === cartas[i2].img) {
                encontradas++;
                c1.style.pointerEvents = "none";
                c2.style.pointerEvents = "none";

                if (encontradas === obras.length) finJuego(true);
            } else {
                c1.innerHTML = "";
                c2.innerHTML = "";
            }
            seleccionadas = [];
        }, 800);
    }
}

function iniciarTiempo() {
    tiempo = 60;
    document.getElementById("tiempo").textContent = tiempo;

    cuentaRegresiva = setInterval(() => {
        tiempo--;
        document.getElementById("tiempo").textContent = tiempo;
        if (tiempo === 0) finJuego(false);
    }, 1000);
}

function finJuego(ganaste) {
    clearInterval(cuentaRegresiva);
    mostrarPantalla("final");

    document.getElementById("mensajeFinal").textContent =
        ganaste
            ? "¡Felicitaciones! Completaste el recorrido del museo."
            : "Se acabó el tiempo… Volvé a intentarlo.";

    cargarGaleria();
}

function cargarGaleria() {
    let cont = document.getElementById("galeriaFinal");
    cont.innerHTML = "";

    obras.forEach(o => {
        let div = document.createElement("div");
        div.className = "obra";
        div.innerHTML = `
            <img src="${o.img}">
            <h3>${o.nombre}</h3>
            <p>${o.artista}</p>
        `;
        div.onclick = () => abrirModal(o);
        cont.appendChild(div);
    });
}

function abrirModal(obra) {
    document.getElementById("modalFondo").style.display = "flex";
    document.getElementById("modalObra").innerHTML = `
        <img src="${obra.img}">
        <h2>${obra.nombre}</h2>
        <h4>${obra.artista}</h4>
        <p>${obra.desc}</p>
    `;
}

function cerrarModal() {
    document.getElementById("modalFondo").style.display = "none";
}

function reiniciar() {
    encontradas = 0;
    seleccionadas = [];
    iniciarJuego();
}
