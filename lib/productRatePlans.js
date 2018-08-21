module.exports = (zuoraClient) => {
  const get = (productRatePlanId) => zuoraClient.http.get(`/object/product-rate-plan/${productRatePlanId}`);

  return {
    get,
  };
};
