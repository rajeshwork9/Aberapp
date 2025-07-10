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
    const response = await api.get(`accounts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVehiclesList = async (body: any) => {
  try {
    const response = await api.post('assets/page/details', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerTypes = async () => {
  try {
    const response = await api.get('masterTables/CustomerTypes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await api.get('users/info');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTodaysTrips = async (body: any) => {
  try {
    const response = await api.post('accounts/page/transactions', body);
    return response.data.TransactionsList;
  } catch (error) {
    throw error;
  }
};

export const getLicenceNumber = async (body: any) => {
  try {
    const response = await api.post('assets/details', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getViolations = async (body: any) => {
  try {
    const response = await api.post('accounts/page/violations', body);
    return response.data.TransactionsList;
  } catch (error) {
    throw error;
  }
};

