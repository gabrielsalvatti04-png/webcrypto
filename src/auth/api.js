import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

function resolveQueue(error, token=null) {
  queue.forEach(p => error ? p.reject(error) : p.resolve(token));
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers['Authorization'] = 'Bearer ' + token;
          return api(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const rt = localStorage.getItem('refreshToken');
        if (!rt) throw new Error('No refresh token');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken: rt });
        localStorage.setItem('accessToken', data.accessToken);
        resolveQueue(null, data.accessToken);
        original.headers['Authorization'] = 'Bearer ' + data.accessToken;
        return api(original);
      } catch (err) {
        resolveQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
    throw error;
  }
);

export default api;

