const fs = require('fs');

module.exports = (zuoraClient) => {
  const exportZOQL = (zoql, format) => {
    const body = {
      Query: zoql,
      Format: format,
    };

    return zuoraClient.http.post('/object/export', body);
  };

  const retrieve = (exportId) => zuoraClient.http.get(`/object/export/${exportId}`);

  const waitExportEnd = async (exportId) => {
    const exportResult = await retrieve(exportId);

    if (exportResult.Status === 'Completed') {
      return exportResult;
    } else if (exportResult.Status === 'Failed') {
      throw new Error('Export failed');
    } else if (exportResult.Status === 'Canceled') {
      throw new Error('Export canceled');
    }

    return waitExportEnd(exportId);
  };

  const exportAndDownload = async (query, format, path) => {
    const result = await exportZOQL(query, format);
    const exportResult = await waitExportEnd(result.Id);
    const res = await zuoraClient.files.stream(exportResult.FileId);

    return new Promise((resolve, reject) => {
      const stream = res.pipe(fs.createWriteStream(path));

      stream.on('finish', () => {
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  };

  return {
    exportZOQL,
    exportAndDownload,
    retrieve,
  };
};
