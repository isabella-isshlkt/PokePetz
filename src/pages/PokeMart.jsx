import { useState } from 'react'
import { Link } from 'react-router-dom'
import { produtos } from '../data/produtos'
import './PokeMart.css'

function PokeMart({
  usuarioAtual,
  carrinho = [],
  adicionarAoCarrinho,
  alterarQuantidade,
  removerDoCarrinho,
  finalizarPedido,
}) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')
  const [mensagemPedido, setMensagemPedido] = useState(null)
  const [processando, setProcessando] = useState(false)

  const categorias = ['Todos', ...new Set(produtos.map((produto) => produto.categoria))]
  const produtosFiltrados = categoriaAtiva === 'Todos'
    ? produtos
    : produtos.filter((produto) => produto.categoria === categoriaAtiva)
  const totalCarrinho = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0,
  )
  const quantidadeCarrinho = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0,
  )
  const saldo = usuarioAtual?.saldo ?? 0

  async function handleFinalizar() {
    if (processando) return

    setProcessando(true)
    setMensagemPedido(null)
    try {
      const resultado = await finalizarPedido()
      setMensagemPedido({
        tipo: resultado?.ok ? 'sucesso' : 'erro',
        texto: resultado?.mensagem || 'Não foi possível finalizar o pedido.',
      })
    } catch {
      setMensagemPedido({
        tipo: 'erro',
        texto: 'Não foi possível conectar ao servidor. Tente novamente.',
      })
    } finally {
      setProcessando(false)
    }
  }

  return (
    <section className="page pokemart-page">
      <h1>PokéMart</h1>
      <p>Tudo o que seu Pokémon precisa para viver feliz e saudável!</p>

      <div className="filtros-categoria" aria-label="Filtrar produtos por categoria">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            onClick={() => setCategoriaAtiva(categoria)}
            className={`btn-filtro ${categoriaAtiva === categoria ? 'ativo' : ''}`}
            aria-pressed={categoriaAtiva === categoria}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="loja-layout">
        <div className="produtos-grid">
          {produtosFiltrados.map((produto) => (
            <article key={produto.id} className="produto-card">
              <img
                className="produto-imagem"
                src={produto.imagem}
                alt={produto.nome}
              />
              <span className="produto-categoria">{produto.categoria}</span>
              <h2>{produto.nome}</h2>
              <p className="produto-descricao">{produto.descricao}</p>
              <strong className="produto-preco">
                ₽ {produto.preco.toLocaleString('pt-BR')}
              </strong>
              <button
                type="button"
                onClick={() => adicionarAoCarrinho(produto)}
                className="btn-adicionar"
              >
                Adicionar ao carrinho
              </button>
            </article>
          ))}
        </div>

        <aside className="carrinho-painel">
          <h2>Meu Carrinho ({quantidadeCarrinho})</h2>
          <p className="carrinho-saldo">
            Saldo disponível: ₽ {saldo.toLocaleString('pt-BR')}
          </p>

          {!usuarioAtual && (
            <p className="carrinho-login">
              Entre na sua conta para concluir a compra. <Link to="/login">Entrar</Link>
            </p>
          )}

          {mensagemPedido && (
            <p
              className={`pedido-mensagem pedido-${mensagemPedido.tipo}`}
              role="alert"
            >
              {mensagemPedido.texto}
            </p>
          )}

          {carrinho.length === 0 ? (
            <p className="carrinho-vazio">Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul className="carrinho-lista">
                {carrinho.map((item) => (
                  <li key={item.id} className="carrinho-item">
                    <div className="carrinho-item-info">
                      <strong>{item.nome}</strong>
                      <span>
                        ₽ {(item.preco * item.quantidade).toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <div className="carrinho-controles">
                      <button
                        type="button"
                        onClick={() => alterarQuantidade(item.id, -1)}
                        aria-label={`Diminuir quantidade de ${item.nome}`}
                      >
                        −
                      </button>
                      <span>{item.quantidade}</span>
                      <button
                        type="button"
                        onClick={() => alterarQuantidade(item.id, 1)}
                        aria-label={`Aumentar quantidade de ${item.nome}`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removerDoCarrinho(item.id)}
                        className="btn-remover"
                        aria-label={`Remover ${item.nome} do carrinho`}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="carrinho-total">
                <span>Total:</span>
                <strong>₽ {totalCarrinho.toLocaleString('pt-BR')}</strong>
              </div>

              <button
                type="button"
                onClick={handleFinalizar}
                className="btn-finalizar"
                disabled={processando}
              >
                {processando ? 'Processando...' : 'Finalizar Pedido'}
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}

export default PokeMart
