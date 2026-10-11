/* Hero — sección de bienvenida (layout con Flexbox en styles.css). */
function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-contenido">
        <p className="hero-etiqueta">Tienda online de videojuegos</p>
        <h1 className="hero-titulo">
          Descansa en la hoguera.<br />Elige tu próxima aventura.
        </h1>
        <p className="hero-texto">
          Juegos de PS5: RPG, acción, plataformas y shooters. Precios en pesos chilenos.
        </p>
        <a href="#catalogo" className="btn btn-primary btn-lg">Ver catálogo</a>
      </div>
    </section>
  )
}

export default Hero
