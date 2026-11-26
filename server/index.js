const path = require('node:path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const { createHash, randomBytes } = require('node:crypto')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { hashPassword, verifyPassword } = require('./passwords')

const app = express()
app.use(cors())
app.use(express.json())

// --- 2. ESTRUTURA DAS COLEÇÕES (SCHEMAS) ---
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  saldo: { type: Number, default: 1000 },
  inventario: [
    {
      id: Number,
      nome: String,
      quantidade: Number,
      imagem: String
    }
  ]
})

const adocaoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  pokemonId: { type: Number, required: true },
  nome: String,
  tipo: String,
  imagem: String,
  dataAdocao: { type: Date, default: Date.now }
})

const pedidoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  data: String,
  total: Number,
  itens: [
    {
      id: Number,
      nome: String,
      preco: Number,
      quantidade: Number,
      imagem: String
    }
  ]
})

const sessaoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tokenHash: { type: String, required: true, unique: true },
  expiraEm: { type: Date, required: true, expires: 0 }
})

const Usuario = mongoose.model('Usuario', usuarioSchema)
const Adocao = mongoose.model('Adocao', adocaoSchema)
const Pedido = mongoose.model('Pedido', pedidoSchema)
const Sessao = mongoose.model('Sessao', sessaoSchema)

const hashToken = (token) => createHash('sha256').update(token).digest('hex')

async function criarSessao(usuario) {
  const token = randomBytes(32).toString('hex')
  const expiraEm = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await Sessao.create({
    usuarioId: usuario._id,
    tokenHash: hashToken(token),
    expiraEm
  })

  return {
    token,
    usuario: await montarPerfilCompleto(usuario)
  }
}

async function exigirSessao(req, res, next) {
  const correspondencia = /^Bearer ([a-f0-9]{64})$/i.exec(req.get('authorization') || '')
  if (!correspondencia) {
    return res.status(401).json({ ok: false, erro: 'Faça login para continuar.' })
  }

  try {
    const sessao = await Sessao.findOne({
      tokenHash: hashToken(correspondencia[1]),
      expiraEm: { $gt: new Date() }
    })

    if (!sessao) {
      return res.status(401).json({ ok: false, erro: 'Sua sessão expirou. Entre novamente.' })
    }

    req.usuarioId = sessao.usuarioId
    next()
  } catch {
    res.status(500).json({ ok: false, erro: 'Não foi possível validar sua sessão.' })
  }
}

app.get('/api/health', (req, res) => {
  const conectado = mongoose.connection.readyState === 1
  res.status(conectado ? 200 : 503).json({
    ok: conectado,
    banco: conectado ? 'conectado' : 'desconectado'
  })
})

// Função auxiliar: monta o perfil completo juntando as 3 coleções
async function montarPerfilCompleto(usuario) {
  const adocoes = await Adocao.find({ usuarioId: usuario._id })
  const pedidos = await Pedido.find({ usuarioId: usuario._id }).sort({ _id: -1 })

  return {
    id: usuario._id,
    nome: usuario.nome,
    email: usuario.email,
    saldo: usuario.saldo,
    inventario: usuario.inventario,
    adotados: adocoes.map((a) => ({
      id: a.pokemonId,
      nome: a.nome,
      tipo: a.tipo,
      imagem: a.imagem
    })),
    pedidos: pedidos.map((p) => ({
      id: p._id,
      data: p.data,
      total: p.total,
      itens: p.itens
    }))
  }
}

// --- 3. ROTAS DA API ---

// Cadastro
app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body
    if (
      typeof nome !== 'string' ||
      typeof email !== 'string' ||
      typeof senha !== 'string' ||
      !nome.trim() ||
      !email.trim() ||
      !senha.trim()
    ) {
      return res.status(400).json({ ok: false, erro: 'Preencha todos os campos para criar sua conta.' })
    }

    const emailLimpo = email.trim().toLowerCase()

    const jaExiste = await Usuario.findOne({ email: emailLimpo })
    if (jaExiste) {
      return res.status(400).json({ ok: false, erro: 'Este e-mail já está cadastrado.' })
    }

    const novoUsuario = await Usuario.create({
      nome: nome.trim(),
      email: emailLimpo,
      senha: await hashPassword(senha)
    })

    const sessao = await criarSessao(novoUsuario)
    res.json({ ok: true, ...sessao })
  } catch {
    res.status(500).json({ ok: false, erro: 'Erro ao cadastrar usuário.' })
  }
})

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body
    if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha) {
      return res.status(400).json({ ok: false, erro: 'Informe seu e-mail e sua senha.' })
    }

    const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() })

    const senhaValida = usuario
      ? await verifyPassword(senha, usuario.senha)
      : { matches: false, needsUpgrade: false }

    if (!usuario || !senhaValida.matches) {
      return res.status(401).json({ ok: false, erro: 'E-mail ou senha incorretos.' })
    }

    if (senhaValida.needsUpgrade) {
      usuario.senha = await hashPassword(senha)
      await usuario.save()
    }

    const sessao = await criarSessao(usuario)
    res.json({ ok: true, ...sessao })
  } catch {
    res.status(500).json({ ok: false, erro: 'Erro ao realizar login.' })
  }
})

app.get('/api/sessao', exigirSessao, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId)
    if (!usuario) return res.status(404).json({ ok: false })

    const perfil = await montarPerfilCompleto(usuario)
    res.json({ ok: true, usuario: perfil })
  } catch {
    res.status(500).json({ ok: false, erro: 'Erro ao restaurar sua sessão.' })
  }
})

app.post('/api/logout', exigirSessao, async (req, res) => {
  try {
    await Sessao.deleteOne({
      usuarioId: req.usuarioId,
      tokenHash: hashToken(req.get('authorization').slice(7))
    })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ ok: false, erro: 'Erro ao encerrar sua sessão.' })
  }
})

// Adotar Pokémon
app.post('/api/adocoes', exigirSessao, async (req, res) => {
  try {
    const { pokemon } = req.body
    if (!pokemon || !Number.isInteger(pokemon.id)) {
      return res.status(400).json({ ok: false, erro: 'Pokémon inválido para adoção.' })
    }

    const jaAdotado = await Adocao.findOne({
      usuarioId: req.usuarioId,
      pokemonId: pokemon.id
    })
    if (!jaAdotado) {
      await Adocao.create({
        usuarioId: req.usuarioId,
        pokemonId: pokemon.id,
        nome: pokemon.nome,
        tipo: pokemon.tipo,
        imagem: pokemon.imagem
      })
    }

    const usuario = await Usuario.findById(req.usuarioId)
    if (!usuario) {
      return res.status(404).json({ ok: false, erro: 'Usuário não encontrado.' })
    }
    const perfil = await montarPerfilCompleto(usuario)
    res.json({ ok: true, usuario: perfil })
  } catch {
    res.status(500).json({ ok: false, erro: 'Erro ao registrar adoção.' })
  }
})

// Adicionar saldo (PokéDollar)
app.patch('/api/usuarios/:id/saldo', exigirSessao, async (req, res) => {
  try {
    const { valor } = req.body
    if (req.params.id !== String(req.usuarioId)) {
      return res.status(403).json({ ok: false, erro: 'Você não pode alterar outra conta.' })
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      return res.status(400).json({ ok: false, erro: 'Valor de saldo inválido.' })
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { $inc: { saldo: valor } },
      { new: true }
    )

    if (!usuario) {
      return res.status(404).json({ ok: false, erro: 'Usuário não encontrado.' })
    }
    const perfil = await montarPerfilCompleto(usuario)
    res.json({ ok: true, usuario: perfil })
  } catch {
    res.status(500).json({ ok: false, erro: 'Erro ao atualizar saldo.' })
  }
})

// Finalizar pedido no PokéMart
app.post('/api/pedidos', exigirSessao, async (req, res) => {
  try {
    const { itens, total } = req.body
    const usuarioId = req.usuarioId
    const usuario = await Usuario.findById(usuarioId)

    if (!usuario) {
      return res.status(404).json({ ok: false, mensagem: 'Usuário não encontrado.' })
    }
    if (usuario.saldo < total) {
      return res.status(400).json({
        ok: false,
        mensagem: 'Saldo insuficiente! Ganhe mais PokéDollars antes de comprar.'
      })
    }

    // Atualiza saldo e inventário
    usuario.saldo -= total
    itens.forEach((itemComprado) => {
      const existente = usuario.inventario.find((inv) => inv.id === itemComprado.id)
      if (existente) {
        existente.quantidade += itemComprado.quantidade
      } else {
        usuario.inventario.push({
          id: itemComprado.id,
          nome: itemComprado.nome,
          quantidade: itemComprado.quantidade,
          imagem: itemComprado.imagem
        })
      }
    })
    await usuario.save()

    // Salva na coleção de pedidos
    await Pedido.create({
      usuarioId,
      data: new Date().toLocaleDateString('pt-BR'),
      total,
      itens
    })

    const perfil = await montarPerfilCompleto(usuario)
    res.json({
      ok: true,
      mensagem: 'Pedido finalizado! Itens salvos no banco de dados.',
      usuario: perfil
    })
  } catch {
    res.status(500).json({ ok: false, mensagem: 'Erro ao finalizar pedido.' })
  }
})

async function iniciarServidor() {
  const mongoUri = process.env.MONGODB_URI?.trim()
  if (!mongoUri) {
    throw new Error('Configure MONGODB_URI no arquivo server/.env.')
  }
  if (/[<>]/.test(mongoUri)) {
    throw new Error('Substitua os marcadores < > da MONGODB_URI por credenciais válidas.')
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
  console.log('Conectado ao MongoDB!')

  const port = Number(process.env.PORT) || 5000
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
  })
}

iniciarServidor().catch((err) => {
  const mensagem = err instanceof Error
    ? err.message.replace(/(mongodb(?:\+srv)?:\/\/)[^/\s]+@/gi, '$1[credenciais]@')
    : 'Erro desconhecido'
  console.error('Erro ao iniciar o servidor:', mensagem)
  process.exitCode = 1
})