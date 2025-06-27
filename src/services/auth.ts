// services/auth.ts

import {API_BASE_URL } from '../utils/environment';
import api from './api'; // Make sure this is an axios instance
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// login
export const login = async (payload : any) => {
  try {
    const response : any = await api.post('/login', payload);
     await AsyncStorage.multiSet([
    ['accessToken', response.AccessToken],
    ['refreshToken', response.RefreshToken],
    ['tokenExpiry', response.Expires], // or use ExpiresInSeconds
  ]);
    return response.data;
  } catch (error) {
    console.error('login error:', error);
    throw error;
  }
};
