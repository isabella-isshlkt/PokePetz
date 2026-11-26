import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar({ usuarioAtual, sessaoCarregando, logoutUsuario }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>PokéPetz</span>
      </div>

      <ul className="navbar-links">
        <li><NavLink to="/" end>Início</NavLink></li>
        <li><NavLink to="/adote">Adote aqui!</NavLink></li>
        <li><NavLink to="/como-adotar">Como adotar</NavLink></li>
        <li><NavLink to="/produtos">PokéMart</NavLink></li>
        {sessaoCarregando ? (
          <li className="navbar-sessao" role="status">Verificando sessão...</li>
        ) : usuarioAtual ? (
          <>
            <li>
              <NavLink to="/perfil">{usuarioAtual.nome || 'Meu Perfil'}</NavLink>
            </li>
            <li>
              <button
                type="button"
                className="navbar-sair"
                onClick={logoutUsuario}
              >
                Sair
              </button>
            </li>
          </>
        ) : (
          <li><NavLink to="/login">Entrar / Cadastrar</NavLink></li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
