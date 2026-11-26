import { useState } from 'react'
import './PokeDollar.css'

function PokeDollar({ saldo, adicionarSaldo }) {
  const [ultimoPremio, setUltimoPremio] = useState(null)

  function girarRoleta() {
    // Gera um número inteiro aleatório entre 100 e 1000
    const valorGanho = Math.floor(Math.random() * 901) + 100
    adicionarSaldo(valorGanho)
    setUltimoPremio(valorGanho)
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

        <button onClick={girarRoleta} className="btn-sortear">
          Ganhar PokéDollars!
        </button>

        {ultimoPremio && (
          <div className="moedas-feedback">
            Você ganhou <strong>₽ {ultimoPremio}</strong> PokéDollars!
          </div>
        )}
      </div>
    </section>
  )
}

export default PokeDollar