module.exports = (zuoraClient) => {
  const create = (body) => zuoraClient.http.post('/object/payment', body);
  const get = (paymentId) => zuoraClient.http.get(`object/payment/${paymentId}`);

  const getPayments = (accountKey) => zuoraClient.http.get(`/transactions/payments/accounts/${accountKey}`);

  return {
    getPayments,
    get,
    create,
  };
};
