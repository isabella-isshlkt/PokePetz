import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import AdoteAqui from './pages/AdoteAqui'
import ComoAdotar from './pages/ComoAdotar'
import PokeMart from './pages/PokeMart'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/adote" element={<AdoteAqui />} />
          <Route path="/como-adotar" element={<ComoAdotar />} />
          <Route path="/produtos" element={<PokeMart />} />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App