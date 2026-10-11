/* Navbar — barra de navegación de Bootstrap.
   Props:
   - totalJuegos (number): cantidad de juegos en el catálogo; se
     muestra como badge y se actualiza solo cuando App agrega o
     elimina un juego (ejemplo de props conectando componentes).
   - unidadesCarrito (number): productos en el carrito (contador). */
function Navbar({ totalJuegos, unidadesCarrito }) {
  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark" aria-label="Navegación principal">
        <div className="container">
          <a className="navbar-brand" href="#inicio">BonfireRest</a>

          {/* Botón del carrito: abre el offcanvas. Queda fuera del menú
              colapsable para verse siempre, también en móvil. */}
          <button
            className="btn btn-carrito position-relative order-lg-last ms-auto ms-lg-3 me-2 me-lg-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#panelCarrito"
            aria-controls="panelCarrito"
          >
            Carrito <span className="badge rounded-pill contador-carrito">{unidadesCarrito}</span>
          </button>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Abrir menú de navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="#inicio">Inicio</a></li>
              <li className="nav-item">
                <a className="nav-link" href="#catalogo">
                  Catálogo <span className="badge etiqueta-categoria ms-1">{totalJuegos}</span>
                </a>
              </li>
              <li className="nav-item"><a className="nav-link" href="#agregar">Agregar juego</a></li>
              <li className="nav-item"><a className="nav-link" href="#contacto">Contacto</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
