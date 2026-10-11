/* GameCard — tarjeta (card de Bootstrap) de UN videojuego.
   Props:
   - juego (object): { id, nombre, categoria, precio, descripcion, imagen }
   - onEliminar (function): recibe el id del juego a eliminar.
   - onAgregarAlCarrito (function): recibe el juego completo.
   - cantidadEnCarrito (number): unidades de este juego en el carrito. */
import { formatearPrecio } from '../utils/formato.js'

const PORTADA_POR_DEFECTO = 'img/sin-portada.svg'

function GameCard({ juego, onEliminar, onAgregarAlCarrito, cantidadEnCarrito }) {
  return (
    <article className="card h-100 tarjeta-juego">
      <img
        src={juego.imagen || PORTADA_POR_DEFECTO}
        alt={`Portada de ${juego.nombre}`}
        className="card-img-top"
        loading="lazy"
        // Si la URL de la imagen falla, se muestra la portada por defecto
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = PORTADA_POR_DEFECTO
        }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge etiqueta-categoria align-self-start mb-2">{juego.categoria}</span>
        <h3 className="card-title h5">{juego.nombre}</h3>
        <p className="card-text">{juego.descripcion}</p>
        <p className="precio mt-auto mb-2">{formatearPrecio(juego.precio)}</p>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-primary flex-grow-1"
            onClick={() => onAgregarAlCarrito(juego)}
            aria-label={`Agregar ${juego.nombre} al carrito`}
          >
            {cantidadEnCarrito > 0 ? `En carrito (${cantidadEnCarrito}) +` : 'Agregar al carrito'}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onEliminar(juego.id)}
            aria-label={`Eliminar ${juego.nombre} del catálogo`}
            title="Eliminar del catálogo"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}

export default GameCard
