require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configurações do bot
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OWNER_ID = process.env.OWNER_ID; // ID do usuário proprietário do bot

// Verifica se as variáveis de ambiente essenciais estão definidas
if (!DISCORD_TOKEN) {
    console.error('ERRO: O token do Discord não foi fornecido. Certifique-se de ter um arquivo .env com DISCORD_TOKEN.');
    process.exit(1);
}
if (!GEMINI_API_KEY) {
    console.error('AVISO: A chave da API Gemini não foi fornecida. O bot não poderá usar a funcionalidade de IA.');
}
if (!OWNER_ID) {
    console.error('AVISO: O ID do proprietário não foi fornecido. Os comandos de ativação/desativação podem não funcionar corretamente.');
}

// Inicializa o cliente Discord com os intents necessários
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent // ESSENCIAL para ler o conteúdo das mensagens
    ],
    partials: [Partials.Channel, Partials.Message] // Necessário para DM e alguns eventos de mensagem
});

// Inicializa a API Gemini
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-pro" }) : null;

// Variável de estado para controlar se o bot está ativo ou desativado globalmente
let botActive = true;

client.once('ready', () => {
    console.log(`Bot online como ${client.user.tag}!`);
    if (!botActive) {
        console.log('O bot está desativado no momento. Envie "Ativar bot" por DM para reativá-lo.');
    }
});

client.on('messageCreate', async message => {
    // Ignora mensagens de outros bots para evitar loops
    if (message.author.bot) return;

    // Lógica para ativar/desativar o bot (apenas pelo proprietário em DM)
    if (message.channel.type === 1 && message.author.id === OWNER_ID) { // 1 é o tipo de canal DM
        const content = message.content.toLowerCase().trim();

        if (content === 'desativar bot') {
            botActive = false;
            await message.reply('Bot desativado para todos os servidores. Não responderei até ser ativado novamente.');
            console.log(`Bot desativado por ${message.author.tag}.`);
            return;
        }

        if (content === 'ativar bot') {
            botActive = true;
            await message.reply('Bot ativado para todos os servidores. Estou pronto para responder!');
            console.log(`Bot ativado por ${message.author.tag}.`);
            return;
        }
    }

    // Se o bot estiver desativado, ele não responde a nenhuma outra mensagem
    if (!botActive) {
        // Opcional: para o proprietário, pode-se enviar uma mensagem informando que está desativado.
        // if (message.author.id === OWNER_ID && (message.mentions.users.has(client.user.id) || message.channel.type === 1)) {
        //     await message.reply('Estou desativado no momento. Use "Ativar bot" em DM para me ligar.');
        // }
        return;
    }

    // Lógica de IA: Responde se for mencionado ou em DM
    const isMentioned = message.mentions.users.has(client.user.id);
    const isDirectMessage = message.channel.type === 1;

    if (isMentioned || isDirectMessage) {
        let prompt = message.content;

        // Remove a menção do bot do prompt se for uma menção
        if (isMentioned) {
            prompt = prompt.replace(`<@${client.user.id}>`, '').trim();
        }

        if (!prompt) {
            if (isMentioned) {
                await message.reply('Olá! Como posso ajudar você hoje?');
            } else if (isDirectMessage) {
                await message.reply('Você me mandou uma mensagem vazia. Como posso ajudar?');
            }
            return;
        }

        if (!model) {
            await message.reply('Desculpe, a funcionalidade de IA não está disponível porque a chave GEMINI_API_KEY não foi configurada.');
            return;
        }

        try {
            await message.channel.sendTyping(); // Mostra que o bot está digitando

            // Configura o chat com um histórico inicial (opcional, para contexto)
            const chat = model.startChat({
                history: [
                    { role: "user", parts: "Você é um assistente prestativo e amigável, especializado em ajudar com dúvidas gerais, fornecer informações e auxiliar na criação e depuração de código, incluindo Lua. Seu objetivo é ser o mais útil possível e fornecer respostas detalhadas e precisas." },
                    { role: "model", parts: "Entendido! Estou pronto para ajudar com qualquer pergunta ou desafio de codificação que você possa ter. Como posso ser útil hoje?" }
                ],
                generationConfig: {
                    maxOutputTokens: 2000
                }
            });

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const text = response.text();

            if (text) {
                // Divide a resposta em chunks se for muito longa para o Discord (limite 2000 caracteres)
                const chunkSize = 1900; // Um pouco menos que 2000 para margem de segurança
                for (let i = 0; i < text.length; i += chunkSize) {
                    const chunk = text.substring(i, Math.min(i + chunkSize, text.length));
                    await message.reply(chunk);
                }
            } else {
                await message.reply('Não consegui obter uma resposta útil da IA. Tente novamente ou formule a pergunta de outra maneira.');
            }
        } catch (error) {
            console.error('Erro ao chamar a API Gemini:', error);
            await message.reply('Desculpe, ocorreu um erro ao tentar processar sua solicitação com a IA. Por favor, tente novamente mais tarde.');
        }
    }
});

// Lidar com erros do cliente Discord
client.on('error', error => {
    console.error('Ocorreu um erro no cliente Discord:', error);
});

// Login do bot
client.login(DISCORD_TOKEN);
                     
