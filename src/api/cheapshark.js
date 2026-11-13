import axios from 'axios';

const cheapshark = axios.create({
  baseURL: 'https://www.cheapshark.com/api/1.0',
  timeout: 8000,
});

export default cheapshark;