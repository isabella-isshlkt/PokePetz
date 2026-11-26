import { Link } from 'react-router-dom'
import { pokemons } from '../data/pokemons'
import './AdoteAqui.css'

function AdoteAqui() {
  return (
    <main className="page">
      <h1>Adote Aqui</h1>
      <p>Conheça os Pokémon disponíveis para adoção e encontre seu novo amigo.</p>

      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <article className="pokemon-card" key={pokemon.id}>
            <img src={pokemon.imagem} alt={pokemon.nome} />
            <h2>{pokemon.nome}</h2>
            <span className="pokemon-tipo">{pokemon.tipo}</span>
            <Link to={`/pokemon/${pokemon.id}`} className="btn-ver-detalhes">
              Ver detalhes
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}

export default AdoteAqui