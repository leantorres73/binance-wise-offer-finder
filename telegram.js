const TelegramBot = require('node-telegram-bot-api');
var token = process.env.TELEGRAM_TOKEN;
const receiver = process.env.TELEGRAM_CHANNEL;

var bot = new TelegramBot(token);

const sendMessage = async (adv) => {
  const msg = `Price: ${adv.price},
Min amount: ${adv.minSingleTransAmount},
Max amount: ${adv.dynamicMaxSingleTransAmount}
URL: https://p2p.binance.com/en/trade/Transferwise/USDT?fiat=USD`;
  await bot.sendMessage(receiver, msg);
}

module.exports = {
  sendMessage
}