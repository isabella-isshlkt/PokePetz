import { pokemons } from '../data/pokemons'
import PokemonCard from '../components/PokemonCard'
import './AdoteAqui.css'

function AdoteAqui() {
  return (
    <section className="page">
      <h1>Adote Aqui</h1>
      <p>Conheça os Pokémon disponíveis para adoção e encontre seu novo amigo!</p>

      <div className="catalogo-grid">
        {pokemons.map((item) => (
          <PokemonCard key={item.id} pokemon={item} />
        ))}
      </div>
    </section>
  )
}

export default AdoteAqui