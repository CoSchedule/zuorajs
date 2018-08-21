const request = require('request-promise');
const requestBase = require('request');

module.exports = (zuoraClient) => {
  const baseUrl = `${zuoraClient.config.apiUrl}/${zuoraClient.config.apiVersion}/`;

  const doRequest = async (method, url, body) => {
    const accessToken = await zuoraClient.auth.getAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'zuora-version': '215.0',
    };

    const options = {
      method,
      baseUrl,
      url,
      headers,
      body,
      json: true,
    };

    const response = await request(options);

    if (response.success === false) {
      const allErrorStrings = response.reasons.map((reason) => `Code: ${reason.code}: ${reason.message}`).join('\n');

      throw new Error(`${allErrorStrings}\nRequest options: ${JSON.stringify(options, null, 2)}`);
    }

    return response;
  };

  const deleteRequest = (url) => doRequest('DELETE', url);

  const get = (url) => doRequest('GET', url);

  const post = (url, body) => doRequest('POST', url, body);

  const put = (url, body) => doRequest('PUT', url, body);

  const stream = async (url) => {
    const accessToken = await zuoraClient.auth.getAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'zuora-version': '215.0',
    };

    const options = {
      baseUrl,
      url,
      headers,
    };

    return requestBase(options);
  };

  return {
    deleteRequest,
    get,
    post,
    put,
    stream,
  };
};
