# GrokHelperBot

Este é um bot Discord inteligente que usa a API do Google Gemini para responder a perguntas, ajudar com código (incluindo Lua) e pode ser ativado/desativado remotamente pelo proprietário.

## Requisitos

*   Node.js (versão 16.x ou superior)
*   Conta Discord
*   Conta Google Cloud/Gemini (para obter a chave de API do Gemini)

## Como criar o Bot no Discord Developer Portal

1.  Acesse o [Discord Developer Portal](https://discord.com/developers/applications).
2.  Clique em "New Application".
3.  Dê um nome ao seu aplicativo (ex: "GrokHelperBot") e clique em "Create".
4.  No menu lateral esquerdo, vá para a aba "Bot".
5.  Clique em "Add Bot" e depois em "Yes, do it!".

## Como pegar o Token do Bot

1.  Na aba "Bot" do seu aplicativo no Developer Portal, localize a seção "TOKEN".
2.  Clique em "Reset Token" (se for a primeira vez, ele já estará lá). Copie o token exibido. **MANTENHA ESTE TOKEN EM SEGURANÇA! NUNCA O COMPARTILHE.**

## IMPORTANTE: Ativar Message Content Intent e Server Members Intent

1.  Na mesma aba "Bot" no Developer Portal, role para baixo até a seção "Privileged Gateway Intents".
2.  Ative as opções:
    *   `PRESENCE INTENT` (Não estritamente necessário para este bot, mas bom para outros recursos futuros)
    *   `SERVER MEMBERS INTENT` (Necessário para funcionalidades de moderação e acesso a membros, embora este bot não use diretamente)
    *   `MESSAGE CONTENT INTENT` (CRÍTICO! SEM ISSO, O BOT NÃO CONSEGUIRÁ LER AS MENSAGENS E NÃO FUNCIONARÁ).
3.  Salve as alterações.

## Como convidar o bot para o servidor

1.  No menu lateral esquerdo do Developer Portal, vá para a aba "OAuth2" -> "URL Generator".
2.  Em "SCOPES", selecione `bot`.
3.  Em "BOT PERMISSIONS", selecione as seguintes permissões:
    *   `Read Messages/View Channels`
    *   `Send Messages`
    *   `Embed Links` (útil para futuras melhorias)
    *   `Attach Files` (útil para futuras melhorias)
    *   `Use External Emojis` (útil para futuras melhorias)
    *   `Read Message History`
    *   `Use Slash Commands` (útil para futuras melhorias)
4.  Um URL será gerado abaixo na seção "Generated URL". Copie este URL.
5.  Cole o URL no seu navegador e selecione o servidor para o qual deseja convidar o bot.
6.  Clique em "Authorize".

## Como pegar a chave de API do Google Gemini

1.  Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey) ou [Google Cloud Console](https://console.cloud.google.com/).
2.  Crie um novo projeto, se ainda não tiver um.
3.  Gere uma chave de API para o Gemini.
4.  **MANTENHA ESTA CHAVE EM SEGURANÇA! NUNCA A COMPARTILHE.**

## Como rodar o projeto

1.  **Clone o repositório** (ou crie os arquivos manualmente).

2.  **Crie um arquivo `.env`** na raiz do projeto com o seguinte conteúdo, substituindo os valores pelos seus:
    env
    DISCORD_TOKEN=SEU_TOKEN_DO_BOT_AQUI
    GEMINI_API_KEY=SUA_CHAVE_API_GEMINI_AQUI
    OWNER_ID=SEU_ID_DE_USUARIO_DISCORD_AQUI
    
    *   Para obter seu `OWNER_ID`: No Discord, vá em "Configurações de Usuário" -> "Avançado" e ative o "Modo Desenvolvedor". Então, clique com o botão direito no seu nome de usuário e selecione "Copiar ID".

3.  **Instale as dependências**:
    bash
    npm install
    

4.  **Inicie o bot**:
    bash
    node index.js
    
    Ou, usando o script `start` definido no `package.json`:
    bash
    npm start
    

O bot agora deve estar online no seu servidor Discord!

## Comandos do Bot

*   **Conversar com a IA**: Mencione o bot em qualquer canal (`@SeuBot Olá! Como posso criar um código Lua para...`) ou envie uma mensagem direta para ele. A IA responderá se o bot estiver ativo.

*   **Desativar o Bot (APENAS DM para o Proprietário)**: Envie `Desativar bot` em uma mensagem direta para o bot. Isso o desativará globalmente, e ele não responderá mais em nenhum servidor até ser reativado.

*   **Ativar o Bot (APENAS DM para o Proprietário)**: Envie `Ativar bot` em uma mensagem direta para o bot. Isso o reativará globalmente.
