module.exports = (zuoraClient) => {
  const generateDocument = (body) => zuoraClient.http.post('/quotes/document', body);

  return {
    generateDocument,
  };
};
