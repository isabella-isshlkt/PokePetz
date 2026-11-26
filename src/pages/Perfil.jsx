import './Perfil.css'

function Perfil({ adotados = [] }) {
  return (
    <section className="page">
      <h1>Meu Perfil</h1>
      <p>Gerencie suas informações, seus Pokémon adotados e seus itens do PokéMart.</p>

      {/* Divisor 1: Informações Pessoais e Dinheiro */}
      <div className="perfil-secao perfil-cabecalho">
        <div>
          <h2>Treinador(a) PokéPetz</h2>
          <p>Status: Conta Ativa</p>
        </div>
        <div className="perfil-saldo">
          <span>Saldo disponível:</span>
          <strong>₽ 1.000</strong>
        </div>
      </div>

      {/* Divisor 2: Meus Pets Adotados */}
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

      {/* Divisor 3: Meu Inventário (engatilhado para Versão 3 e 4) */}
      <div className="perfil-secao">
        <h2>Meu Inventário (0)</h2>
        <p className="texto-vazio">Nenhum item comprado no PokéMart ainda.</p>
      </div>

      {/* Divisor 4: Meus Pedidos (engatilhado para Versão 3 e 4) */}
      <div className="perfil-secao">
        <h2>Meus Pedidos (0)</h2>
        <p className="texto-vazio">Você ainda não realizou nenhum pedido.</p>
      </div>
    </section>
  )
}

export default Perfil