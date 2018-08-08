const got = require('got');
const _ = require('lodash');

const accountsLib = require('./lib/accounts.js');
const actionLib = require('./lib/action.js');
const attachmentsLib = require('./lib/attachments.js');
const billRunLib = require('./lib/billRun.js');
const catalogLib = require('./lib/catalog');
const contactsLib = require('./lib/contacts.js');
const exportsLib = require('./lib/exports.js');
const filesLib = require('./lib/files.js');
const invoicesLib = require('./lib/invoices.js');
const invoiceItemsLib = require('./lib/invoiceItems.js');
const productRatePlansLib = require('./lib/productRatePlans.js');
const productRatePlanChargesLib = require('./lib/productRatePlanCharges.js');
const ratePlanChargesLib = require('./lib/ratePlanCharges.js');
const subscriptionsLib = require('./lib/subscriptions.js');
const taxationItemsLib = require('./lib/taxationItems.js');
const paymentMethodsLib = require('./lib/paymentMethods');
const rsaSignaturesLib = require('./lib/rsaSignatures');
const paymentsLib = require('./lib/payments');
const quotesLib = require('./lib/quotes');

/**
 * @typedef {object} ZuoraClientConfig
 * @property {string} apiVersion
 * @property {string} url
 * @property {string} [oauthTokenPath]
 * @property {string} [oauthType]
 * @property {string} [apiAccessKeyId]
 * @property {string} [apiSecretAccessKey]
 * @property {string} [clientId]
 * @property {string} [clientSecret]
 * @property {object} [catalogCache]
 * @property {string} [client_id] - @deprecated use `clientId` instead
 * @property {string} [client_secret] - @deprecated use `clientSecret` instead
 */

/**
 * @param {ZuoraClientConfig} config
 * @constructor
 */
function Zuora(config) {
  this.apiVersion = (config.apiVersion || '/v1');
  this.apiVersionUrl = `${config.url}${this.apiVersion}`;

  this.oauthTokenPath = (config.oauthTokenPath || '/oauth/token');
  this.oauthType = config.oauthType || 'cookie';

  this.apiAccessKeyId = config.apiAccessKeyId;
  this.apiSecretAccessKey = config.apiSecretAccessKey;
  this.clientId = config.clientId || config.client_id;
  this.clientSecret = config.clientSecret || config.client_secret;
  // this.entityId = config.entityId;
  // this.entityName = config.entityName;

  this.accounts = accountsLib(this);
  this.action = actionLib(this);
  this.attachments = attachmentsLib(this);
  this.billRun = billRunLib(this);
  this.catalog = catalogLib(this, config.catalogCache);
  this.contacts = contactsLib(this);
  this.exports = exportsLib(this);
  this.files = filesLib(this);
  this.invoices = invoicesLib(this);
  this.invoiceItems = invoiceItemsLib(this);
  this.productRatePlans = productRatePlansLib(this);
  this.productRatePlanCharges = productRatePlanChargesLib(this);
  this.ratePlanCharges = ratePlanChargesLib(this);
  this.subscriptions = subscriptionsLib(this);
  this.taxationItems = taxationItemsLib(this);
  this.paymentMethods = paymentMethodsLib(this);
  this.rsaSignatures = rsaSignaturesLib(this);
  this.payments = paymentsLib(this);
  this.quotes = quotesLib(this);
}

module.exports = Zuora;

function normalizePath(version, path) {
  if (path.startsWith(version)) {
    return path.replace(version, '');
  }

  return path;
}

Zuora.prototype.getApiUrlWithPath = function getApiUrlWithPath(path) {
  const normalizedPath = normalizePath(this.apiVersion, path);

  return `${this.apiVersionUrl}${normalizedPath}`;
};

Zuora.prototype.authenticate = function authenticate() {
  const oauthV2 = () => {
    if (this.access_token === undefined || Date.now() > this.renewal_time) {
      const url = this.apiVersionUrl.replace(this.apiVersion, this.oauthTokenPath);

      const authParams = {
        form: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        },
      };

      return got.post(url, authParams).then((res) => {
        const responseBody = JSON.parse(res.body);

        this.access_token = responseBody.access_token;
        this.renewal_time = Date.now() + ((responseBody.expires_in * 1000) - 60000);
        return { Authorization: `Bearer ${this.access_token}` };
      });
    }
    return Promise.resolve({ Authorization: `Bearer ${this.access_token}` });
  };

  const oauthCookie = () => {
    if (this.authCookie === undefined) {
      const url = `${this.apiVersionUrl}/connections`;
      const query = {
        headers: {
          'user-agent': 'zuorajs',
          apiAccessKeyId: this.apiAccessKeyId,
          apiSecretAccessKey: this.apiSecretAccessKey,
        },
        json: true,
      };
      return got.post(url, query).then((res) => {
        const [cookieValue] = res.headers['set-cookie'];
        this.authCookie = cookieValue;
        return { cookie: this.authCookie };
      });
    }
    return Promise.resolve({ cookie: this.authCookie });
  };

  if (this.oauthType === 'oauth_v2') {
    return oauthV2();
  }
  return oauthCookie();
};

Zuora.prototype.getObject = async function getObject(path) {
  const headers = await this.authenticate();
  const url = this.getApiUrlWithPath(path);
  const query = {
    headers,
    json: true,
  };
  const res = await got.get(url, query);
  return res.body;
};

Zuora.prototype.queryFirst = async function queryFirst(queryString) {
  const queryResult = await this.action.query(queryString);
  return queryResult.size > 0 ? queryResult.records[0] : null;
};

Zuora.prototype.queryFull = async function queryFull(queryString) {
  const fullQueryMore = async (queryLocator) => {
    const result = await this.action.queryMore(queryLocator);

    return result.done ? result.records : fullQueryMore(result.queryLocator).then((more) => _.concat(result.records, more));
  };

  const result = await this.action.query(queryString);

  return result.done ? result.records : fullQueryMore(result.queryLocator).then((more) => _.concat(result.records, more));
};
