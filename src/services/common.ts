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

export const changePassword = async (body : any) => {
  try {
    const response = await api.post('users/changepassword', body);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTodaysTrips = async (body: any) => {
  try {
    const response = await api.post('accounts/page/transactions', body);
    return response.data;
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

// violation start
export const getViolations = async (body: any) => {
  try {
    const response = await api.post('accounts/page/violations', body);
    return response.data.TransactionsList;
  } catch (error) {
    throw error;
  }
};

// violatio end 

//cases start

export const getCases = async (body: any) => {
  try {
    const response = await api.post('cases/page/customer/account', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCasesStatus = async () => {
  try {
    const response = await api.get('masterTables/CaseStatus');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCaseTypes = async () => {
  try {
    const response = await api.get('masterTables/CaseTypes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCases = async (body : any) => {
  try {
    const response = await api.post('cases', body);
    return response.data;
  } catch (error) {
    throw error;
  }
}

//cases end


//statements start

export const getStatements = async (body : any) => {
  try {
    const response = await api.post('accounts/page/financialdocumentsbyyear', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// statements end

export const getOverallClasses = async () => {
  try {
    const response = await api.get('masterTables/OverallClasses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionStatus = async () => {
  try {
    const response = await api.get('masterTables/TransactionStatus');
    return response.data;
  } catch (error) {
    throw error;
  }
};





