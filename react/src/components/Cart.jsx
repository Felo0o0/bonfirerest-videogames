/* =============================================================
   Cart — panel lateral del carrito (offcanvas de Bootstrap).

   Props:
   - items (object[]): productos del carrito.
   - total (number): suma de precio x cantidad.
   - unidades (number): cantidad total de productos.
   - onCambiarCantidad, onQuitar, onVaciar (functions).

   Estado propio:
   - mensaje: confirmación de compra o de carrito vaciado.
   ============================================================= */
import { useState } from 'react'
import CartItem from './CartItem.jsx'
import { formatearPrecio } from '../utils/formato.js'

function Cart({ items, total, unidades, onCambiarCantidad, onQuitar, onVaciar }) {
  const [mensaje, setMensaje] = useState(null)

  // Compra simulada: el proyecto no tiene backend ni pasarela de pago
  function finalizarCompra() {
    setMensaje({
      tipo: 'success',
      texto: `¡Compra confirmada! ${unidades} producto(s) por ${formatearPrecio(total)}. Te enviaremos los detalles por correo.`,
    })
    onVaciar()
  }

  function vaciarCarrito() {
    onVaciar()
    setMensaje({ tipo: 'secondary', texto: 'Se vació el carrito.' })
  }

  const vacio = items.length === 0

  return (
    <aside className="offcanvas offcanvas-end panel-carrito" tabIndex="-1" id="panelCarrito" aria-labelledby="tituloCarrito">
      <div className="offcanvas-header">
        <h2 className="offcanvas-title h5 mb-0" id="tituloCarrito">Tu carrito</h2>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar carrito"></button>
      </div>

      <div className="offcanvas-body d-flex flex-column">
        <div aria-live="polite">
          {mensaje && (
            <div className={`alert alert-${mensaje.tipo} py-2 mb-3`} role="status">{mensaje.texto}</div>
          )}
        </div>

        <ul className="list-group mb-3">
          {vacio && <li className="list-group-item text-center sin-resultados">Tu carrito está vacío.</li>}
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onCambiarCantidad={(id, cambio) => { setMensaje(null); onCambiarCantidad(id, cambio) }}
              onQuitar={(id) => { setMensaje(null); onQuitar(id) }}
            />
          ))}
        </ul>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3 total-carrito">
            <span>Total</span>
            <strong>{formatearPrecio(total)}</strong>
          </div>
          <button type="button" className="btn btn-primary w-100 mb-2" onClick={finalizarCompra} disabled={vacio}>
            Finalizar compra
          </button>
          <button type="button" className="btn btn-outline-danger w-100" onClick={vaciarCarrito} disabled={vacio}>
            Vaciar carrito
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Cart
