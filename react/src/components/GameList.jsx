/* GameList — recorre la lista recibida y crea una GameCard por juego.
   Props:
   - juegos (object[]): lista YA filtrada por App.
   - onEliminar (function): se reenvía a cada tarjeta.
   - onAgregarAlCarrito (function): se reenvía a cada tarjeta.
   - carrito (object[]): para saber cuántas unidades de cada juego hay. */
import GameCard from './GameCard.jsx'

function GameList({ juegos, onEliminar, onAgregarAlCarrito, carrito }) {
  if (juegos.length === 0) {
    return <p className="text-center sin-resultados">No hay videojuegos para mostrar.</p>
  }

  return (
    <div className="row g-4">
      {juegos.map((juego) => (
        // key: identificador único que React usa para saber qué tarjeta cambió
        <div key={juego.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <GameCard
            juego={juego}
            onEliminar={onEliminar}
            onAgregarAlCarrito={onAgregarAlCarrito}
            cantidadEnCarrito={carrito.find((item) => item.id === juego.id)?.cantidad ?? 0}
          />
        </div>
      ))}
    </div>
  )
}

export default GameList
