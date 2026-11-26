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
import PokeDollar from './pages/PokeDollar'

function App() {
  const [adotados, setAdotados] = useState([])
  const [saldo, setSaldo] = useState(1000)
  const [carrinho, setCarrinho] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [inventario, setInventario] = useState([])

  function adotarPokemon(pokemon) {
    setAdotados((atuais) =>
      atuais.some((item) => item.id === pokemon.id)
        ? atuais
        : [...atuais, pokemon],
    )
  }

  function adicionarSaldo(valor) {
    setSaldo((atual) => atual + valor)
  }

  function adicionarAoCarrinho(produto) {
    setCarrinho((atual) => {
      const itemExistente = atual.find((item) => item.id === produto.id)
      if (itemExistente) {
        return atual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        )
      }
      return [...atual, { ...produto, quantidade: 1 }]
    })
  }

  function alterarQuantidade(id, delta) {
    setCarrinho((atual) =>
      atual
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade + delta }
            : item,
        )
        .filter((item) => item.quantidade > 0),
    )
  }

  function removerDoCarrinho(id) {
    setCarrinho((atual) => atual.filter((item) => item.id !== id))
  }

  function finalizarPedido() {
    if (carrinho.length === 0) return false

    const total = carrinho.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0,
    )
    if (total > saldo) return false

    const novoPedido = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      itens: carrinho,
      total,
    }

    setPedidos((atuais) => [novoPedido, ...atuais])
    setInventario((atual) => {
      const atualizado = [...atual]
      carrinho.forEach((produto) => {
        const indiceExistente = atualizado.findIndex(
          (item) => item.id === produto.id,
        )
        if (indiceExistente !== -1) {
          atualizado[indiceExistente] = {
            ...atualizado[indiceExistente],
            quantidade:
              atualizado[indiceExistente].quantidade + produto.quantidade,
          }
        } else {
          atualizado.push({ ...produto })
        }
      })
      return atualizado
    })
    setSaldo((atual) => atual - total)
    setCarrinho([])
    return true
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/adote" element={<AdoteAqui />} />
          <Route path="/como-adotar" element={<ComoAdotar />} />
          <Route
            path="/produtos"
            element={
              <PokeMart
                saldo={saldo}
                carrinho={carrinho}
                adicionarAoCarrinho={adicionarAoCarrinho}
                alterarQuantidade={alterarQuantidade}
                removerDoCarrinho={removerDoCarrinho}
                finalizarPedido={finalizarPedido}
              />
            }
          />
          <Route
            path="/pokemon/:id"
            element={
              <PokemonDetalhes
                adotarPokemon={adotarPokemon}
                adotados={adotados}
              />
            }
          />
          <Route
            path="/pokecoins"
            element={
              <PokeDollar saldo={saldo} adicionarSaldo={adicionarSaldo} />
            }
          />
          <Route
            path="/perfil"
            element={
              <Perfil
                adotados={adotados}
                saldo={saldo}
                inventario={inventario}
                pedidos={pedidos}
              />
            }
          />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
