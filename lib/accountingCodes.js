const got = require('got');
const _ = require('lodash');

module.exports = (zuoraClient) => {
  async function getAccount(accountId) {
    const authCookie = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
    const query = {
      headers: {
        'Content-type': 'application/json',
        cookie: authCookie,
      },
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  }

  async function deleteAccount(accountId) {
    const authCookie = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
    const query = {
      headers: {
        'Content-type': 'application/json',
        cookie: authCookie,
      },
      json: true,
    };
    const res = await got.delete(url, query);
    return res.body;
  }

  async function updateAccount(accountId, updatedContent) {
    const authCookie = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
    const query = {
      headers: {
        'Content-type': 'application/json',
        cookie: authCookie,
      },
      body: updatedContent,
      json: true,
    };
    const res = await got.put(url, query);
    return res.body;
  }

  async function getAllAccountingCodes() {
    try {
      const authCookie = await zuoraClient.authenticate();
      const url = `${zuoraClient.apiVersionUrl}/accounting-codes`;
      const query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
        },
        json: true,
      };

      const res = await got
        .get(url, query);

      const accountingCodes = res.body.accountingCodes;
      if (res.body.nextPage) {
        return getAdditionalAccountingCodes(res.body.nextPage).then((additionalCodes) => _.concat(accountingCodes, additionalCodes));
      }
      return accountingCodes;
    } catch (error) {
      if (error.statusCode === 401) {
        console.log(error.response.body);
        return [];
      }
      throw error;
    }
  }

  async function getAdditionalAccountingCodes(nextPage) {
    try {
      const authCookie = await zuoraClient.authenticate();
      const query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
        },
        json: true,
      };

      const res = await got
        .get(nextPage, query);

      const accountingCodes = res.body.accountingCodes;
      if (res.body.nextPage) {
        return getAdditionalAccountingCodes(res.body.nextPage).then((additionalCodes) => _.concat(accountingCodes, additionalCodes));
      }
      return accountingCodes;
    } catch (error) {
      if (error.statusCode === 401) {
        console.log(error.response.body);
        return [];
      }
      throw error;
    }
  }

  return {
    all: () => getAllAccountingCodes(),
    get: (codeId) => getAccountingCode(codeId),
    create: (accountingCode) => createAccountingCode(accountingCode),
    update: (codeId, updatedContent) => updateAccountingCode(codeId, updatedContent),
    delete: (codeId) => deleteAccountingCode(codeId),
    activate: (codeId) => activateAccountingCode(codeId),
    deactivate: (codeId) => deactivateAccountingCode(codeId),
  };
};
