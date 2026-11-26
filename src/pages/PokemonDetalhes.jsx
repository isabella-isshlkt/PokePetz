import { useParams, Link } from 'react-router-dom'
import { pokemons } from '../data/pokemons'
import './PokemonDetalhes.css'

function PokemonDetalhes({ adotarPokemon, adotados }) {
  const { id } = useParams()
  const pokemon = pokemons.find((item) => item.id === Number(id))

  if (!pokemon) {
    return (
      <section className="page">
        <h2>Pokémon não encontrado!</h2>
        <Link to="/adote">Voltar para o catálogo</Link>
      </section>
    )
  }

  // Verifica se ESTE Pokémon específico já foi adotado pelo usuário
  const jaAdotado = adotados.some((item) => item.id === pokemon.id)

  return (
    <section className="page">
      <Link to="/adote" className="btn-voltar">← Voltar para o catálogo</Link>

      <div className="detalhes-card">
        <div className="detalhes-imagem">
          <img src={pokemon.imagem} alt={pokemon.nome} />
        </div>

        <div className="detalhes-info">
          <h1>{pokemon.nome}</h1>
          <span className="pokemon-tipo">{pokemon.tipo}</span>
          <p>{pokemon.descricao}</p>
          <p><strong>Personalidade:</strong> {pokemon.personalidade}</p>
          <p><strong>Características:</strong> {pokemon.caracteristicas}</p>

          {/* Renderização condicional: mostra confirmação ou o botão de adotar */}
          {jaAdotado ? (
            <div className="confirmacao-adocao">
              <p>Parabéns! Você adotou <strong>{pokemon.nome}</strong>!</p>
              <Link to="/perfil" className="btn-ver-perfil">
                Ver no meu Perfil
              </Link>
            </div>
          ) : (
            <button
              onClick={() => adotarPokemon(pokemon)}
              className="btn-adotar"
            >
              Quero adotar!
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default PokemonDetalhes