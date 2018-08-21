module.exports = (zuoraClient) => {
  const get = (fileId) => zuoraClient.http.get(`/files/${fileId}`);

  const stream = (fileId) => zuoraClient.http.stream(`/files/${fileId}`);

  return {
    get,
    stream,
  };
};
