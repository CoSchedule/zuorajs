const got = require('got');

module.exports = (zuoraClient) => ({
  get: async paymentMethodId => {
    const headers = await zuoraClient.authenticate();

    const { body } = await got
      .get(`${zuoraClient.apiVersionUrl}/object/payment-method/${encodeURIComponent(paymentMethodId)}`, {
        headers,
        json: true,
      });

    return body;
  },

  delete: async methodId => {
    const headers = await zuoraClient.authenticate();

    const { body } = await got
      .delete(`${zuoraClient.apiVersionUrl}/payment-methods/${encodeURIComponent(methodId)}`, {
        headers,
        json: true,
      });

    return body;
  },

  update: async (methodId, body) => {
    const headers = await zuoraClient.authenticate();

    const { body } = await got
      .put(`${zuoraClient.apiVersionUrl}/payment-methods/credit-cards/${encodeURIComponent(methodId)}`, {
        headers,
        json: true,
        body,
      });

    return body;
  },

  create: async body => {
    const headers = await zuoraClient.authenticate();

    const { body } = await got.post(`${zuoraClient.apiVersionUrl}/object/payment-method`, {
      headers,
      json: true,
      body,
    });

    return body;
  },
});
