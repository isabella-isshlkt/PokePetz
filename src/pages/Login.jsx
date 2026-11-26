import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login({ loginUsuario, cadastrarUsuario }) {
  const [modo, setModo] = useState('login') // 'login' ou 'cadastro'
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const navigate = useNavigate()

  function trocarModo(novoModo) {
    setModo(novoModo)
    setErro('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (modo === 'cadastro') {
      if (!nome.trim() || !email.trim() || !senha.trim()) {
        setErro('Preencha todos os campos para criar sua conta.')
        return
      }

      const resultado = cadastrarUsuario({ nome, email, senha })
      if (!resultado.ok) {
        setErro(resultado.erro)
        return
      }

      navigate('/perfil')
    } else {
      const resultado = loginUsuario({ email, senha })
      if (!resultado.ok) {
        setErro(resultado.erro)
        return
      }

      navigate('/perfil')
    }
  }

  return (
    <section className="page">
      <div className="auth-card">
        <div className="auth-abas">
          <button
            type="button"
            className={`auth-aba ${modo === 'login' ? 'ativa' : ''}`}
            onClick={() => trocarModo('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-aba ${modo === 'cadastro' ? 'ativa' : ''}`}
            onClick={() => trocarModo('cadastro')}
          >
            Criar Conta
          </button>
        </div>

        <h1>{modo === 'login' ? 'Acessar Conta' : 'Novo Treinador'}</h1>
        <p className="auth-subtitulo">
          {modo === 'login'
            ? 'Entre para ver seus Pokémon adotados, saldo e itens.'
            : 'Cadastre-se e ganhe ₽ 1.000 PokéDollars iniciais!'}
        </p>

        {erro && <div className="auth-erro">{erro}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {modo === 'cadastro' && (
            <div className="auth-campo">
              <label>Nome de Treinador(a)</label>
              <input
                type="text"
                placeholder="Ex: Ash Ketchum"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
          )}

          <div className="auth-campo">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="treinador@pokepetz.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-campo">
            <label>Senha</label>
            <input
              type="password"
              placeholder="******"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-auth">
            {modo === 'login' ? 'Entrar' : 'Cadastrar e Entrar'}
          </button>
        </form>

        {modo === 'login' && (
          <p className="auth-dica">
            Conta de teste pronta: <strong>ash@pokepetz.com</strong> / senha: <strong>123</strong>
          </p>
        )}
      </div>
    </section>
  )
}

export default Login