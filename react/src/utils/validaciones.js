/* Reglas de validación reutilizables.
   Cada función recibe el valor (ya sin espacios al inicio/fin)
   y devuelve el mensaje de error, o "" si el valor es correcto.
   Las usan ContactForm y AddGameForm. */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const REGEX_SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/

export function validarNombre(valor) {
  if (valor === '') return 'El nombre es obligatorio.'
  if (valor.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (!REGEX_SOLO_LETRAS.test(valor)) return 'El nombre solo puede contener letras y espacios.'
  return ''
}

export function validarEmail(valor) {
  if (valor === '') return 'El email es obligatorio.'
  if (!REGEX_EMAIL.test(valor)) return 'Ingresa un email válido (ejemplo: nombre@correo.com).'
  return ''
}

export function validarMensaje(valor) {
  if (valor === '') return 'El mensaje es obligatorio.'
  if (valor.length < 10) return 'El mensaje debe tener al menos 10 caracteres.'
  return ''
}

// campo = nombre del campo para el mensaje (ej: 'Nombre', 'Descripción')
export function validarTexto(valor, campo, minimo) {
  if (valor === '') return `${campo}: este campo es obligatorio.`
  if (valor.length < minimo) return `${campo}: debe tener al menos ${minimo} caracteres.`
  return ''
}

export function validarPrecio(valor) {
  if (valor === '') return 'El precio es obligatorio.'
  const numero = Number(valor)
  if (!Number.isInteger(numero) || numero <= 0) return 'El precio debe ser un número entero mayor a 0.'
  return ''
}

// true si el objeto de errores no tiene ningún mensaje
export function sinErrores(errores) {
  return Object.values(errores).every((mensaje) => mensaje === '')
}
