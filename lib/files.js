const got = require('got');

module.exports = (zuoraClient) => ({
  get: async (fileId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/files/${fileId}`;
    const query = {
      headers,
    };
    return got.get(url, query);
  },

  stream: async (fileId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/files/${fileId}`;
    const query = {
      headers,
    };
    return got.stream(url, query);
  },
});
