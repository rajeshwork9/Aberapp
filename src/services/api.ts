import axios from 'axios';
import {API_BASE_URL} from '../utils/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs'; 

const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000,
});


//  Function to refresh token
const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post(`${API_BASE_URL}/login/refresh`, {
      refreshToken,
    });

    await AsyncStorage.multiSet([
      ['accessToken', data.AccessToken],
      ['refreshToken', data.RefreshToken],
      ['tokenExpiry', data.Expires],
    ]);

    return data.AccessToken;
  } catch (err) {
    console.error('[TOKEN REFRESH FAILED]', err);
    await AsyncStorage.clear(); // logout user
    return null;
  }
};


// 🔐 Request Interceptor with Logging
api.interceptors.request.use(
  async config => {
    let accessToken = await AsyncStorage.getItem('accessToken');
    const expiry = await AsyncStorage.getItem('tokenExpiry');

    const isExpired = expiry && dayjs().isAfter(dayjs(expiry));
    if (isExpired) {
      console.log('[🔁] AccessToken expired, refreshing...');
      accessToken = await refreshToken();
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    console.error('[❌ REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// ⚠️ Response Interceptor with Logging
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('[❌ RESPONSE ERROR]', error);
    if (error.response?.status === 401) {
      console.warn('[⚠️ UNAUTHORIZED] Logging out');
      AsyncStorage.clear();
    }
    return Promise.reject(error);
  }
);


export default api;
