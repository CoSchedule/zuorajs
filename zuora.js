const auth = require('./auth');
const http = require('./http');

const accounts = require('./lib/accounts');
const action = require('./lib/action');
const billRun = require('./lib/billRun');
const catalog = require('./lib/catalog');
const contacts = require('./lib/contacts');
const zuoraExports = require('./lib/zuoraExports');
const files = require('./lib/files');
const invoiceItems = require('./lib/invoiceItems');
const invoices = require('./lib/invoices');
const paymentMethods = require('./lib/paymentMethods');
const payments = require('./lib/payments');
const productRatePlanCharges = require('./lib/productRatePlanCharges');
const productRatePlans = require('./lib/productRatePlans');
const quotes = require('./lib/quotes');
const ratePlanCharges = require('./lib/ratePlanCharges');
const subscriptions = require('./lib/subscriptions');

class Zuora {
  constructor(config) {
    this.config = config;

    this.auth = auth(this);
    this.http = http(this);

    this.accounts = accounts(this);
    this.action = action(this);
    this.billRun = billRun(this);
    this.catalog = catalog(this);
    this.contacts = contacts(this);
    this.zuoraExports = zuoraExports(this);
    this.files = files(this);
    this.invoiceItems = invoiceItems(this);
    this.invoices = invoices(this);
    this.paymentMethods = paymentMethods(this);
    this.payments = payments(this);
    this.productRatePlanCharges = productRatePlanCharges(this);
    this.productRatePlans = productRatePlans(this);
    this.quotes = quotes(this);
    this.ratePlanCharges = ratePlanCharges(this);
    this.subscriptions = subscriptions(this);
  }
}

module.exports = Zuora;
