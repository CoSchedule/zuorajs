module.exports = (zuoraClient) => {
  const subscribe = (body) => zuoraClient.http.post('/action/subscribe', body);

  const query = (queryString) => zuoraClient.http.post('/action/query', { queryString });

  const queryMore = (queryLocator) => zuoraClient.http.post('/action/queryMore', { queryLocator });

  const deleteAction = (type, ids) => {
    const body = {
      type,
      ids,
    };

    return zuoraClient.http.post('/action/delete', body);
  };

  const update = (type, objects) => {
    const body = {
      type,
      objects,
    };
    return zuoraClient.http.post('/action/update', body);
  };

  const amend = (amendObject) => zuoraClient.http.post('/action/amend', { requests: [amendObject] });

  const invoiceAdjustment = (invoiceAdjustments) => zuoraClient.http.post('/action/create', { objects: invoiceAdjustments, type: 'InvoiceItemAdjustment' });

  const generate = (body) => zuoraClient.http.post('/action/generate', body);

  return {
    subscribe,
    query,
    queryMore,
    deleteAction,
    update,
    amend,
    invoiceAdjustment,
    generate,
  };
};
