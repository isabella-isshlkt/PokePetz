import './Navbar.css'

function Navbar() {
    return (
        <nav className= "navbar">
            <div className= "navbar-logo">
                <span>PokéPetz</span>
            </div>

            <ul className= "navbar-links">
            <li><a href= "#início">Início</a></li>  
            <li><a href= "#adote">Adote aqui!</a></li>
            <li><a href= "#loja">PokéMart</a></li>
            </ul>
        </nav>
    )
}

export default Navbar