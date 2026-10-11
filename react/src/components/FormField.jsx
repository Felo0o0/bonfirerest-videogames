/* FormField — campo de formulario REUTILIZABLE (input, textarea o select).
   Lo usan ContactForm y AddGameForm, así la etiqueta, el estilo
   y el mensaje de error se escriben una sola vez.
   Props:
   - id, label, name: identificación del campo.
   - tipo: 'text' | 'email' | 'number' | 'url' | 'textarea' | 'select'.
   - valor, onChange, onBlur: campo CONTROLADO por el estado del padre.
   - error: mensaje de error ('' si no hay).
   - mostrarValido: pinta el borde verde cuando el campo es correcto.
   - opciones: lista de opciones (solo para tipo 'select').
   - resto (...props): placeholder, min, rows, autoComplete, etc. */
function FormField({ id, label, tipo = 'text', valor, onChange, onBlur, error, mostrarValido = false, opciones = [], ...props }) {
  const clases = ['form-control']
  if (tipo === 'select') clases[0] = 'form-select'
  if (error) clases.push('is-invalid')
  else if (mostrarValido) clases.push('is-valid')

  const comunes = {
    id,
    name: props.name || id,
    className: clases.join(' '),
    value: valor,
    onChange,
    onBlur,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  }

  let control
  if (tipo === 'textarea') {
    control = <textarea {...comunes} {...props} />
  } else if (tipo === 'select') {
    control = (
      <select {...comunes} {...props}>
        <option value="">Selecciona una opción</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>{opcion}</option>
        ))}
      </select>
    )
  } else {
    control = <input type={tipo} {...comunes} {...props} />
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      {control}
      {error && <div id={`${id}-error`} className="invalid-feedback">{error}</div>}
    </div>
  )
}

export default FormField
