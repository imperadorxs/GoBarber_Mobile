import axios from 'axios';

const api = axios.create({
  baseURL: 'https://deploy.supercodigo.com.br/',
});

export default api;
