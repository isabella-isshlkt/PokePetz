import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { pokemons } from '../data/pokemons'
import './PokemonDetalhes.css'

function PokemonDetalhes({ usuarioAtual, sessaoCarregando, adotarPokemon }) {
  const { id } = useParams()
  const [adotando, setAdotando] = useState(false)
  const [erroAdocao, setErroAdocao] = useState('')
  const pokemon = pokemons.find((item) => item.id === Number(id))

  if (!pokemon) {
    return (
      <section className="page">
        <h2>Pokémon não encontrado!</h2>
        <Link to="/adote">Voltar para o catálogo</Link>
      </section>
    )
  }

  const adotados = usuarioAtual?.adotados ?? []
  const jaAdotado = adotados.some((item) => item.id === pokemon.id)

  async function handleAdocao() {
    if (!usuarioAtual || adotando) return

    setAdotando(true)
    setErroAdocao('')
    try {
      const resultado = await adotarPokemon(pokemon)
      if (!resultado?.ok) {
        setErroAdocao(resultado?.erro || 'Não foi possível registrar a adoção.')
      }
    } catch {
      setErroAdocao('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setAdotando(false)
    }
  }

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

          {sessaoCarregando ? (
            <p role="status">Verificando sua sessão...</p>
          ) : jaAdotado ? (
            <div className="confirmacao-adocao">
              <p>Parabéns! Você adotou <strong>{pokemon.nome}</strong>!</p>
              <Link to="/perfil" className="btn-ver-perfil">
                Ver no meu Perfil
              </Link>
            </div>
          ) : usuarioAtual ? (
            <button
              onClick={handleAdocao}
              className="btn-adotar"
              disabled={adotando}
            >
              {adotando ? 'Registrando adoção...' : 'Quero adotar!'}
            </button>
          ) : (
            <Link
              to="/login"
              state={{ from: `/pokemon/${pokemon.id}` }}
              className="btn-ver-perfil"
            >
              Entre para adotar
            </Link>
          )}
          {erroAdocao && (
            <p className="erro-adocao" role="alert">
              {erroAdocao}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default PokemonDetalhes
