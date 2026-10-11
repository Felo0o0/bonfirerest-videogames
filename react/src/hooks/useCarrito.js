/* =============================================================
   useCarrito — hook personalizado con la lógica del carrito.

   Un hook es una función que usa otros hooks de React (useState,
   useEffect) y se puede reutilizar en cualquier componente.
   Así App.jsx queda más limpio y toda la lógica del carrito está
   en un solo lugar.

   Devuelve el carrito, sus totales y las funciones para modificarlo.
   ============================================================= */
import { useEffect, useState } from 'react'

const CLAVE_CARRITO = 'bonfirerest-carrito'
export const CANTIDAD_MAXIMA = 10

// Lee el carrito guardado. try/catch: localStorage puede fallar
// (modo incógnito o almacenamiento bloqueado).
function leerCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO))
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

export function useCarrito() {
  // Inicialización "perezosa": la función se ejecuta solo en el primer render
  const [carrito, setCarrito] = useState(leerCarritoGuardado)

  // Cada vez que el carrito cambia, se guarda en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
    } catch {
      // Sin almacenamiento disponible: el carrito funciona igual, sin guardarse
    }
  }, [carrito])

  // Agrega un juego; si ya está, suma una unidad (hasta el máximo)
  function agregar(juego) {
    setCarrito((anterior) => {
      const existe = anterior.find((item) => item.id === juego.id)
      if (existe) {
        return anterior.map((item) =>
          item.id === juego.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, CANTIDAD_MAXIMA) }
            : item,
        )
      }
      return [...anterior, { id: juego.id, nombre: juego.nombre, precio: juego.precio, cantidad: 1 }]
    })
  }

  // cambio = +1 o -1. Si la cantidad llega a 0, el producto se quita.
  function cambiarCantidad(id, cambio) {
    setCarrito((anterior) =>
      anterior
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.min(item.cantidad + cambio, CANTIDAD_MAXIMA) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    )
  }

  function quitar(id) {
    setCarrito((anterior) => anterior.filter((item) => item.id !== id))
  }

  function vaciar() {
    setCarrito([])
  }

  // Valores derivados con reduce
  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
  const unidades = carrito.reduce((suma, item) => suma + item.cantidad, 0)

  return { carrito, total, unidades, agregar, cambiarCantidad, quitar, vaciar }
}
