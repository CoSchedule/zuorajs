const BPromise = require('bluebird');
const got = require('got');
const fs = require('fs');

module.exports = (zuoraClient) => {
  async function exportZOQL(zoql, format) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/export`;
    const data = {
      Query: zoql,
      Format: format,
    };
    const query = {
      headers,
      body: data,
      json: true,
    };
    const res = await got.post(url, query);
    return res.body;
  }

  async function retrieveExport(exportId) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/export/${exportId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  }

  /**
   * Wait for a given export to be Completed/Failed/Canceled before returning the promise
   */
  var waitExportEnd = async function (exportId) {
    const exportResult = await BPromise.delay(1000)
      .then(() => retrieveExport(exportId));

    if (exportResult.Status === 'Completed') {
      return exportResult;
    } else if (exportResult.Status === 'Failed') {
      throw new Error('Export failed');
    } else if (exportResult.Status === 'Canceled') {
      throw new Error('Export canceled');
    }
    return waitExportEnd(exportId);
  };

  return {
    export: (query, format) => exportZOQL(query, format),
    exportAndDownload: async (query, format, path) => {
      const res = await exportZOQL(query, format)
        .then((result) => waitExportEnd(result.Id))
        .then((exportResult) => zuoraClient.files.stream(exportResult.FileId));

      return new BPromise((resolve, reject) => {
        const stream = res.pipe(fs.createWriteStream(path));
        stream.on('finish', () => {
          resolve();
        });
        stream.on('error', (err) => {
          reject(err);
        });
      });
    },
    retrieve: (id) => retrieveExport(id),
  };
};
