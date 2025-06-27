import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

import { API_BASE_URL } from '../utils/environment';
import { resetToLogin } from '../navigation/RootNavigation';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/* -------- 1. Refresh helper -------- */
const refreshToken = async () => {
  const rt = await AsyncStorage.getItem('refreshToken');
  if (!rt) return null;

  try {
    const { data } = await axios.post(`${API_BASE_URL}/login/refresh`, {
      refreshToken: rt,
    });

    await AsyncStorage.multiSet([
      ['accessToken', data.AccessToken],
      ['refreshToken', data.RefreshToken],
      ['tokenExpiry', data.Expires],
    ]);

    return data.AccessToken;
  } catch (err: any) {
    console.log('[TOKEN REFRESH FAILED]', err?.response?.data);
    await AsyncStorage.clear();
    return null;
  }
};

/* -------- 2. Request interceptor -------- */
api.interceptors.request.use(async config => {
  let accessToken = await AsyncStorage.getItem('accessToken');
  const expiry     = await AsyncStorage.getItem('tokenExpiry');

  /* 🔄 Expired? Try refresh right before the request */
  if (expiry && dayjs().isAfter(dayjs(expiry))) {
    console.log('[🔁] AccessToken expired → refreshing');
    accessToken = await refreshToken();
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/* -------- 3. Response interceptor -------- */
api.interceptors.response.use(
  resp => resp,
  async error => {
    /* 401 could still happen if refresh token also died */
    if (error.response?.status === 401) {
      await AsyncStorage.clear();
      resetToLogin();                       // 🔙 go to Login screen
    }
    return Promise.reject(error);
  },
);

export default api;
