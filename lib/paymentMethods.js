const got = require('got');

module.exports = (zuoraClient) => ({
  get: (paymentMethodId) => zuoraClient.authenticate().then((headers) => got
    .get(`${zuoraClient.apiVersionUrl}/object/payment-method/${encodeURIComponent(paymentMethodId)}`, {
      headers,
      json: true,
    })
    .then(({ body }) => body)),

  delete: (methodId) => zuoraClient.authenticate().then((headers) => got
    .delete(`${zuoraClient.apiVersionUrl}/payment-methods/${encodeURIComponent(methodId)}`, {
      headers,
      json: true,
    })
    .then(({ body }) => body)),

  update: (methodId, body) => zuoraClient.authenticate().then((headers) => got
    .put(`${zuoraClient.apiVersionUrl}/payment-methods/credit-cards/${encodeURIComponent(methodId)}`, {
      headers,
      json: true,
      body,
    })
    .then(({ body }) => body)),

  create: (body) => zuoraClient.authenticate().then((headers) => got.post(`${zuoraClient.apiVersionUrl}/object/payment-method`, {
    headers,
    json: true,
    body,
  }).then(({ body }) => body)),
});
