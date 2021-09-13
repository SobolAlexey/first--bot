const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} =  require('./options')

const token = '1956033791:AAEmLexeY8b89JJGr_AJoCH3_9i5qgsou7A'

const bot = new TelegramApi(token, { polling: true })
const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Получить инфо' },
        { command: '/game', description: 'Начать игру' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/e80/dfb/e80dfbc0-4362-4d34-8e84-88fd94848225/6.webp')
            return bot.sendMessage(chatId, `Добро пожаловать!!`)
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
         return startGame(chatId)
        }
        return bot.sendMessage(chatId, `Я тебя не понимаю!!`)
    })
bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
        return startGame(chatId)
       }
    if (data ==  chats[chatId]) {
        return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
        return bot.sendMessage(chatId, `К сожалению ты не угадал , бот загадал цифру ${chats[chatId]}`, againOptions)
    }
})
}
start()