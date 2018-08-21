module.exports = (zuoraClient) => {
  const get = (productRatePlanChargeId) => zuoraClient.http.get(`/object/product-rate-plan-charge/${productRatePlanChargeId}`);

  return {
    get,
  };
};
