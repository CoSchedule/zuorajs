module.exports = (zuoraClient) => {
  const get = (invoiceId) => zuoraClient.http.get(`/object/invoice/${invoiceId}`);

  const create = (body) => zuoraClient.http.post('/object/invoice', body);

  const update = (invoiceId, body) => zuoraClient.http.put(`/object/invoice/${invoiceId}`, body);

  const collect = (body) => zuoraClient.http.post('/operations/invoice-collect', body);

  const getByAccount = (accountId) => zuoraClient.http.get(`/transactions/invoices/accounts/${accountId}`);

  const getFiles = (invoiceId) => zuoraClient.http.get(`/invoices/${invoiceId}/files`);

  return {
    collect,
    create,
    get,
    getByAccount,
    getFiles,
    update,
  };
};
