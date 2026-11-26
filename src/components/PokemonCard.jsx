import { Link } from 'react-router-dom'
import './PokemonCard.css'

function PokemonCard ({ pokemon }) {
    return (
        <div className="pokemon-card">
            <img src={pokemon.imagem} alt={pokemon.nome} className="pokemon-img" />
            <h3>{pokemon.nome}</h3>
            <span className="pokemon-tipo">{pokemon.tipo}</span>
            <p className="pokemon-descricao">{pokemon.descricao}</p>
            <p className="pokemon-personalidade">{pokemon.personalidade}</p>
            <Link
                to={`/pokemon/${pokemon.id}`}
                className="btn-detalhes"
                aria-label={`Ver detalhes de ${pokemon.nome}`}
            >
                Ver Detalhes
            </Link>
        </div>
    )
}

export default PokemonCard