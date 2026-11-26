import { Link } from 'react-router-dom'
import './ComoAdotar.css'

function ComoAdotar() {
  const etapas = [
    {
      titulo: 'Explore o catálogo',
      descricao: 'Veja os Pokémon disponíveis e escolha um companheiro que combine com você.',
    },
    {
      titulo: 'Conheça seu Pokémon',
      descricao: 'Use “Ver Detalhes” para ler sobre o tipo, a personalidade e as características.',
    },
    {
      titulo: 'Entre ou crie sua conta',
      descricao: 'Faça login para que a adoção fique vinculada ao seu perfil.',
    },
    {
      titulo: 'Confirme a adoção',
      descricao: 'Na página do Pokémon, clique em “Quero adotar!”. Depois, confira seu novo amigo no perfil.',
    },
  ]

  return (
    <main className="page como-adotar">
      <h1>Como Adotar</h1>
      <p className="como-adotar-intro">
        Encontre seu novo companheiro em poucos passos:
      </p>

      <ol className="etapas-adocao">
        {etapas.map((etapa, index) => (
          <li className="etapa-adocao" key={etapa.titulo}>
            <span className="etapa-numero">{index + 1}</span>
            <div>
              <h2>{etapa.titulo}</h2>
              <p>{etapa.descricao}</p>
            </div>
          </li>
        ))}
      </ol>

      <Link to="/adote" className="btn-catalogo">
        Ver Pokémon disponíveis
      </Link>
    </main>
  )
}

export default ComoAdotar