import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import AdoteAqui from './pages/AdoteAqui'
import ComoAdotar from './pages/ComoAdotar'
import PokeMart from './pages/PokeMart'
import Perfil from './pages/Perfil'
import PokemonDetalhes from './pages/PokemonDetalhes'

function App() {
  // Estado que guarda a lista de Pokémon adotados (começa vazio: [])
  const [adotados, setAdotados] = useState([])

  // Função chamada ao clicar em "Quero adotar!"
  function adotarPokemon(pokemon) {
    setAdotados((atuais) =>
      atuais.some((item) => item.id === pokemon.id)
        ? atuais
        : [...atuais, pokemon],
    )
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/adote" element={<AdoteAqui />} />
          <Route path="/como-adotar" element={<ComoAdotar />} />
          <Route path="/produtos" element={<PokeMart />} />
          <Route
            path="/pokemon/:id"
            element={<PokemonDetalhes adotarPokemon={adotarPokemon} adotados={adotados} />}
          />
          <Route
            path="/perfil"
            element={<Perfil adotados={adotados} />}
          />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App