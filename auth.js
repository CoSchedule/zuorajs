const { requestWithRetries, isRequestError, isStatusCodeError } = require('./requestPromiseUtils');

const retryHandler = (err, nextTryCount) => {
  if (nextTryCount > 5) {
    return false;
  }

  return isRequestError(err) || (isStatusCodeError(err) && (err.statusCode === 403));
};

const computeRetryDelay = (err, nextTryCount) => (Math.round(Math.random() * 100) + (nextTryCount * 750));

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

    const response = await requestWithRetries(options, retryHandler, computeRetryDelay);
    if (!response) {
      throw new Error('ZuoraJS: Auth: Empty Response');
    }

    accessToken = response.access_token;
    renewalTime = Date.now() + ((response.expires_in * 1000) - 60000);

    return accessToken;
  };

  return {
    getAccessToken,
  };
};
