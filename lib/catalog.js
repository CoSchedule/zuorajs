const _ = require('lodash');

/**
 * @typedef {object} Product
 * @todo stuff needed to describe Product model ...
 */

/**
 * @typedef {Array.<Product>} ProductCatalogModel
 */

/**
 * @interface ProductCatalogCache
 * @property {function: (function(): Promise<ProductCatalogModel>) get
 * @property (function(productCatalogModel): Promise<ProductCatalogModel>)} set
 */

/**
 * @implements ProductCatalogCache
 */
class InMemoryCache {
  constructor() {
    this.productCatalogModel = null;
  }

  async get() {
    return this.productCatalogModel;
  }

  async set(productCatalogModel) {
    this.productCatalogModel = productCatalogModel;
    return productCatalogModel;
  }
}

module.exports = (zuoraClient) => {
  const cache = new InMemoryCache();

  const getCatalogPage = (url) => zuoraClient.http.get(url);

  const stripApiVersion = (path) => {
    const apiVersion = `/${zuoraClient.config.apiVersion}`;
    if (path.startsWith(apiVersion)) {
      return path.replace(apiVersion, '');
    }

    return path;
  };

  const accumulateCatalogProducts = async (url, catalogProductsModel) => {
    const page = await getCatalogPage(url);
    const { nextPage, products } = page;
    const accumulatedCatalogProductsModel = catalogProductsModel.concat(products);

    if (nextPage) {
      const nextPageUrl = stripApiVersion(nextPage);
      return accumulateCatalogProducts(nextPageUrl, accumulatedCatalogProductsModel);
    }

    return accumulatedCatalogProductsModel;
  };

  const cacheFill = async () => {
    const productCatalogModel = await accumulateCatalogProducts('/catalog/products', []);
    return cache.set(productCatalogModel);
  };

  const get = async () => {
    const cached = await cache.get();
    const cacheResult = cached || await cacheFill();
    return _.cloneDeep(cacheResult);
  };

  return {
    get,
  };
};
