module.exports = (zuoraClient) => {
  const create = (body) => zuoraClient.http.post('/object/payment', body);

  return {
    create,
  };
};
