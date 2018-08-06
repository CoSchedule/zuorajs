const got = require('got');

module.exports = (zuoraClient) => ({
  /**
   * Generate a Zuora Quote Document
   * Zuora API Ref: https://www.zuora.com/developer/api-reference/#tag/Quotes-Document
   *
   * @param  {Object} options    Containing the request body parameters
   * @return {Promise<Object>}   Containing the file url and success boolean
   */
  generateDocument: async (options) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/quotes/document`;
    const query = {
      headers,
      body: options,
      json: true,
    };

    const res = await got.post(url, query);
    return res.body;
  },
});
