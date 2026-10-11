/* CartItem — una fila del carrito.
   Props:
   - item (object): { id, nombre, precio, cantidad }
   - onCambiarCantidad (function): recibe (id, +1 | -1)
   - onQuitar (function): recibe el id */
import { formatearPrecio } from '../utils/formato.js'
import { CANTIDAD_MAXIMA } from '../hooks/useCarrito.js'

function CartItem({ item, onCambiarCantidad, onQuitar }) {
  return (
    <li className="list-group-item item-carrito">
      <div className="flex-grow-1">
        <p className="mb-1 fw-semibold">{item.nombre}</p>
        <small className="subtotal-carrito">
          {formatearPrecio(item.precio)} c/u · Subtotal {formatearPrecio(item.precio * item.cantidad)}
        </small>
      </div>

      <div className="d-flex align-items-center gap-1">
        <button type="button" className="btn btn-sm btn-cantidad"
          onClick={() => onCambiarCantidad(item.id, -1)}
          aria-label={`Quitar una unidad de ${item.nombre}`}>
          −
        </button>
        <span className="cantidad">{item.cantidad}</span>
        <button type="button" className="btn btn-sm btn-cantidad"
          onClick={() => onCambiarCantidad(item.id, 1)}
          disabled={item.cantidad >= CANTIDAD_MAXIMA}
          aria-label={`Agregar una unidad de ${item.nombre}`}>
          +
        </button>
        <button type="button" className="btn btn-sm btn-cantidad ms-2"
          onClick={() => onQuitar(item.id)}
          aria-label={`Quitar ${item.nombre} del carrito`}>
          ✕
        </button>
      </div>
    </li>
  )
}

export default CartItem
