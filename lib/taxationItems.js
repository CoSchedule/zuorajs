const got = require('got');

module.exports = (zuoraClient) => {
  async function getTaxationItem(taxationItemId) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/taxation-item/${taxationItemId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  }

  function getTaxationItemsForInvoiceItem(invoiceItemId) {
    return zuoraClient.queryFull(`select AccountingCode,ExemptAmount,Id,InvoiceId,InvoiceItemId,Jurisdiction,LocationCode,Name,TaxAmount,TaxCode,TaxCodeDescription,TaxDate,TaxRate,TaxRateDescription,TaxRateType from TaxationItem where InvoiceItemId='${
      invoiceItemId
    }'`);
  }

  function getTaxationItemsFromInvoice(invoiceId) {
    return zuoraClient.queryFull(`select AccountingCode,ExemptAmount,Id,InvoiceId,InvoiceItemId,Jurisdiction,LocationCode,Name,TaxAmount,TaxCode,TaxCodeDescription,TaxDate,TaxRate,TaxRateDescription,TaxRateType from TaxationItem where InvoiceId='${
      invoiceId
    }'`);
  }

  return {
    get: (taxationItemId) => getTaxationItem(taxationItemId),
    forInvoiceItem: (invoiceItemId) => getTaxationItemsForInvoiceItem(invoiceItemId),
    fromInvoice: (invoiceId) => getTaxationItemsFromInvoice(invoiceId),
  };
};
