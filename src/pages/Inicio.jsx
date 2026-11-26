import { Link } from 'react-router-dom'
import hero from '../assets/hero.png'

function Inicio() {
  return (
    <main className="page inicio-page">
      <header>
        <img src={hero} alt="PokéPetz" className="inicio-logo" />
        <h1>Bem-vindo ao PokéPetz!</h1>
        <p>Encontre o parceiro Pokémon perfeito para viver novas aventuras com você.</p>
      </header>

      <section>
        <h2>Adote com carinho</h2>
        <p>Conheça os Pokémon disponíveis, leia suas características e adicione seu novo amigo ao perfil.</p>
        <Link to="/adote" className="btn-principal">Conhecer Pokémon</Link>
      </section>
    </main>
  )
}

export default Inicio