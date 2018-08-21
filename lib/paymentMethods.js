module.exports = (zuoraClient) => {
  const get = (paymentMethodId) => zuoraClient.http.get(`/object/payment-method/${encodeURIComponent(paymentMethodId)}`);

  const deletePayment = (paymentMethodId) => zuoraClient.http.deleteRequest(`/payment-methods/${encodeURIComponent(paymentMethodId)}`);

  const update = (paymentMethodId, body) => zuoraClient.http.put(`/payment-methods/credit-cards/${encodeURIComponent(paymentMethodId)}`, body);

  const create = (body) => zuoraClient.http.post('/object/payment-method', body);

  return {
    get,
    deletePayment,
    update,
    create,
  };
};
