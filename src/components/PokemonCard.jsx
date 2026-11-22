import './PokemonCard.css'

function PokemonCard ({ pokemon }) {
    return (
        <div className="pokemon-card">
            <img src={pokemon.imagem} alt={pokemon.nome} className="pokemon-img" />
            <h3>{pokemon.nome}</h3>
            <span className="pokemon-tipo">{pokemon.tipo}</span>
            <p className="pokemon-descricao">{pokemon.descricao}</p>
            <p className="pokemon-personalidade">{pokemon.personalidade}</p>
            <button className="btn-detalhes">Ver Detalhes</button>
        </div>
    )
}

export default PokemonCard