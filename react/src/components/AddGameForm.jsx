/* =============================================================
   AddGameForm — formulario para AGREGAR un videojuego al catálogo.

   Props:
   - categorias (string[]): categorías existentes para el <select>.
   - onAgregar (function): recibe el juego nuevo; App lo agrega
     a su estado y GameList se actualiza automáticamente.
   ============================================================= */
import { useState } from 'react'
import FormField from './FormField.jsx'
import { validarTexto, validarPrecio, sinErrores } from '../utils/validaciones.js'

const VALORES_INICIALES = { nombre: '', categoria: '', precio: '', descripcion: '', imagen: '' }

function validarJuego(valores) {
  return {
    nombre: validarTexto(valores.nombre.trim(), 'Nombre', 2),
    categoria: valores.categoria === '' ? 'Selecciona una categoría.' : '',
    precio: validarPrecio(valores.precio.trim()),
    descripcion: validarTexto(valores.descripcion.trim(), 'Descripción', 10),
    imagen: '', // opcional: si queda vacía se usa la portada por defecto
  }
}

function AddGameForm({ categorias, onAgregar }) {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [mensajeExito, setMensajeExito] = useState('')

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: '' }) // limpia el error al corregir
    setMensajeExito('')
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validarJuego(valores)
    setErrores(nuevosErrores)
    if (!sinErrores(nuevosErrores)) return

    const nuevoJuego = {
      id: `juego-${Date.now()}`, // id único basado en la hora actual
      nombre: valores.nombre.trim(),
      categoria: valores.categoria,
      precio: Number(valores.precio),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim(),
    }

    onAgregar(nuevoJuego) // se envía el juego al componente padre (App)
    setMensajeExito(`"${nuevoJuego.nombre}" se agregó al catálogo.`)
    setValores(VALORES_INICIALES)
  }

  return (
    <section id="agregar" className="container py-5" aria-labelledby="tituloAgregar">
      <h2 id="tituloAgregar" className="mb-4">Agregar videojuego</h2>

      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        <div className="row">
          <div className="col-12 col-md-6">
            <FormField id="juego-nombre" name="nombre" label="Nombre del juego"
              valor={valores.nombre} onChange={manejarCambio} error={errores.nombre}
              placeholder="Ej: Bloodborne" />
          </div>
          <div className="col-12 col-md-3">
            <FormField id="juego-categoria" name="categoria" label="Categoría" tipo="select"
              opciones={categorias} valor={valores.categoria} onChange={manejarCambio}
              error={errores.categoria} />
          </div>
          <div className="col-12 col-md-3">
            <FormField id="juego-precio" name="precio" label="Precio (CLP)" tipo="number"
              min="1" step="1" valor={valores.precio} onChange={manejarCambio}
              error={errores.precio} placeholder="29990" />
          </div>
          <div className="col-12 col-md-6">
            <FormField id="juego-descripcion" name="descripcion" label="Descripción" tipo="textarea"
              rows={3} valor={valores.descripcion} onChange={manejarCambio}
              error={errores.descripcion} placeholder="Mínimo 10 caracteres" />
          </div>
          <div className="col-12 col-md-6">
            <FormField id="juego-imagen" name="imagen" label="URL de la imagen (opcional)" tipo="url"
              valor={valores.imagen} onChange={manejarCambio} error={errores.imagen}
              placeholder="Si se deja vacío se usa una portada genérica" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Agregar al catálogo</button>

        <div className="mt-3" aria-live="polite">
          {mensajeExito && <div className="alert alert-success mb-0" role="alert">{mensajeExito}</div>}
        </div>
      </form>
    </section>
  )
}

export default AddGameForm
