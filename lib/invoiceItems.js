module.exports = (zuoraClient) => {
  const get = (invoiceItemId) => zuoraClient.http.get(`/object/invoice-item/${invoiceItemId}`);

  return {
    get,
  };
};
