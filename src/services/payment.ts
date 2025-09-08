import axios from 'axios';
import { PAYMENT_API, MERCHANT_ID } from '../utils/environment';

const apiUrl = PAYMENT_API;
const merchantId = MERCHANT_ID;

export const createSession = async (amount: string, orderId: string) => {
  try {
    const url = `${apiUrl}api/rest/version/100/merchant/${merchantId}/session`;

    const payload = {
      apiOperation: 'INITIATE_CHECKOUT',
      checkoutMode: 'WEBSITE',
      interaction: {
        operation: 'PURCHASE',
        merchant: {
          name: 'PSD Training App',
          url: 'https://www.your.site.url.com',
        },
        returnUrl: 'http://localhost/payment-confirmation', // Replace with your mobile deeplink or hosted URL
      },
      order: {
        currency: 'AED',
        amount: amount,
        id: orderId,
        description: 'Goods and Services',
      },
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic bWVyY2hhbnQuVEVTVFJBS1BVQkxJQ1RTVDo0MTdhNDVhNjMzOTEwZWFiZjMyNjExMmNkN2JiNmQ4Nw==`,
      },
    };

    const response = await axios.post(url, payload, config);

    console.log('Session Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Session Creation Error:', error?.response?.data || error.message);
    throw error;
  }
};
