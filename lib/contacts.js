module.exports = (zuoraClient) => {
  const create = (body) => zuoraClient.http.post('/object/contact', body);

  const get = (contactId) => zuoraClient.http.get(`/object/contact/${contactId}`);

  const update = (contactId, body) => zuoraClient.http.put(`/object/contact/${contactId}`, body);

  const deleteContact = (contactId) => zuoraClient.http.deleteRequest(`/object/contact/${contactId}`);

  return {
    create,
    get,
    update,
    deleteContact,
  };
};
