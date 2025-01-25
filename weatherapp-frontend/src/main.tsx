import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Checks from './Checks.tsx'
import Info from './Info.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}></Route>
        <Route path="/checks" element={<Checks/>}/>
        <Route path="info/:id" element={<Info/>}/>
      </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
