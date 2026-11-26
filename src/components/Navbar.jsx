import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar({ usuarioAtual, logoutUsuario }) {
  const navigate = useNavigate()

  function handleLogout() {
    logoutUsuario()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">PokéPetz</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Início</Link></li>
        <li><Link to="/adote">Adote aqui!</Link></li>
        <li><Link to="/como-adotar">Como adotar</Link></li>
        <li><Link to="/produtos">PokéMart</Link></li>
        <li><Link to="/pokedollar">PokéDollar</Link></li>
        <li><Link to="/perfil">Perfil</Link></li>

        {usuarioAtual ? (
          <>
            <li className="navbar-usuario">👤 {usuarioAtual.nome}</li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Sair
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className="btn-login-nav">
              Entrar
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar