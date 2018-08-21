module.exports = (zuoraClient) => {
  const get = (ratePlanChargeId) => zuoraClient.http.get(`/object/rate-plan-charge/${ratePlanChargeId}`);

  return {
    get,
  };
};
