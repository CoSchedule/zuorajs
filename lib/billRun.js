const got = require('got');

module.exports = (zuoraClient) => ({
  create: async (data) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run`;
    const query = {
      body: data,
      headers,
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  },

  get: async (billRunId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run/${billRunId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  },

  post: async (billRunId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run/${billRunId}`;
    const query = {
      body: { Status: 'Posted' },
      headers,
      json: true,
    };
    const res = await got.put(url, query);
    return res.body;
  },

  cancel: async (billRunId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run/${billRunId}`;
    const query = {
      body: { Status: 'Canceled' },
      headers,
      json: true,
    };
    const res = await got.put(url, query);
    return res.body;
  },

  delete: async (billRunId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run/${billRunId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.delete(url, query);
    return res.body;
  },
});
