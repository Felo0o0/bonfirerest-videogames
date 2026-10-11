/* Footer — pie de página (layout con Flexbox en styles.css). */
// Se calcula una sola vez al cargar el módulo
const ANIO_ACTUAL = new Date().getFullYear()

function Footer() {
  return (
    <footer className="py-4">
      <div className="container pie">
        <p className="mb-0">&copy; {ANIO_ACTUAL} BonfireRest Videogames</p>
        <nav aria-label="Enlaces del pie de página">
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
