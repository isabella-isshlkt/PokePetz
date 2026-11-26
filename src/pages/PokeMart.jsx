import { useState } from 'react'
import { produtos } from '../data/produtos'
import './PokeMart.css'

function PokeMart({
  saldo = 0,
  carrinho = [],
  adicionarAoCarrinho,
  alterarQuantidade,
  removerDoCarrinho,
  finalizarPedido
}) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)
  const [erroPedido, setErroPedido] = useState('')

  // Gera os botões de categoria automaticamente a partir do seu produtos.js
  const categorias = ['Todos', ...new Set(produtos.map((p) => p.categoria))]

  const produtosFiltrados =
    categoriaAtiva === 'Todos'
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaAtiva)

  const totalCarrinho = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  )

  function handleFinalizar() {
    const finalizado = finalizarPedido()
    if (!finalizado) {
      setPedidoConfirmado(false)
      setErroPedido('Saldo insuficiente para finalizar este pedido.')
      return
    }

    setErroPedido('')
    setPedidoConfirmado(true)
    setTimeout(() => setPedidoConfirmado(false), 4000)
  }

  return (
    <section className="page">
      <h1>PokéMart</h1>
      <p>Tudo o que seu Pokémon precisa para viver feliz e saudável!</p>

      {/* Organização: Filtro por categoria */}
      <div className="filtros-categoria">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`btn-filtro ${categoriaAtiva === cat ? 'ativo' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="loja-layout">
        {/* Vitrine de Produtos */}
        <div className="produtos-grid">
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className="produto-card">
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="produto-img"
              />
              <span className="produto-categoria">{produto.categoria}</span>
              <h3>{produto.nome}</h3>
              <p className="produto-descricao">{produto.descricao}</p>
              <strong className="produto-preco">₽ {produto.preco}</strong>
              <button
                onClick={() => adicionarAoCarrinho(produto)}
                className="btn-adicionar"
              >
                Adicionar ao carrinho
              </button>
            </div>
          ))}
        </div>

        {/* Painel do Carrinho */}
        <aside className="carrinho-painel">
          <h2>Meu Carrinho ({carrinho.length})</h2>
          <p className="carrinho-saldo">
            Saldo disponível: ₽ {saldo.toLocaleString('pt-BR')}
          </p>

          {pedidoConfirmado && (
            <div className="pedido-sucesso">
              ✅ Pedido finalizado com sucesso! Seus itens foram enviados ao seu inventário.
            </div>
          )}
          {erroPedido && <p className="pedido-erro">{erroPedido}</p>}

          {carrinho.length === 0 ? (
            <p className="carrinho-vazio">Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul className="carrinho-lista">
                {carrinho.map((item) => (
                  <li key={item.id} className="carrinho-item">
                    <div className="carrinho-item-info">
                      <strong>{item.nome}</strong>
                      <span>₽ {item.preco * item.quantidade}</span>
                    </div>

                    <div className="carrinho-controles">
                      <button onClick={() => alterarQuantidade(item.id, -1)}>-</button>
                      <span>{item.quantidade}</span>
                      <button onClick={() => alterarQuantidade(item.id, 1)}>+</button>
                      <button
                        onClick={() => removerDoCarrinho(item.id)}
                        className="btn-remover"
                        title="Remover item"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="carrinho-total">
                <span>Total:</span>
                <strong>₽ {totalCarrinho}</strong>
              </div>

              <button onClick={handleFinalizar} className="btn-finalizar">
                Finalizar Pedido
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}

export default PokeMart
