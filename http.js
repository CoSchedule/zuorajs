const request = require('request-promise');
const requestBase = require('request');

class ZuoraClientError extends Error {
  constructor(message, requestOptions) {
    super(message);
    this.requestOptions = requestOptions;
  }
}

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
      const allErrorStrings = response.reasons.map((reason) => `Code: ${reason.code}: ${reason.message}`).join(' - ');

      throw new ZuoraClientError(allErrorStrings, options);
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
