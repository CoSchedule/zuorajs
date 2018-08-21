module.exports = (zuoraClient) => {
  const get = (accountId) => zuoraClient.http.get(`/accounts/${accountId}`);

  const deleteAccount = (accountId) => zuoraClient.http.deleteRequest(`/object/account/${accountId}`);

  const updateCRUD = (accountId, body) => zuoraClient.http.put(`/object/account/${accountId}`, body);

  const update = (accountId, body) => zuoraClient.http.put(`/accounts/${accountId}`, body);

  const create = (body) => zuoraClient.http.post('/accounts', body);

  const getAccountCRUD = (accountId) => zuoraClient.http.get(`/object/account/${accountId}`);

  const getFromAccountNumber = async (accountNumber) => {
    const queryResult = await zuoraClient.action.query(`select Id from Account where AccountNumber='${accountNumber}'`);

    if (queryResult && queryResult.records[0]) {
      const accountId = queryResult.records[0].Id;
      return getAccountCRUD(accountId);
    }
    return null;
  };

  const applyCredit = (body) => zuoraClient.http.post('/object/credit-balance-adjustment', body);

  return {
    applyCredit,
    create,
    deleteAccount,
    get,
    getFromAccountNumber,
    update,
    updateCRUD,
  };
};
