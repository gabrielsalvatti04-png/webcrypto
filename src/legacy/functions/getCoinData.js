import axios from "axios";

export const getCoinData = async (id) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${id}`,
    {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
        x_cg_demo_api_key: process.env.REACT_APP_COINGECKO_KEY, // <--
      },
      timeout: 15000,
    }
  );
  return data;
};
