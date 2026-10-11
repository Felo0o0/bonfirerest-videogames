/* =============================================================
   App — componente raíz

   Aquí vive el ESTADO principal de la aplicación:
   - juegos:    lista de videojuegos (se carga desde un JSON).
   - categoria: categoría seleccionada en el filtro.
   - cargando / errorCarga: estado de la carga de datos.
   - carrito: viene del hook personalizado useCarrito().

   App no dibuja tarjetas ni botones: le pasa los datos y las
   funciones a sus componentes hijos mediante PROPS. Cuando un
   hijo llama a una de esas funciones (ej. onCambiarCategoria),
   el estado de App cambia y React vuelve a renderizar a todos
   los componentes que dependen de él.
   ============================================================= */
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import GameList from './components/GameList.jsx'
import AddGameForm from './components/AddGameForm.jsx'
import ContactForm from './components/ContactForm.jsx'
import Footer from './components/Footer.jsx'
import Cart from './components/Cart.jsx'
import { useCarrito } from './hooks/useCarrito.js'

const URL_DATOS = 'data/videojuegos.json'

function App() {
  const [juegos, setJuegos] = useState([])
  const [categoria, setCategoria] = useState('Todas')
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)
  const carrito = useCarrito()

  // Pide los videojuegos al archivo JSON (simula una API externa).
  // Devuelve una promesa con el arreglo de juegos.
  async function obtenerJuegos() {
    const respuesta = await fetch(URL_DATOS)
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar el catálogo (HTTP ${respuesta.status}).`)
    }
    return respuesta.json()
  }

  // Guarda en el estado el resultado de la carga (éxito o error)
  function aplicarCarga(promesa) {
    return promesa
      .then((datos) => {
        setJuegos(datos)
        setCategoria('Todas')
        setErrorCarga(null)
      })
      .catch((error) => setErrorCarga(error.message))
      .finally(() => setCargando(false))
  }

  // useEffect con [] -> se ejecuta una sola vez, después del primer render
  useEffect(() => {
    aplicarCarga(obtenerJuegos())
  }, [])

  // Botones "Reintentar" y "Restaurar catálogo original"
  function recargarJuegos() {
    setCargando(true)
    setErrorCarga(null)
    aplicarCarga(obtenerJuegos())
  }

  // Agrega un juego nuevo al estado (copia del arreglo + el nuevo)
  function agregarJuego(nuevoJuego) {
    setJuegos((anteriores) => [...anteriores, nuevoJuego])
    setCategoria('Todas')
  }

  // Elimina un juego del estado filtrando por id.
  // Si estaba en el carrito, también se quita de ahí.
  function eliminarJuego(id) {
    setJuegos((anteriores) => anteriores.filter((juego) => juego.id !== id))
    carrito.quitar(id)
  }

  // Valores DERIVADOS del estado (se recalculan en cada render)
  const categorias = ['Todas', ...new Set(juegos.map((juego) => juego.categoria))]

  // Si se eliminó el último juego de la categoría activa, se vuelve a "Todas"
  const categoriaVigente = categorias.includes(categoria) ? categoria : 'Todas'

  const juegosFiltrados =
    categoriaVigente === 'Todas'
      ? juegos
      : juegos.filter((juego) => juego.categoria === categoriaVigente)

  return (
    <>
      <Navbar totalJuegos={juegos.length} unidadesCarrito={carrito.unidades} />

      <main>
        <Hero />

        <section id="catalogo" className="container py-5" aria-labelledby="tituloCatalogo">
          <h2 id="tituloCatalogo" className="mb-4">Catálogo</h2>

          {cargando && (
            <div className="text-center py-5" role="status">
              <div className="spinner-border text-warning" aria-hidden="true"></div>
              <p className="mt-3 contador">Cargando videojuegos...</p>
            </div>
          )}

          {errorCarga && (
            <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
              <span>{errorCarga}</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={recargarJuegos}>
                Reintentar
              </button>
            </div>
          )}

          {!cargando && !errorCarga && (
            <>
              <CategoryFilter
                categorias={categorias}
                seleccionada={categoriaVigente}
                onCambiarCategoria={setCategoria}
                totalVisibles={juegosFiltrados.length}
              />
              <GameList
                juegos={juegosFiltrados}
                onEliminar={eliminarJuego}
                onAgregarAlCarrito={carrito.agregar}
                carrito={carrito.carrito}
              />
              <div className="text-center mt-4">
                <button type="button" className="btn btn-filtro" onClick={recargarJuegos}>
                  Restaurar catálogo original
                </button>
              </div>
            </>
          )}
        </section>

        <AddGameForm categorias={categorias.filter((c) => c !== 'Todas')} onAgregar={agregarJuego} />

        <ContactForm />
      </main>

      <Footer />

      <Cart
        items={carrito.carrito}
        total={carrito.total}
        unidades={carrito.unidades}
        onCambiarCantidad={carrito.cambiarCantidad}
        onQuitar={carrito.quitar}
        onVaciar={carrito.vaciar}
      />
    </>
  )
}

export default App
