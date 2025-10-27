import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router'
import { StrictMode } from 'react'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
