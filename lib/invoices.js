const got = require('got');
const _ = require('lodash');

module.exports = (zuoraClient) => {
  async function getInvoice(invoiceId) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/invoice/${invoiceId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  }

  async function getInvoiceFromInvoiceNumber(invoiceNumber) {
    const queryResult = await zuoraClient
      .queryFirst(`select Id from Invoice where InvoiceNumber='${invoiceNumber}'`);

    return queryResult ? getInvoice(queryResult.Id) : null;
  }

  async function createInvoice(invoiceCreateRequest) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/invoice`;
    const query = {
      body: invoiceCreateRequest,
      headers: _.assignIn({ 'zuora-version': '215.0' }, headers),
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  }

  async function updateInvoice(invoiceId, invoiceUpdateRequest) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/invoice/${invoiceId}`;
    const query = {
      body: invoiceUpdateRequest,
      headers: _.assignIn({ 'zuora-version': '215.0' }, headers),
      json: true,
    };
    const res = await got.put(url, query);
    return res.body;
  }

  async function collectInvoice(invoiceCollectRequest) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/operations/invoice-collect`;
    const query = {
      body: invoiceCollectRequest,
      headers: _.assignIn({ 'zuora-version': '215.0' }, headers),
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  }

  async function getByAccount(accountId) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/transactions/invoices/accounts/${accountId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  }

  return {
    collect: (invoiceCollectRequest) => collectInvoice(invoiceCollectRequest),
    create: (invoiceCreateRequest) => createInvoice(invoiceCreateRequest),
    get: (invoiceId) => getInvoice(invoiceId),
    getByAccount: (accountId) => getByAccount(accountId),
    getFromInvoiceNumber: (invoiceNumber) => getInvoiceFromInvoiceNumber(invoiceNumber),
    update: (invoiceId, invoiceUpdateRequest) => updateInvoice(invoiceId, invoiceUpdateRequest),
  };
};
