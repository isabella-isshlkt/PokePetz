import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <nav className= "navbar">
            <div className= "navbar-logo">
                <span>PokéPetz</span>
            </div>

        <ul className= "navbar-links">
            <li><NavLink to="/" end>Início</NavLink></li>
            <li><NavLink to="/adote">Adote aqui!</NavLink></li>
            <li><NavLink to="/como-adotar">Como adotar</NavLink></li>
            <li><NavLink to="/produtos">PokéMart</NavLink></li>
            <li><NavLink to="/pokecoins">PokéDollars</NavLink></li>
            <li><NavLink to="/perfil">Meu Perfil</NavLink></li>
        </ul>
        </nav>
    )
}

export default Navbar