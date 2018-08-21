const _ = require('lodash');

module.exports = (zuoraClient) => {
  const get = (subscriptionNumberOrId) => zuoraClient.http.get(`/subscriptions/${subscriptionNumberOrId}`);

  const forAccount = (accountId) => zuoraClient.http.get(`/subscriptions/accounts/${accountId}`);

  const create = (body) => {
    if (body && body.runBilling) {
      body.applyCreditBalance = true;
    }

    return zuoraClient.http.post('/subscriptions', body);
  };

  const activate = (id, date) => {
    const body = {
      ContractEffectiveDate: date,
      ContractAcceptanceDate: date,
      ServiceActivationDate: date,
    };

    return zuoraClient.http.put(`/object/subscription/${id}`, body);
  };

  const update = (subscriptionNumberOrId, body) => {
    if (body && body.runBilling) {
      body.applyCreditBalance = true;
    }

    return zuoraClient.http.put(`/subscriptions/${subscriptionNumberOrId}`, body);
  };

  const cancel = (subscriptionNumberOrId, body) => zuoraClient.http.put(`/subscriptions/${subscriptionNumberOrId}/cancel`, body);

  const clone = async (subscriptionNumberOrId, override) => {
    const subscription = await get(subscriptionNumberOrId);
    let subscribeRequest = _.pick(_.omitBy(subscription, _.isNil), [
      'CpqBundleJsonId__QT',
      'OpportunityCloseDate__QT',
      'OpportunityName__QT',
      'QuoteBusinessType__QT',
      'QuoteNumber__QT',
      'QuoteType__QT',
      'autoRenew',
      'contractEffectiveDate',
      'customerAcceptanceDate',
      'serviceActivationDate',
      'initialTerm',
      'initialTermPeriodType',
      'invoiceSeparately',
      'notes',
      'renewalSetting',
      'renewalTermPeriodType',
      'termStartDate',
      'termType',
    ]);
    subscribeRequest.accountKey = subscription.accountId;
    subscribeRequest.invoiceOwnerAccountKey = subscription.accouninvoiceOwnerAccountIdtId;
    subscribeRequest.invoice = false;

    // Copy custom fields
    _.mapKeys(subscription, (value, key) => {
      if (_.endsWith(key, '__c')) {
        subscribeRequest[key] = value;
      }
      return null;
    });

    // Copy rate plan
    subscribeRequest.subscribeToRatePlans = [];
    subscription.ratePlans.forEach((ratePlan) => {
      const ratePlanCopy = {
        productRatePlanId: ratePlan.productRatePlanId,
      };

      // Copy custom fields
      _.mapKeys(ratePlan, (value, key) => {
        if (_.endsWith(key, '__c')) {
          ratePlanCopy[key] = value;
        }
        return null;
      });

      // Copy charges
      ratePlanCopy.chargeOverrides = [];
      ratePlan.ratePlanCharges.forEach((charge) => {
        let chargeCopy = _.pick(_.omitBy(charge, _.isNil), [
          'applyDiscountTo',
          'billCycleDay',
          'billCycleType',
          'billingPeriod',
          'billingPeriodAlignment',
          'billingTiming',
          'description',
          'discountAmount',
          'discountLevel',
          'discountPercentage',
          'endDateCondition',
          'includedUnits',
          'listPriceBase',
          'numberOfPeriods',
          'overagePrice',
          'overageUnusedUnitsCreditOption',
          'price',
          'priceChangeOption',
          'priceIncreasePercentage',
          'productRatePlanChargeId',
          'quantity',
          'ratingGroup',
          'specificBillingPeriod',
          'specificEndDate',
          'triggerDate',
          'unusedUnitsCreditRates',
          'upToPeriods',
          'upToPeriodsType',
          'weeklyBillCycleDay',
        ]);

        // Copy custom fields
        _.mapKeys(charge, (value, key) => {
          if (_.endsWith(key, '__c')) {
            chargeCopy[key] = value;
          }
          if (key === 'triggerEvent') {
            if (value === 'ContractEffective') {
              chargeCopy[key] = 'UCE';
            }
            if (value === 'ServiceActivation') {
              chargeCopy[key] = 'USA';
            }
            if (value === 'CustomerAcceptance') {
              chargeCopy[key] = 'UCA';
            }
            if (value === 'ServiceDelivery') {
              chargeCopy[key] = 'USD';
            }
          }
          return null;
        });

        if (charge.model === 'FlatFee' || charge.type === 'Usage') {
          chargeCopy = _.omit(chargeCopy, ['quantity']);
        }

        if (charge.type === 'OneTime') {
          chargeCopy = _.omit(chargeCopy, ['endDateCondition']);
        }

        ratePlanCopy.chargeOverrides.push(chargeCopy);
      });

      subscribeRequest.subscribeToRatePlans.push(ratePlanCopy);
    });

    if (override) {
      subscribeRequest = _.extend(subscribeRequest, override);
    }

    return create(subscribeRequest);
  };

  return {
    get,
    forAccount,
    clone,
    create,
    activate,
    update,
    cancel,
  };
};
