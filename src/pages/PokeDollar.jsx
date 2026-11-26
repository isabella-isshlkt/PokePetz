import { useState } from 'react'
import './PokeDollar.css'

function PokeDollar({ saldo = 0, adicionarSaldo }) {
  const [ultimoPremio, setUltimoPremio] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function girarRoleta() {
    if (carregando) return

    const valorGanho = Math.floor(Math.random() * 901) + 100
    setCarregando(true)
    setErro('')
    setUltimoPremio(null)

    try {
      const resultado = await adicionarSaldo(valorGanho)
      if (!resultado?.ok) {
        setErro(resultado?.erro || 'Não foi possível adicionar o saldo.')
        return
      }
      setUltimoPremio(valorGanho)
    } catch {
      setErro('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="page">
      <h1>Ganhar PokéDollars</h1>
      <p>Clique no botão abaixo para tentar a sorte e ganhar entre 100 e 1.000 PokéDollars!</p>

      <div className="moedas-card">
        <div className="moedas-saldo">
          <span>Seu saldo atual:</span>
          <strong>₽ {saldo.toLocaleString('pt-BR')}</strong>
        </div>

        <button
          onClick={girarRoleta}
          className="btn-sortear"
          disabled={carregando}
        >
          {carregando ? 'Adicionando...' : 'Ganhar PokéDollars!'}
        </button>

        {erro && (
          <div className="moedas-erro" role="alert">
            {erro}
          </div>
        )}

        {ultimoPremio !== null && (
          <div className="moedas-feedback" role="status">
            Você ganhou <strong>₽ {ultimoPremio}</strong> PokéDollars!
          </div>
        )}
      </div>
    </section>
  )
}

export default PokeDollar
