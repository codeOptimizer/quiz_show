import axios from 'axios';
import env from '../environments/environment';

const apiClient = axios.create({
  baseURL: env.ApiUrl,
  timeout: 90_000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  responseType: 'json',
  responseEncoding: 'utf-8'
});

export default apiClient;

