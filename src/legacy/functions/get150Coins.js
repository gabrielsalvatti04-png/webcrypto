import axios from "axios";

export const get150Coins = async (currency = "usd", page = 1) => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: currency,
        order: "market_cap_desc",
        per_page: 150,
        page,
        sparkline: false,
        locale: "en",
        x_cg_demo_api_key: process.env.REACT_APP_COINGECKO_KEY, // <--
      },
      timeout: 15000,
    }
  );
  return data;
};
