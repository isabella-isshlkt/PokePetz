import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Login.css'

function Login({ loginUsuario, cadastrarUsuario, erroSessao }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [modo, setModo] = useState('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (modo === 'cadastro') {
      if (!nome.trim() || !email.trim() || !senha.trim()) {
        setErro('Preencha todos os campos para criar sua conta.')
        return
      }
    } else if (!email.trim() || !senha.trim()) {
      setErro('Preencha seu e-mail e sua senha.')
      return
    }

    setCarregando(true)
    try {
      const resultado = modo === 'cadastro'
        ? await cadastrarUsuario({ nome, email, senha })
        : await loginUsuario({ email, senha })

      if (!resultado?.ok) {
        setErro(resultado?.erro || 'Não foi possível concluir a operação.')
        return
      }

      const destino = location.state?.from
      const destinoValido = typeof destino === 'string' &&
        destino.startsWith('/') &&
        !destino.startsWith('//')
      navigate(destinoValido ? destino : '/perfil', { replace: true })
    } catch {
      setErro('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  function alternarModo() {
    setModo((atual) => (atual === 'login' ? 'cadastro' : 'login'))
    setErro('')
  }

  const cadastroAtivo = modo === 'cadastro'

  return (
    <section className="page login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>{cadastroAtivo ? 'Criar conta' : 'Entrar'}</h1>
        <p>
          {cadastroAtivo
            ? 'Crie sua conta PokéPetz para adotar e cuidar dos seus Pokémon.'
            : 'Entre na sua conta PokéPetz para continuar.'}
        </p>

        {erroSessao && (
          <p className="login-erro" role="status">
            {erroSessao}
          </p>
        )}

        {cadastroAtivo && (
          <label className="login-campo">
            Nome
            <input
              type="text"
              name="nome"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>
        )}

        <label className="login-campo">
          E-mail
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="login-campo">
          Senha
          <input
            type="password"
            name="senha"
            autoComplete={cadastroAtivo ? 'new-password' : 'current-password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>

        {erro && (
          <p className="login-erro" role="alert">
            {erro}
          </p>
        )}

        <button className="login-submit" type="submit" disabled={carregando}>
          {carregando
            ? 'Aguarde...'
            : cadastroAtivo
              ? 'Criar conta'
              : 'Entrar'}
        </button>

        <button
          className="login-alternar"
          type="button"
          onClick={alternarModo}
          disabled={carregando}
        >
          {cadastroAtivo
            ? 'Já tem uma conta? Entrar'
            : 'Ainda não tem conta? Cadastre-se'}
        </button>
      </form>
    </section>
  )
}

export default Login
