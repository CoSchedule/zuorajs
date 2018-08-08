const got = require('got');
const _ = require('lodash');
const fs = require('fs');
const FormData = require('form-data');

module.exports = (zuoraClient) => {
  async function addAttachment(associatedObjectType, associatedObjectKey, description, file) {
    const headers = await zuoraClient.authenticate();
    const form = new FormData();
    form.append('file', fs.createReadStream(file));

    const url = `${zuoraClient.apiVersionUrl}/attachments/`;
    const query = {
      headers,
      query: {
        associatedObjectType,
        associatedObjectKey,
        description,
      },
      body: form,
    };
    const res = await got.post(url, query);
    return res.body;
  }

  async function listAttachments(associatedObjectType, associatedObjectKey) {
    try {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.apiVersionUrl}/attachments/${associatedObjectType}/${associatedObjectKey}`;
      const query = {
        headers,
        json: true,
      };

      const res = await got.get(url, query);

      if (!res.body.success) {
        return res.body;
      }

      const attachments = res.body.attachments;

      if (!attachments.nextPage) {
        return res.body;
      }

      return listAdditionalAttachments(res.body.nextPage).then((additionalAttachments) => _.assignIn({}, res.body, {
        attachments: _.concat(attachments, additionalAttachments),
      }));
    } catch (error) {
      if (error.statusCode === 401) {
        console.log(error.response.body);
        return this(queryString);
      }
      throw error;
    }
  }

  async function listAdditionalAttachments(nextPage) {
    try {
      const headers = await zuoraClient.authenticate();
      const query = {
        headers,
        json: true,
      };

      const res = await got
        .get(nextPage, query);

      const attachments = res.body.attachments;
      if (res.body.nextPage) {
        return listAdditionalAttachments(res.body.nextPage).then((additionalAttachments) => _.concat(attachments, additionalAttachments));
      }
      return attachments;
    } catch (error) {
      if (error.statusCode === 401) {
        console.log(error.response.body);
        return this(queryString);
      }
      throw error;
    }
  }

  return {
    add: (associatedObjectType, associatedObjectKey, description, file) => addAttachment(associatedObjectType, associatedObjectKey, description, file),
    find: async (associatedObjectType, associatedObjectKey, description) => {
      const results = await listAttachments(associatedObjectType, associatedObjectKey);

      return _.filter(results, {
        description,
      });
    },
    delete: async (attachmentId) => {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.apiVersionUrl}/attachments/${attachmentId}`;
      const query = {
        headers,
      };
      const res = await got.delete(url, query);
      return res.body;
    },
    list: (associatedObjectType, associatedObjectKey) => listAttachments(associatedObjectType, associatedObjectKey),
  };
};
