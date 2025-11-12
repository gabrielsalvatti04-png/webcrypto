import axios from "axios";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 15000,
});

// Injeta a chave como *query param* (evita preflight/CORS no browser)
api.interceptors.request.use((config) => {
  const key = process.env.REACT_APP_COINGECKO_KEY;
  if (!config.params) config.params = {};
  if (key) config.params["x_cg_demo_api_key"] = key; // <-- em vez do header
  return config;
});

export default api;
