import { Link } from 'react-router-dom'
import './Perfil.css'

function Perfil({ usuarioAtual, logoutUsuario }) {
  const adotados = usuarioAtual?.adotados ?? []
  const inventario = usuarioAtual?.inventario ?? []
  const pedidos = usuarioAtual?.pedidos ?? []
  const quantidadeItens = inventario.reduce(
    (total, item) => total + item.quantidade,
    0,
  )

  return (
    <section className="page">
      <h1>Meu Perfil</h1>
      <p>Gerencie suas informações, seus Pokémon adotados e seus itens do PokéMart.</p>

      <div className="perfil-secao perfil-cabecalho">
        <div>
          <h2>{usuarioAtual?.nome ?? 'Treinador(a) PokéPetz'}</h2>
          <p>
            Status:{' '}
            {usuarioAtual ? 'Conta Ativa' : 'Faça login para consultar sua conta'}
          </p>
          {usuarioAtual && (
            <button type="button" className="perfil-sair" onClick={logoutUsuario}>
              Sair da conta
            </button>
          )}
        </div>
        <div className="perfil-saldo">
          <span>Saldo disponível:</span>
          <strong>
            {usuarioAtual
              ? `₽ ${usuarioAtual.saldo.toLocaleString('pt-BR')}`
              : '—'}
          </strong>
          <Link to="/pokedollar" className="perfil-ganhar-saldo">
            Ganhar PokéDollars
          </Link>
        </div>
      </div>

      <div className="perfil-secao">
        <h2>Meus Pets Adotados ({adotados.length})</h2>
        {adotados.length === 0 ? (
          <p className="texto-vazio">Você ainda não adotou nenhum Pokémon.</p>
        ) : (
          <div className="pets-grid">
            {adotados.map((pet) => (
              <div key={pet.id} className="pet-adotado-card">
                <img src={pet.imagem} alt={pet.nome} className="pet-adotado-img" />
                <h3>{pet.nome}</h3>
                <span className="pokemon-tipo">{pet.tipo}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="perfil-secao">
        <h2>Meu Inventário ({quantidadeItens})</h2>
        {inventario.length === 0 ? (
          <p className="texto-vazio">Nenhum item comprado no PokéMart ainda.</p>
        ) : (
          <ul className="perfil-lista">
            {inventario.map((item) => (
              <li key={item.id}>
                <span>{item.nome}</span>
                <strong>Quantidade: {item.quantidade}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="perfil-secao">
        <h2>Meus Pedidos ({pedidos.length})</h2>
        {pedidos.length === 0 ? (
          <p className="texto-vazio">Você ainda não realizou nenhum pedido.</p>
        ) : (
          <ul className="perfil-lista">
            {pedidos.map((pedido) => (
              <li key={pedido.id}>
                <span>Pedido de {pedido.data}</span>
                <strong>₽ {pedido.total.toLocaleString('pt-BR')}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!usuarioAtual && (
        <Link to="/login" className="perfil-login">
          Entrar ou criar conta
        </Link>
      )}
    </section>
  )
}

export default Perfil
