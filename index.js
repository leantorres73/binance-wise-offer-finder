const axios = require('axios');
const { sendMessage } = require('./telegram');

const cache = [];

const headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Length": "123",
    "content-type": "application/json",
    "Host": "p2p.binance.com",
    "Origin": "https://p2p.binance.com",
    "Pragma": "no-cache",
    "TE": "Trailers",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
};

const data = {
    asset: 'USDT',
    tradeType: 'BUY',
    fiat: 'USD',
    transAmount: 0,
    order: '',
    page: 1,
    rows: 10,
    publisherType: "merchant",
    payTypes: ['Transferwise'],
    merchantCheck: true
};

const execute = async () => {
  try {
    const responseData = await axios.post(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      JSON.stringify(data),
      {
        headers
      }
    );
    const goodOffers = responseData.data.data.filter(x => parseFloat(x.adv.price) <= parseFloat(process.env.PRICE));
    await Promise.all(goodOffers.map(async offer => {
      if (!cache[offer.adv.advNo]) {
        cache.push(offer.adv.advNo)
        await sendMessage(offer.adv);
      }
    }));
  } catch (err) {
    console.log(err);
  }
}

(async () => {
  const minutes = 10, interval = minutes * 60 * 1000;
  await execute();
  setInterval(async function() {
    console.log(`Running ${new Date()}`)
      await execute();
  }, interval);
})();
