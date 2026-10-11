/* =============================================================
   ContactForm — formulario de contacto con validación.

   Estado propio:
   - valores: lo que el usuario escribe (inputs CONTROLADOS).
   - errores: mensaje de error de cada campo.
   - tocados: campos que el usuario ya visitó (para validar al salir).
   - enviado: muestra el mensaje de éxito.

   Al enviar se validan los 3 campos; si alguno falla, NO se envía
   y se muestran los errores bajo cada campo.
   ============================================================= */
import { useState } from 'react'
import FormField from './FormField.jsx'
import { validarNombre, validarEmail, validarMensaje, sinErrores } from '../utils/validaciones.js'

const VALORES_INICIALES = { nombre: '', email: '', mensaje: '' }

// Asocia cada campo con su regla de validación
const REGLAS = {
  nombre: validarNombre,
  email: validarEmail,
  mensaje: validarMensaje,
}

function validarTodo(valores) {
  return {
    nombre: REGLAS.nombre(valores.nombre.trim()),
    email: REGLAS.email(valores.email.trim()),
    mensaje: REGLAS.mensaje(valores.mensaje.trim()),
  }
}

function ContactForm() {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [estadoEnvio, setEstadoEnvio] = useState(null) // null | 'exito' | 'error'
  const [nombreEnviado, setNombreEnviado] = useState('')

  // Un solo manejador para todos los campos, usando el atributo name
  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores({ ...valores, [name]: value })
    // Si el campo ya mostraba error, se revalida mientras se corrige
    if (tocados[name]) {
      setErrores({ ...errores, [name]: REGLAS[name](value.trim()) })
    }
  }

  function manejarSalida(evento) {
    const { name, value } = evento.target
    setTocados({ ...tocados, [name]: true })
    setErrores({ ...errores, [name]: REGLAS[name](value.trim()) })
  }

  function manejarEnvio(evento) {
    evento.preventDefault() // evita que la página se recargue
    const nuevosErrores = validarTodo(valores)
    setErrores(nuevosErrores)
    setTocados({ nombre: true, email: true, mensaje: true })

    if (!sinErrores(nuevosErrores)) {
      setEstadoEnvio('error')
      return
    }

    // Datos válidos: se simula el envío y se limpia el formulario
    setNombreEnviado(valores.nombre.trim())
    setEstadoEnvio('exito')
    setValores(VALORES_INICIALES)
    setErrores({})
    setTocados({})
  }

  return (
    <section id="contacto" className="container py-5" aria-labelledby="tituloContacto">
      <h2 id="tituloContacto" className="mb-4">Contacto</h2>

      {/* CSS Grid: 1 columna en móvil, 2 columnas en escritorio */}
      <div className="contacto-grid">
        <aside className="contacto-info">
          <h3 className="h5">¿Tienes dudas sobre un juego?</h3>
          <p>Escríbele al administrador del sitio y te responderemos dentro de 24 horas hábiles.</p>
          <ul className="list-unstyled mb-0">
            <li><strong>Correo:</strong> contacto@bonfirerest.cl</li>
            <li><strong>Horario:</strong> lunes a viernes, 9:00 a 18:00</li>
            <li><strong>Ubicación:</strong> Santiago, Chile</li>
          </ul>
        </aside>

        {/* noValidate: la validación la hace React, no el navegador */}
        <form className="formulario" onSubmit={manejarEnvio} noValidate>
          <FormField
            id="nombre"
            label="Nombre"
            valor={valores.nombre}
            onChange={manejarCambio}
            onBlur={manejarSalida}
            error={errores.nombre}
            mostrarValido={tocados.nombre}
            placeholder="Tu nombre"
            autoComplete="name"
          />
          <FormField
            id="email"
            label="Email"
            tipo="email"
            valor={valores.email}
            onChange={manejarCambio}
            onBlur={manejarSalida}
            error={errores.email}
            mostrarValido={tocados.email}
            placeholder="nombre@correo.com"
            autoComplete="email"
          />
          <FormField
            id="mensaje"
            label="Mensaje"
            tipo="textarea"
            rows={5}
            valor={valores.mensaje}
            onChange={manejarCambio}
            onBlur={manejarSalida}
            error={errores.mensaje}
            mostrarValido={tocados.mensaje}
            placeholder="Escribe tu consulta (mínimo 10 caracteres)"
          />

          <button type="submit" className="btn btn-primary w-100">Enviar mensaje</button>

          <div className="mt-3" aria-live="polite">
            {estadoEnvio === 'exito' && (
              <div className="alert alert-success mb-0" role="alert">
                ¡Gracias, {nombreEnviado}! Tu mensaje fue enviado correctamente.
              </div>
            )}
            {estadoEnvio === 'error' && (
              <div className="alert alert-danger mb-0" role="alert">
                Revisa los campos marcados en rojo.
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactForm
