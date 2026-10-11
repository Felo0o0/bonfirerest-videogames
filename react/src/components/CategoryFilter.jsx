/* CategoryFilter — botones para filtrar por categoría.
   Props:
   - categorias (string[]): categorías disponibles (incluye "Todas").
   - seleccionada (string): categoría activa.
   - onCambiarCategoria (function): avisa a App la nueva categoría.
   - totalVisibles (number): cuántos juegos se están mostrando.

   Este componente NO guarda estado propio: el filtro vive en App.
   Al hacer click llama a onCambiarCategoria, App actualiza su
   estado y GameList recibe la lista ya filtrada. */
function CategoryFilter({ categorias, seleccionada, onCambiarCategoria, totalVisibles }) {
  return (
    <div className="barra-filtros mb-4">
      <div className="filtros" role="group" aria-label="Filtrar por categoría">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            className={`btn btn-filtro ${categoria === seleccionada ? 'activo' : ''}`}
            aria-pressed={categoria === seleccionada}
            onClick={() => onCambiarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>
      <p className="contador mb-0" aria-live="polite">
        Mostrando {totalVisibles} {totalVisibles === 1 ? 'videojuego' : 'videojuegos'}
      </p>
    </div>
  )
}

export default CategoryFilter
