// Da formato de pesos chilenos a un número: 39990 -> "$39.990"
export function formatearPrecio(numero) {
  return '$' + Number(numero).toLocaleString('es-CL')
}
