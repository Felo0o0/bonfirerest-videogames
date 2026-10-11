/* Punto de entrada de la aplicación React.
   Se importan Bootstrap (CSS + JS para el menú hamburguesa)
   y luego los estilos propios, que sobrescriben a Bootstrap. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
