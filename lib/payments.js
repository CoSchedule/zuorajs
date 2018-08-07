const got = require('got');
const _ = require('lodash');

module.exports = (zuoraClient) => ({
  create: async (newPaymentParams) => {
    const headers = await zuoraClient.authenticate();

    const response = await got
      .post(`${zuoraClient.apiVersionUrl}/object/payment`, {
        body: newPaymentParams,
        headers,
        json: true,
      });

    return response.body;
  },
});
