import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
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

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const TOKEN_KEY = 'pokepetz_session_token'

function ConteudoProtegido({ usuarioAtual, sessaoCarregando, children }) {
  const location = useLocation()

  if (sessaoCarregando) {
    return <p className="page" role="status">Verificando sua sessão...</p>
  }

  if (!usuarioAtual) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

function App() {
  const [sessaoSalva] = useState(() => {
    try {
      return { token: localStorage.getItem(TOKEN_KEY), erro: '' }
    } catch {
      return {
        token: null,
        erro: 'Não foi possível acessar a sessão salva neste navegador.'
      }
    }
  })
  const [usuarioAtual, setUsuarioAtual] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [sessaoCarregando, setSessaoCarregando] = useState(Boolean(sessaoSalva.token))
  const [erroSessao, setErroSessao] = useState(sessaoSalva.erro)

  useEffect(() => {
    let ativo = true
    const controller = new AbortController()
    const token = sessaoSalva.token

    if (!token) {
      return () => controller.abort()
    }

    fetch(`${API_URL}/sessao`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal
    })
      .then(async (resposta) => {
        const dados = await resposta.json()
        if (!resposta.ok || !dados.ok) {
          if (resposta.status === 401 || resposta.status === 404) {
            localStorage.removeItem(TOKEN_KEY)
          }
          throw new Error(dados.erro || 'Não foi possível restaurar sua sessão.')
        }
        return dados
      })
      .then((dados) => {
        if (ativo) {
          setUsuarioAtual(dados.usuario)
          setErroSessao('')
        }
      })
      .catch((erro) => {
        if (ativo && erro.name !== 'AbortError') {
          console.error('Erro ao restaurar sessão.', erro)
          setErroSessao(erro.message || 'Não foi possível restaurar sua sessão.')
        }
      })
      .finally(() => {
        if (ativo) setSessaoCarregando(false)
      })

    return () => {
      ativo = false
      controller.abort()
    }
  }, [sessaoSalva.token])

  async function autenticar(endpoint, dadosConta) {
    try {
      const resposta = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosConta)
      })
      const dados = await resposta.json()

      if (!resposta.ok || !dados.ok) return dados
      if (!dados.token || !dados.usuario?.id) {
        return { ok: false, erro: 'O servidor não retornou uma sessão válida.' }
      }

      try {
        localStorage.setItem(TOKEN_KEY, dados.token)
      } catch {
        return {
          ok: false,
          erro: 'Login concluído, mas não foi possível salvar sua sessão neste navegador.'
        }
      }
      try {
        localStorage.removeItem('pokepetz_user_id')
      } catch (erro) {
        console.error('Não foi possível remover a sessão antiga.', erro)
      }

      setUsuarioAtual(dados.usuario)
      setSessaoCarregando(false)
      setErroSessao('')
      setCarrinho([])
      return dados
    } catch {
      return { ok: false, erro: 'Erro de conexão com o servidor.' }
    }
  }

  function cadastrarUsuario(dados) {
    return autenticar('cadastro', dados)
  }

  function loginUsuario(dados) {
    return autenticar('login', dados)
  }

  function invalidarSessaoSeNecessario(resposta) {
    if (resposta.status !== 401) return

    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch (erro) {
      console.error('Não foi possível remover a sessão expirada.', erro)
    }
    setUsuarioAtual(null)
    setCarrinho([])
    setErroSessao('Sua sessão expirou. Entre novamente.')
  }

  function logoutUsuario() {
    let token = null
    try {
      token = localStorage.getItem(TOKEN_KEY)
      localStorage.removeItem(TOKEN_KEY)
    } catch (erro) {
      console.error('Não foi possível limpar a sessão salva.', erro)
    }
    setUsuarioAtual(null)
    setCarrinho([])

    if (token) {
      fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch((erro) => console.error('Erro ao encerrar sessão no servidor.', erro))
    }
  }

  async function adotarPokemon(pokemon) {
    if (!usuarioAtual) {
      return { ok: false, erro: 'Entre na sua conta para adotar um Pokémon.' }
    }

    try {
      const token = localStorage.getItem(TOKEN_KEY)
      const resposta = await fetch(`${API_URL}/adocoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pokemon })
      })
      const dados = await resposta.json()

      invalidarSessaoSeNecessario(resposta)
      if (dados.ok) setUsuarioAtual(dados.usuario)
      return dados
    } catch {
      return { ok: false, erro: 'Não foi possível conectar ao servidor para registrar a adoção.' }
    }
  }

  async function adicionarSaldo(valor) {
    if (!usuarioAtual) {
      return { ok: false, erro: 'Entre na sua conta para adicionar saldo.' }
    }

    try {
      const token = localStorage.getItem(TOKEN_KEY)
      const resposta = await fetch(`${API_URL}/usuarios/${usuarioAtual.id}/saldo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ valor })
      })
      const dados = await resposta.json()

      invalidarSessaoSeNecessario(resposta)
      if (dados.ok) setUsuarioAtual(dados.usuario)
      return dados
    } catch {
      return { ok: false, erro: 'Erro de conexão ao atualizar o saldo.' }
    }
  }

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

  async function finalizarPedido() {
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

    try {
      const token = localStorage.getItem(TOKEN_KEY)
      const resposta = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ itens: carrinho, total })
      })
      const dados = await resposta.json()

      invalidarSessaoSeNecessario(resposta)
      if (dados.ok) {
        setUsuarioAtual(dados.usuario)
        setCarrinho([])
      }
      return dados
    } catch {
      return { ok: false, mensagem: 'Erro de conexão ao finalizar pedido.' }
    }
  }

  return (
    <BrowserRouter>
      <Navbar
        usuarioAtual={usuarioAtual}
        sessaoCarregando={sessaoCarregando}
        logoutUsuario={logoutUsuario}
      />
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
                sessaoCarregando={sessaoCarregando}
                adotarPokemon={adotarPokemon}
              />
            }
          />
          <Route
            path="/pokedollar"
            element={
              <ConteudoProtegido
                usuarioAtual={usuarioAtual}
                sessaoCarregando={sessaoCarregando}
              >
                <PokeDollar
                  saldo={usuarioAtual?.saldo ?? 0}
                  adicionarSaldo={adicionarSaldo}
                />
              </ConteudoProtegido>
            }
          />
          <Route
            path="/perfil"
            element={
              <ConteudoProtegido
                usuarioAtual={usuarioAtual}
                sessaoCarregando={sessaoCarregando}
              >
                <Perfil usuarioAtual={usuarioAtual} logoutUsuario={logoutUsuario} />
              </ConteudoProtegido>
            }
          />
          <Route
            path="/login"
            element={
              sessaoCarregando ? (
                <p className="page" role="status">Restaurando sua sessão...</p>
              ) : usuarioAtual ? (
                <Navigate to="/perfil" replace />
              ) : (
                <Login
                  loginUsuario={loginUsuario}
                  cadastrarUsuario={cadastrarUsuario}
                  erroSessao={erroSessao}
                />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
