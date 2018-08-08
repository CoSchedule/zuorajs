const got = require('got');

module.exports = (zuoraClient) => ({
  subscribe: async (subscribeData) => {
    try {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.apiVersionUrl}/action/subscribe`;
      const query = {
        body: subscribeData,
        headers,
        json: true,
      };
      const res = await got.post(url, query);
      return res.body;
    } catch (error) {
      if (error.statusCode === 401) {
        return this(error.response.body);
      }
      throw error;
    }
  },

  query: async (queryString) => {
    try {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.apiVersionUrl}/action/query`;
      const data = {
        queryString,
      };
      const query = {
        body: data,
        headers,
        json: true,
      };
      const res = await got.post(url, query);
      return res.body;
    } catch (error) {
      if (error.statusCode === 401) {
        return this(queryString);
      }
      throw error;
    }
  },

  queryMore: async (queryLocator) => {
    try {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.apiVersionUrl}/action/queryMore`;
      const query = {
        body: {
          queryLocator,
        },
        headers,
        json: true,
      };
      const res = await got.post(url, query);
      return res.body;
    } catch (error) {
      if (error.statusCode === 401) {
        return this(queryLocator);
      }
      throw error;
    }
  },

  delete: async (type, ids) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/action/delete`;
    const query = {
      body: {
        type,
        ids,
      },
      headers,
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  },

  update: async (type, objects) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/action/update`;
    const query = {
      body: {
        type,
        objects,
      },
      headers,
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  },

  amend: async (amendObject) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/action/amend`;
    const query = {
      body: {
        requests: [amendObject],
      },
      headers,
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  },
});
