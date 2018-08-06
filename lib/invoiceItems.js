const got = require('got');

module.exports = (zuoraClient) => {
  async function getInvoiceItem(invoiceItemId) {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.apiVersionUrl}/object/invoice-item/${invoiceItemId}`;
    const query = {
      headers,
      json: true,
    };
    const res = await got.get(url, query);
    return res.body;
  }

  async function getInvoiceItemsFromInvoice(invoiceId) {
    const queryResult = await zuoraClient
      .queryFull(`select AccountingCode,AppliedToInvoiceItemId,ChargeAmount,ChargeDate,ChargeName,ChargeDescription,Id,InvoiceId,ProcessingType,ProductDescription,ProductName,Quantity,RatePlanChargeId,RevRecStartDate,SKU,ServiceEndDate,ServiceStartDate,SubscriptionId,TaxAmount,TaxCode,TaxExemptAmount,TaxMode,UOM,UnitPrice from InvoiceItem where InvoiceId='${
        invoiceId
      }'`);

    return queryResult;
  }

  return {
    get: (invoiceItemId) => getInvoiceItem(invoiceItemId),
    fromInvoice: (invoiceId) => getInvoiceItemsFromInvoice(invoiceId),
  };
};
