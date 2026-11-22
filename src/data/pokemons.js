// 1. Importando as imagens locais da pasta src/assets/pokemons
import bulbasaurImg from '../assets/pokemons/001.png'
import vulpixImg from '../assets/pokemons/037.png'
import meowthImg from '../assets/pokemons/052.png'
import growlitheImg from '../assets/pokemons/058.png'
import cuboneImg from '../assets/pokemons/104.png'
import dragoniteImg from '../assets/pokemons/149.png'
import unownImg from '../assets/pokemons/201.png'
import bunnelbyImg from '../assets/pokemons/659.png'
import swirlixImg from '../assets/pokemons/684.png'
import slurpuffImg from '../assets/pokemons/685.png'

// 2. Criando e exportando a lista (Array) de Pokémon disponíveis para adoção
export const pokemons = [
  {
    id: 1,
    nome: 'Bulbasaur',
    tipo: 'Planta / Venenoso',
    descricao: 'Calmo, leal e adora tirar sonecas ao sol. Ótimo companheiro para treinadores iniciantes.',
    personalidade: 'Tranquilo e protetor',
    caracteristicas: 'Possui um bulbo nas costas que absorve luz solar e cresce junto com ele.',
    imagem: bulbasaurImg
  },
  {
    id: 2,
    nome: 'Vulpix',
    tipo: 'Fogo',
    descricao: 'Elegante, afetuoso e muito apegado ao seu treinador. Gosta de lugares quentinhos.',
    personalidade: 'Carinhoso e observador',
    caracteristicas: 'Pelagem macia avermelhada e seis caudas enroladas sempre quentes ao toque.',
    imagem: vulpixImg
  },
  {
    id: 3,
    nome: 'Meowth',
    tipo: 'Normal',
    descricao: 'Esperto, curioso e fascinado por objetos brilhantes. Adora explorar a casa durante a noite.',
    personalidade: 'Independente e brincalhão',
    caracteristicas: 'Amuleto dourado na testa, bigodes longos e passos completamente silenciosos.',
    imagem: meowthImg
  },
  {
    id: 4,
    nome: 'Growlithe',
    tipo: 'Fogo',
    descricao: 'Extremamente fiel, corajoso e cheio de energia. Protege seu treinador e sua casa com dedicação.',
    personalidade: 'Leal e energético',
    caracteristicas: 'Pelagem listrada laranja e preta, faro apurado e latido amigável.',
    imagem: growlitheImg
  },
  {
    id: 5,
    nome: 'Cubone',
    tipo: 'Terrestre',
    descricao: 'Tímido no início, mas desenvolve um laço profundo e sincero quando ganha confiança.',
    personalidade: 'Sensível e corajoso',
    caracteristicas: 'Usa um capacete de osso protetor e carrega sempre seu fiel osso nas mãos.',
    imagem: cuboneImg
  },
  {
    id: 6,
    nome: 'Dragonite',
    tipo: 'Dragão / Voador',
    descricao: 'Gentil, inteligente e com um coração gigante. Adora ajudar pessoas e outros Pokémon.',
    personalidade: 'Bondoso e calmo',
    caracteristicas: 'Asas ágeis capazes de voar longas distâncias e expressão sempre amigável.',
    imagem: dragoniteImg
  },
  {
    id: 7,
    nome: 'Unown',
    tipo: 'Psíquico',
    descricao: 'Misterioso, silencioso e fascinante. Ideal para treinadores que amam pesquisa e tranquilidade.',
    personalidade: 'Quieto e enigmático',
    caracteristicas: 'Corpo fino que flutua no ar em formato de símbolo antigo com um grande olho curioso.',
    imagem: unownImg
  },
  {
    id: 8,
    nome: 'Bunnelby',
    tipo: 'Normal',
    descricao: 'Ativo, trabalhador e muito divertido. Adora cavar no jardim e fazer companhia o dia todo.',
    personalidade: 'Alegre e prestativo',
    caracteristicas: 'Orelhas grandes e fortes usadas como pás e pelagem fofa em tons de cinza e marrom.',
    imagem: bunnelbyImg
  },
  {
    id: 9,
    nome: 'Swirlix',
    tipo: 'Fada',
    descricao: 'Doce, animado e apaixonado por guloseimas. Traz alegria para qualquer ambiente.',
    personalidade: 'Dócil e guloso',
    caracteristicas: 'Pelagem fofa parecida com algodão-doce e aroma suave de açúcar no ar.',
    imagem: swirlixImg
  },
  {
    id: 10,
    nome: 'Slurpuff',
    tipo: 'Fada',
    descricao: 'Companheiro dedicado com olfato incrível. Adora ajudar na cozinha e cuidar dos amigos.',
    personalidade: 'Atencioso e animado',
    caracteristicas: 'Aparência fofa de merengue, olfato milhões de vezes mais sensível que o humano.',
    imagem: slurpuffImg
  }
]