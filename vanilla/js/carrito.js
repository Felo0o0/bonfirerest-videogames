/* =============================================================
   carrito.js — Carrito de compras (JavaScript puro)

   - El carrito es un arreglo de objetos { id, nombre, precio, cantidad }.
   - Se guarda en localStorage para que no se pierda al recargar.
   - renderCarrito() vuelve a dibujar la lista, el total y el
     contador de la navbar cada vez que el carrito cambia.
   ============================================================= */

const CLAVE_CARRITO = "bonfirerest-carrito";
const CANTIDAD_MAXIMA = 10;

const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const mensajeCarrito = document.getElementById("mensajeCarrito");
const btnFinalizar = document.getElementById("btnFinalizar");
const btnVaciar = document.getElementById("btnVaciar");

let carrito = cargarCarrito();


/* ---------- Persistencia en localStorage ----------
   try/catch: en modo incógnito o con el almacenamiento bloqueado,
   localStorage puede fallar; en ese caso el carrito funciona igual,
   solo que no se guarda. */
function cargarCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(guardado) ? guardado : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito() {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        // Sin almacenamiento disponible: se ignora
    }
}


/* ---------- Operaciones del carrito ---------- */

// Agrega un juego; si ya estaba, suma 1 a la cantidad
function agregarAlCarrito(id) {
    const juego = videojuegos.find(function (j) { return j.id === id; });
    if (!juego) return;

    const item = carrito.find(function (i) { return i.id === id; });
    if (item) {
        if (item.cantidad >= CANTIDAD_MAXIMA) {
            mostrarMensajeCarrito("Máximo " + CANTIDAD_MAXIMA + " unidades por juego.", "warning");
            return;
        }
        item.cantidad++;
    } else {
        carrito.push({ id: juego.id, nombre: juego.nombre, precio: juego.precio, cantidad: 1 });
    }

    actualizarCarrito();
    mostrarMensajeCarrito('"' + juego.nombre + '" se agregó al carrito.', "success");
}

// Suma (+1) o resta (-1) unidades; si llega a 0 se quita del carrito
function cambiarCantidad(id, cambio) {
    const item = carrito.find(function (i) { return i.id === id; });
    if (!item) return;

    item.cantidad = Math.min(item.cantidad + cambio, CANTIDAD_MAXIMA);
    if (item.cantidad <= 0) {
        quitarDelCarrito(id);
        return;
    }
    actualizarCarrito();
}

function quitarDelCarrito(id) {
    carrito = carrito.filter(function (i) { return i.id !== id; });
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Cálculos con reduce: recorre el arreglo acumulando un valor
function calcularTotal() {
    return carrito.reduce(function (suma, item) { return suma + item.precio * item.cantidad; }, 0);
}

function contarUnidades() {
    return carrito.reduce(function (suma, item) { return suma + item.cantidad; }, 0);
}

function actualizarCarrito() {
    guardarCarrito();
    renderCarrito();
}


/* ---------- Dibujo del carrito en el DOM ---------- */
function renderCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        const vacio = document.createElement("li");
        vacio.className = "list-group-item text-center sin-resultados";
        vacio.textContent = "Tu carrito está vacío.";
        listaCarrito.appendChild(vacio);
    }

    carrito.forEach(function (item) {
        const fila = document.createElement("li");
        fila.className = "list-group-item item-carrito";

        const info = document.createElement("div");
        info.className = "flex-grow-1";

        const nombre = document.createElement("p");
        nombre.className = "mb-1 fw-semibold";
        nombre.textContent = item.nombre;

        const subtotal = document.createElement("small");
        subtotal.className = "subtotal-carrito";
        subtotal.textContent = formatearPrecio(item.precio) + " c/u · Subtotal " + formatearPrecio(item.precio * item.cantidad);

        info.append(nombre, subtotal);

        // Controles: - cantidad + y botón quitar
        const controles = document.createElement("div");
        controles.className = "d-flex align-items-center gap-1";

        const restar = crearBotonCarrito("−", "Quitar una unidad de " + item.nombre, "restar", item.id);
        const cantidad = document.createElement("span");
        cantidad.className = "cantidad";
        cantidad.textContent = item.cantidad;
        const sumar = crearBotonCarrito("+", "Agregar una unidad de " + item.nombre, "sumar", item.id);
        const quitar = crearBotonCarrito("✕", "Quitar " + item.nombre + " del carrito", "quitar", item.id);
        quitar.classList.add("ms-2");

        controles.append(restar, cantidad, sumar, quitar);
        fila.append(info, controles);
        listaCarrito.appendChild(fila);
    });

    totalCarrito.textContent = formatearPrecio(calcularTotal());
    contadorCarrito.textContent = contarUnidades();

    // Sin productos no se puede finalizar ni vaciar
    btnFinalizar.disabled = carrito.length === 0;
    btnVaciar.disabled = carrito.length === 0;
}

function crearBotonCarrito(texto, etiqueta, accion, id) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-sm btn-cantidad";
    boton.textContent = texto;
    boton.setAttribute("aria-label", etiqueta);
    boton.dataset.accion = accion;
    boton.dataset.id = id;
    return boton;
}

function mostrarMensajeCarrito(texto, tipo) {
    mensajeCarrito.innerHTML = "";
    const alerta = document.createElement("div");
    alerta.className = "alert alert-" + tipo + " py-2 mb-3";
    alerta.setAttribute("role", "status");
    alerta.textContent = texto;
    mensajeCarrito.appendChild(alerta);
}


/* ---------- Eventos ----------
   Delegación de eventos: en vez de poner un listener en cada botón
   (que se crean y destruyen al filtrar), se pone UNO en el contenedor
   y se revisa qué botón recibió el click. */

// Botones "Agregar" de las tarjetas del catálogo
document.getElementById("listaJuegos").addEventListener("click", function (evento) {
    const boton = evento.target.closest(".btn-agregar");
    if (boton) agregarAlCarrito(boton.dataset.id);
});

// Botones − + ✕ dentro del carrito
listaCarrito.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;

    const id = boton.dataset.id;
    if (boton.dataset.accion === "sumar") cambiarCantidad(id, 1);
    if (boton.dataset.accion === "restar") cambiarCantidad(id, -1);
    if (boton.dataset.accion === "quitar") quitarDelCarrito(id);
    mensajeCarrito.innerHTML = "";
});

btnVaciar.addEventListener("click", function () {
    vaciarCarrito();
    mostrarMensajeCarrito("Se vació el carrito.", "secondary");
});

// Compra simulada (el proyecto no tiene backend ni pasarela de pago)
btnFinalizar.addEventListener("click", function () {
    const total = formatearPrecio(calcularTotal());
    const unidades = contarUnidades();
    vaciarCarrito();
    mostrarMensajeCarrito("¡Compra confirmada! " + unidades + " producto(s) por " + total + ". Te enviaremos los detalles por correo.", "success");
});

document.addEventListener("DOMContentLoaded", renderCarrito);
