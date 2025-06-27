import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const login = async (payload: any) => {
  console.log("payload", payload)
  const { data } = await api.post('/login', payload);

  await AsyncStorage.multiSet([
    ['accessToken',  data.AccessToken],
    ['refreshToken', data.RefreshToken],
    ['tokenExpiry',  data.Expires],   // in UTC ISO string
  ]);

  return data;
};
