import api from './api';
import axios from 'axios';

export const getAccountName = async () => {
  try {
    const response = await api.get('/accounts/customer/false');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFullAccountDetails = async (id: any) => {
  try {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};