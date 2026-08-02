import axios from 'axios';

const rawg = axios.create({
  baseURL: 'https://api.rawg.io/api',
});

rawg.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    key: import.meta.env.VITE_RAWG_KEY,
  };
  return config;
});

export default rawg;
