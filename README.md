# PokéPetz

Aplicação React com API Express e MongoDB.

## Executar localmente

1. Instale as dependências na raiz do projeto com `npm install`.
2. Copie `server/.env.example` para `server/.env` e preencha `MONGODB_URI`.
3. Inicie a API com `npm run dev:server`.
4. Em outro terminal, inicie o frontend com `npm run dev`.

O frontend usa o proxy `/api` configurado no Vite para falar com a API local.

## Conta e adoção

Após entrar ou criar uma conta, a sessão é salva neste navegador e restaurada ao abrir ou atualizar o site. As sessões expiram após 30 dias e podem ser encerradas pelo botão **Sair**.

É necessário estar autenticado para adotar Pokémon. A API também valida a sessão antes de registrar uma adoção; entrar no site após a expiração encaminha o usuário para o login.

As senhas novas são armazenadas com hash scrypt. Senhas antigas em texto puro são atualizadas para hash no próximo login bem-sucedido.
