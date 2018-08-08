const got = require('got');

module.exports = (zuoraClient) => {
  async function getAccount(accountId) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/accounts/${accountId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  }

  async function deleteAccount(accountId) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.delete(url, query);
    return res.body;
  }

  async function updateAccount(accountId, updatedContent) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
    const query = {
      headers,
      body: updatedContent,
      json: true,
    };
    const res = await got.put(url, query);
    return res.body;
  }

  async function updateRESTAccount(accountId, updatedContent) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/accounts/${accountId}`;
    const query = {
      headers,
      body: updatedContent,
      json: true,
    };
    const res = await got.put(url, query);
    return res.body;
  }

  async function createAccount(accountCreateRequest) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/accounts`;
    const query = {
      headers,
      body: accountCreateRequest,
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  }

  async function getAccountCRUD(accountId) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  }

  async function getAccountFromAccountNumber(accountNumber) {
    const queryResult = await zuoraClient.action
      .query(`select Id from Account where AccountNumber='${accountNumber}'`);

    if (queryResult && queryResult.records[0]) {
      const accountId = queryResult.records[0].Id;
      return getAccountCRUD(accountId);
    }
    return null;
  }

  function applyCredit(creditObject) {
    const creditBalanceAdjustment = Object.assign({}, creditObject, { Type: 'Increase' });
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/object/credit-balance-adjustment`;
      const query = {
        headers,
        body: creditBalanceAdjustment,
        json: true,
      };
      return got.post(url, query).then((res) => res.body);
    });
  }

  return {
    getFromAccountNumber: (accountNumber) => getAccountFromAccountNumber(accountNumber),
    get: (accountId) => getAccount(accountId),
    update: (accountId, updatedContent) => updateAccount(accountId, updatedContent),
    updateRest: (accountId, updatedContent) => updateRESTAccount(accountId, updatedContent),
    create: (accountCreateRequest) => createAccount(accountCreateRequest),
    delete: (accountId) => deleteAccount(accountId),
  };
};
