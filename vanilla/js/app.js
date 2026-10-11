/* =============================================================
   app.js — Lógica de la tienda (JavaScript puro, sin librerías)

   1. formatearPrecio()   -> muestra precios en pesos chilenos.
   2. crearTarjeta()      -> crea UNA tarjeta con createElement.
   3. renderJuegos()      -> recorre el arreglo y pinta las tarjetas.
   4. crearFiltros()      -> genera un botón por categoría.
   5. filtrarPorCategoria -> filtra el arreglo y vuelve a pintar.
   6. Validación del formulario de contacto.
   (El carrito de compras está en carrito.js)
   ============================================================= */

// Referencias a los elementos del DOM que vamos a modificar
const listaJuegos = document.getElementById("listaJuegos");
const contenedorFiltros = document.getElementById("filtros");
const contadorResultados = document.getElementById("contadorResultados");
const formContacto = document.getElementById("formContacto");
const alertaFormulario = document.getElementById("alertaFormulario");

// Categoría seleccionada actualmente
let categoriaActiva = "Todas";


/* -------------------------------------------------------------
   1. Formato de precio: 39990 -> "$39.990"
   ------------------------------------------------------------- */
function formatearPrecio(numero) {
    return "$" + numero.toLocaleString("es-CL");
}


/* -------------------------------------------------------------
   2. Crea el elemento de UNA tarjeta a partir de un objeto juego.
   Se usa createElement + textContent (y no innerHTML con los
   datos) para que el contenido se inserte como texto seguro.
   ------------------------------------------------------------- */
function crearTarjeta(juego) {
    // Columna de la grilla de Bootstrap
    const columna = document.createElement("div");
    columna.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

    // <article>: cada tarjeta es un contenido independiente
    const tarjeta = document.createElement("article");
    tarjeta.className = "card h-100 tarjeta-juego";

    const imagen = document.createElement("img");
    imagen.src = juego.imagen;
    imagen.alt = "Portada de " + juego.nombre;
    imagen.className = "card-img-top";
    imagen.loading = "lazy";
    // Si la imagen no existe o falla, se muestra una portada genérica
    imagen.onerror = function () {
        imagen.onerror = null;
        imagen.src = "img/sin-portada.svg";
    };

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column";

    const categoria = document.createElement("span");
    categoria.className = "badge etiqueta-categoria align-self-start mb-2";
    categoria.textContent = juego.categoria;

    const titulo = document.createElement("h3");
    titulo.className = "card-title h5";
    titulo.textContent = juego.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = juego.descripcion;

    // Pie de la tarjeta: precio + botón de carrito (Flexbox)
    const pie = document.createElement("div");
    pie.className = "d-flex justify-content-between align-items-center mt-auto gap-2";

    const precio = document.createElement("p");
    precio.className = "precio mb-0";
    precio.textContent = formatearPrecio(juego.precio);

    // El click de este botón lo maneja carrito.js (delegación de eventos)
    const botonCarrito = document.createElement("button");
    botonCarrito.type = "button";
    botonCarrito.className = "btn btn-sm btn-primary btn-agregar";
    botonCarrito.dataset.id = juego.id;
    botonCarrito.textContent = "Agregar";
    botonCarrito.setAttribute("aria-label", "Agregar " + juego.nombre + " al carrito");

    pie.append(precio, botonCarrito);

    // Armamos la estructura: cuerpo -> tarjeta -> columna
    cuerpo.append(categoria, titulo, descripcion, pie);
    tarjeta.append(imagen, cuerpo);
    columna.appendChild(tarjeta);

    return columna;
}


/* -------------------------------------------------------------
   3. Pinta en pantalla la lista recibida.
   Primero limpia el contenedor y luego agrega una tarjeta por
   cada elemento del arreglo (forEach).
   ------------------------------------------------------------- */
function renderJuegos(lista) {
    listaJuegos.innerHTML = "";

    if (lista.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "col-12 text-center sin-resultados";
        vacio.textContent = "No hay videojuegos en esta categoría.";
        listaJuegos.appendChild(vacio);
    }

    lista.forEach(function (juego) {
        listaJuegos.appendChild(crearTarjeta(juego));
    });

    const palabra = lista.length === 1 ? "videojuego" : "videojuegos";
    contadorResultados.textContent = "Mostrando " + lista.length + " " + palabra;
}


/* -------------------------------------------------------------
   4. Genera los botones de filtro.
   Las categorías se obtienen del propio arreglo con un Set
   (elimina repetidos), así un juego con categoría nueva crea
   su botón automáticamente.
   ------------------------------------------------------------- */
function crearFiltros() {
    const categorias = ["Todas", ...new Set(videojuegos.map(function (j) { return j.categoria; }))];

    categorias.forEach(function (categoria) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn btn-filtro";
        boton.textContent = categoria;
        boton.dataset.categoria = categoria;

        if (categoria === categoriaActiva) {
            boton.classList.add("activo");
            boton.setAttribute("aria-pressed", "true");
        } else {
            boton.setAttribute("aria-pressed", "false");
        }

        boton.addEventListener("click", function () {
            filtrarPorCategoria(categoria);
        });

        contenedorFiltros.appendChild(boton);
    });
}


/* -------------------------------------------------------------
   5. Filtra el arreglo por categoría y actualiza el botón activo.
   ------------------------------------------------------------- */
function filtrarPorCategoria(categoria) {
    categoriaActiva = categoria;

    const filtrados = categoria === "Todas"
        ? videojuegos
        : videojuegos.filter(function (juego) { return juego.categoria === categoria; });

    renderJuegos(filtrados);

    // Marcar visualmente el botón seleccionado
    contenedorFiltros.querySelectorAll(".btn-filtro").forEach(function (boton) {
        const esActivo = boton.dataset.categoria === categoria;
        boton.classList.toggle("activo", esActivo);
        boton.setAttribute("aria-pressed", esActivo ? "true" : "false");
    });
}


/* -------------------------------------------------------------
   6. Validación del formulario de contacto
   ------------------------------------------------------------- */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Muestra u oculta el error de un campo usando las clases de Bootstrap
function marcarCampo(input, mensajeError) {
    const contenedorError = document.getElementById("error" + input.id.charAt(0).toUpperCase() + input.id.slice(1));

    if (mensajeError) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        contenedorError.textContent = mensajeError;
        return false;
    }

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    contenedorError.textContent = "";
    return true;
}

// Reglas de cada campo. Devuelven el mensaje de error o "" si está bien.
function validarNombre(valor) {
    if (valor === "") return "El nombre es obligatorio.";
    if (valor.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(valor)) return "El nombre solo puede contener letras y espacios.";
    return "";
}

function validarEmail(valor) {
    if (valor === "") return "El email es obligatorio.";
    if (!REGEX_EMAIL.test(valor)) return "Ingresa un email válido (ejemplo: nombre@correo.com).";
    return "";
}

function validarMensaje(valor) {
    if (valor === "") return "El mensaje es obligatorio.";
    if (valor.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
    return "";
}

formContacto.addEventListener("submit", function (evento) {
    // Evita que el formulario recargue la página
    evento.preventDefault();
    alertaFormulario.innerHTML = "";

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");

    // Se validan los 3 campos (no se corta en el primero) para mostrar todos los errores juntos
    const nombreOk = marcarCampo(nombre, validarNombre(nombre.value.trim()));
    const emailOk = marcarCampo(email, validarEmail(email.value.trim()));
    const mensajeOk = marcarCampo(mensaje, validarMensaje(mensaje.value.trim()));

    if (!nombreOk || !emailOk || !mensajeOk) {
        mostrarAlerta("Revisa los campos marcados en rojo.", "danger");
        return;
    }

    // Todo correcto: se simula el envío
    mostrarAlerta("¡Gracias, " + nombre.value.trim() + "! Tu mensaje fue enviado correctamente.", "success");
    formContacto.reset();
    [nombre, email, mensaje].forEach(function (input) { input.classList.remove("is-valid"); });
});

// Mientras el usuario corrige un campo marcado con error, se revalida
// en cada tecla (evento input) para quitar el error apenas quede bien.
[
    ["nombre", validarNombre],
    ["email", validarEmail],
    ["mensaje", validarMensaje]
].forEach(function (par) {
    const input = document.getElementById(par[0]);
    input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) {
            marcarCampo(input, par[1](input.value.trim()));
        }
    });
});

// Crea una alerta de Bootstrap con el mensaje indicado
function mostrarAlerta(texto, tipo) {
    const alerta = document.createElement("div");
    alerta.className = "alert alert-" + tipo + " mb-0";
    alerta.setAttribute("role", "alert");
    alerta.textContent = texto;
    alertaFormulario.innerHTML = "";
    alertaFormulario.appendChild(alerta);
}


/* -------------------------------------------------------------
   Inicio: se ejecuta cuando el HTML terminó de cargarse
   ------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    crearFiltros();
    renderJuegos(videojuegos);
});
