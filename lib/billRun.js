module.exports = (zuoraClient) => {
  const create = (body) => zuoraClient.http.post('/object/bill-run', body);

  const get = (billRunId) => zuoraClient.http.get(`/object/bill-run/${billRunId}`);

  const post = (billRunId) => zuoraClient.http.put(`/object/bill-run/${billRunId}`, { Status: 'Posted' });

  const cancel = (billRunId) => zuoraClient.http.put(`/object/bill-run/${billRunId}`, { Status: 'Canceled' });

  const deleteBillRun = (billRunId) => zuoraClient.http.deleteRequest(`/object/bill-run/${billRunId}`);

  return {
    create,
    get,
    post,
    cancel,
    deleteBillRun,
  };
};
