const got = require('got');

module.exports = (zuoraClient) => ({
  create: async (contactDetails) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/contact`;
    const query = {
      body: contactDetails,
      headers,
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  },

  get: async (contactId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/contact/${contactId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  },

  update: async (contactId, contactDetails) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/contact/${contactId}`;
    const query = {
      body: contactDetails,
      headers,
      json: true,
    };
    const res = await got.put(url, query);
    return res.body;
  },

  delete: async (contactId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/contact/${contactId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.delete(url, query);
    return res.body;
  },
});
