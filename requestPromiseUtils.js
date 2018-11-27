const requestPromise = require('request-promise');
const requestPromiseErrors = require('request-promise/errors');

const requestWithRetries = async (requestOptions, shouldRetry, computeRetryDelay) => {
  const makeRequest = async (tryCount) => {
    let response;
    try {
      response = await requestPromise(requestOptions);
    } catch (err) {
      if (!shouldRetry || !shouldRetry(err, tryCount)) {
        throw err;
      }

      const nextTryCount = tryCount + 1;
      const retryDelay = await ((computeRetryDelay && computeRetryDelay(err, nextTryCount)) || 1000);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));

      response = makeRequest(nextTryCount);
    }

    return response;
  };

  return makeRequest(1);
};

const isRequestError = (err) => (err instanceof requestPromiseErrors.RequestError);
const isStatusCodeError = (err) => (err instanceof requestPromiseErrors.StatusCodeError);

module.exports = {
  requestWithRetries,
  isRequestError,
  isStatusCodeError,
};
