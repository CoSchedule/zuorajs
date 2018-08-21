const request = require('request-promise');

module.exports = (zuoraClient) => {
  let accessToken;
  let renewalTime;

  const uri = `${zuoraClient.config.apiUrl}/oauth/token`;

  const getAccessToken = async () => {
    if (accessToken && Date.now() <= renewalTime) {
      return accessToken;
    }

    const options = {
      method: 'POST',
      uri,
      form: {
        client_id: zuoraClient.config.clientId,
        client_secret: zuoraClient.config.clientSecret,
        grant_type: 'client_credentials',
      },
      json: true,
    };

    const response = await request(options);

    accessToken = response.access_token;
    renewalTime = Date.now() + ((response.expires_in * 1000) - 60000);

    return accessToken;
  };

  return {
    getAccessToken,
  };
};
