const got = require('got');

module.exports = (zuoraClient) => ({
  get: async (paymentMethodId) => {
    const headers = await zuoraClient.authenticate();

    const response = await got
      .get(`${zuoraClient.apiVersionUrl}/object/payment-method/${encodeURIComponent(paymentMethodId)}`, {
        headers,
        json: true,
      });

    return response.body;
  },

  delete: async (methodId) => {
    const headers = await zuoraClient.authenticate();

    const response = await got
      .delete(`${zuoraClient.apiVersionUrl}/payment-methods/${encodeURIComponent(methodId)}`, {
        headers,
        json: true,
      });

    return response.body;
  },

  update: async (methodId, body) => {
    const headers = await zuoraClient.authenticate();

    const response = await got
      .put(`${zuoraClient.apiVersionUrl}/payment-methods/credit-cards/${encodeURIComponent(methodId)}`, {
        headers,
        json: true,
        body,
      });

    return response.body;
  },

  create: async (body) => {
    const headers = await zuoraClient.authenticate();

    const response = await got.post(`${zuoraClient.apiVersionUrl}/object/payment-method`, {
      headers,
      json: true,
      body,
    });

    return response.body;
  },
});
