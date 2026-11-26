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
import Login from './pages/Login'

function App() {
  // Lista de contas cadastradas (começa com uma conta pronta para testes)
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: 'Ash Ketchum',
      email: 'ash@pokepetz.com',
      senha: '123',
      saldo: 1000,
      adotados: [],
      pedidos: [],
      inventario: []
    }
  ])

  const [usuarioLogadoId, setUsuarioLogadoId] = useState(null)
  const [carrinho, setCarrinho] = useState([])

  // Busca o objeto completo do usuário logado no momento
  const usuarioAtual = usuarios.find((u) => u.id === usuarioLogadoId) || null

  // --- FUNÇÕES DE AUTENTICAÇÃO ---
  function cadastrarUsuario({ nome, email, senha }) {
    const emailJaExiste = usuarios.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    )

    if (emailJaExiste) {
      return { ok: false, erro: 'Este e-mail já está cadastrado.' }
    }

    const novoUsuario = {
      id: Date.now(),
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
      saldo: 1000,
      adotados: [],
      pedidos: [],
      inventario: []
    }

    setUsuarios((atual) => [...atual, novoUsuario])
    setUsuarioLogadoId(novoUsuario.id)
    setCarrinho([])
    return { ok: true }
  }

  function loginUsuario({ email, senha }) {
    const encontrado = usuarios.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.senha === senha
    )

    if (!encontrado) {
      return { ok: false, erro: 'E-mail ou senha incorretos.' }
    }

    setUsuarioLogadoId(encontrado.id)
    setCarrinho([])
    return { ok: true }
  }

  function logoutUsuario() {
    setUsuarioLogadoId(null)
    setCarrinho([])
  }

  // --- FUNÇÕES ASSOCIADAS À CONTA LOGADA ---
  function adotarPokemon(pokemon) {
    if (!usuarioAtual) return

    setUsuarios((atual) =>
      atual.map((u) => {
        if (u.id !== usuarioAtual.id) return u
        const jaExiste = u.adotados.some((p) => p.id === pokemon.id)
        if (jaExiste) return u
        return { ...u, adotados: [...u.adotados, pokemon] }
      })
    )
  }

  function adicionarSaldo(valor) {
    if (!usuarioAtual) return

    setUsuarios((atual) =>
      atual.map((u) =>
        u.id === usuarioAtual.id ? { ...u, saldo: u.saldo + valor } : u
      )
    )
  }

  // --- FUNÇÕES DO CARRINHO E LOJA ---
  function adicionarAoCarrinho(produto) {
    setCarrinho((atual) => {
      const itemExistente = atual.find((item) => item.id === produto.id)
      if (itemExistente) {
        return atual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      }
      return [...atual, { ...produto, quantidade: 1 }]
    })
  }

  function alterarQuantidade(id, delta) {
    setCarrinho((atual) =>
      atual
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade + delta } : item
        )
        .filter((item) => item.quantidade > 0)
    )
  }

  function removerDoCarrinho(id) {
    setCarrinho((atual) => atual.filter((item) => item.id !== id))
  }

  function finalizarPedido() {
    if (!usuarioAtual) {
      return { ok: false, mensagem: 'Faça login para finalizar sua compra.' }
    }
    if (carrinho.length === 0) {
      return { ok: false, mensagem: 'Seu carrinho está vazio.' }
    }

    const total = carrinho.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    )

    if (usuarioAtual.saldo < total) {
      return {
        ok: false,
        mensagem: 'Saldo insuficiente! Ganhe mais PokéDollars antes de comprar.'
      }
    }

    const novoPedido = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      itens: carrinho,
      total
    }

    setUsuarios((atual) =>
      atual.map((u) => {
        if (u.id !== usuarioAtual.id) return u

        // Soma quantidades se o item já existir no inventário do usuário
        const inventarioAtualizado = [...u.inventario]
        carrinho.forEach((itemComprado) => {
          const idx = inventarioAtualizado.findIndex(
            (inv) => inv.id === itemComprado.id
          )
          if (idx >= 0) {
            inventarioAtualizado[idx] = {
              ...inventarioAtualizado[idx],
              quantidade:
                inventarioAtualizado[idx].quantidade + itemComprado.quantidade
            }
          } else {
            inventarioAtualizado.push({ ...itemComprado })
          }
        })

        return {
          ...u,
          saldo: u.saldo - total,
          pedidos: [novoPedido, ...u.pedidos],
          inventario: inventarioAtualizado
        }
      })
    )

    setCarrinho([])
    return {
      ok: true,
      mensagem: '✅ Pedido finalizado! Itens enviados ao seu inventário.'
    }
  }

  return (
    <BrowserRouter>
      <Navbar usuarioAtual={usuarioAtual} logoutUsuario={logoutUsuario} />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/adote" element={<AdoteAqui />} />
          <Route path="/como-adotar" element={<ComoAdotar />} />
          <Route
            path="/produtos"
            element={
              <PokeMart
                usuarioAtual={usuarioAtual}
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
                usuarioAtual={usuarioAtual}
                adotarPokemon={adotarPokemon}
              />
            }
          />
          <Route
            path="/pokedollar"
            element={
              <PokeDollar
                saldo={usuarioAtual ? usuarioAtual.saldo : 0}
                adicionarSaldo={adicionarSaldo}
              />
            }
          />
          <Route
            path="/perfil"
            element={
              <Perfil
                usuarioAtual={usuarioAtual}
                logoutUsuario={logoutUsuario}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                loginUsuario={loginUsuario}
                cadastrarUsuario={cadastrarUsuario}
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App