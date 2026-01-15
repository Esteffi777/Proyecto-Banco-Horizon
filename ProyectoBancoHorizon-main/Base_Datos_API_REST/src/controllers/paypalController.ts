import { Request, Response } from 'express';
import paypal from '@paypal/checkout-server-sdk';

// Configurar el entorno sandbox con tus credenciales de PayPal
const clientId = process.env.PAYPAL_CLIENT_ID || 'AQ63qp_KG8OCBGKPeB8f8EGfGBsiDJdBkjvkNrhiffzKKh_Rmrl4Yj2rk_N1gBqIQClJdzSg6vHj8DiL';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'ELxwT-IyyUwBoyYEhoebmjKYHsgLq4LkK4MDF9lZBLWt1o5T3lsxOGKPFJ6qCmGGgB_QpuB23eWYtB8q';

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export const createOrder = async (req: Request, res: Response) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '10.00' // Monto fijo para el ejemplo, puedes cambiarlo según tu necesidad
        }
      }],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            payment_method_selected: "PAYPAL",
            brand_name: "YOUR_BRAND",
            locale: "en-US",
            landing_page: "LOGIN",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: "https://www.example.com/return",
            cancel_url: "https://www.example.com/cancel"
          }
        }
      }
    } as any); // Forzar la compatibilidad de tipos
  
    try {
      const order = await client.execute(request);
      res.json(order.result);
    } catch (err) {
      res.status(500).send(err);
    }
};
  

export const captureOrder = async (req: Request, res: Response) => {
    const orderID = req.body.orderID;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
  
    // Definir el objeto RequestData con payment_source
    const requestData: paypal.orders.OrdersCapture.RequestData = {
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            payment_method_selected: "PAYPAL",
            brand_name: "YOUR_BRAND",
            locale: "en-US",
            landing_page: "LOGIN",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: "https://www.example.com/return",
            cancel_url: "https://www.example.com/cancel"
          }
        }
      }
    };
  
    // Pasar requestData al requestBody
    request.requestBody(requestData);
  
    try {
      const capture = await client.execute(request);
      res.json(capture.result);
    } catch (err) {
      res.status(500).send(err);
    }
  };
  
