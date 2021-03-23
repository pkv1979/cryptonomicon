const API_KEY =
  "cef8e2180e7f806d282e7f53890345c81441b8283b4d240232b29a63bab21964";
const tickersHandlers = new Map();

// TODO: refactor to use URLSearchParams
const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?&fsyms=${[
      ...tickersHandlers.keys()
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then(r => r.json())
    .then(rawData => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );
      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach(fn => {
          fn(newPrice);
        });
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subsribers = tickersHandlers.get(ticker) || [];

  tickersHandlers.set(ticker, [...subsribers, cb]);
};

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);
