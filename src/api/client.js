import axios from 'axios';

const API_BASE = 'http://localhost:8081';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (payload) => client.post('/api/auth/login', payload),
  register: (payload) => client.post('/api/auth/register', payload)
};

export const reservationsApi = {
  list: () => client.get('/api/reservations'),
  create: (payload) => client.post('/api/reservations', payload),
  update: (id, payload) => client.put(`/api/reservations/${id}`, payload),
  remove: (id) => client.delete(`/api/reservations/${id}`)
};

export default client;
