import AddressUtil from '../../utils/addressUtil';
import ProductUtil from '../../utils/productUtil';

const addressUtil = new AddressUtil();
const productUtil = new ProductUtil();
let bearerToken;
let basketId;
let firstItemId;
let firstItemName;
let firstItemBasketId;
let secondItemId;
let secondItemName;

describe('Add two products then remove one', () => {
  before(() => {
    cy.clearLocalStorageCache();
    productUtil.cleanUpProducts();
    addressUtil.cleanupAddress();
    cy.authenticate().then((authentication) => {
      bearerToken = authentication.token;
      basketId = authentication.bid;
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Search products to add to the basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/products/search?q=`,
      headers: { Authorization: `Bearer ${bearerToken}` },
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      firstItemId = body.data[0].id;
      firstItemName = body.data[0].name;
      secondItemId = body.data[1].id;
      secondItemName = body.data[1].name;
    });
  });

  it('Add first product to the basket', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('baseURL')}/api/BasketItems/`,
      headers: { Authorization: `Bearer ${bearerToken}` },
      body: {
        ProductId: firstItemId,
        BasketId: basketId,
        quantity: 1,
      },
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      firstItemBasketId = body.data.id;
    });
  });

  it('Add second product to the basket', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('baseURL')}/api/BasketItems/`,
      headers: { Authorization: `Bearer ${bearerToken}` },
      body: {
        ProductId: secondItemId,
        BasketId: basketId,
        quantity: 1,
      },
    }).should(({ status }) => {
      expect(status).to.equal(200);
    });
  });

  it('Validate two products are added to the basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/basket/${basketId}`,
      headers: { Authorization: `Bearer ${bearerToken}` },
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      const { Products } = body.data;
      expect(Products.length).to.equal(2);
      expect(Products[0].id).to.equal(firstItemId);
      expect(Products[0].name).to.equal(firstItemName);
      expect(Products[1].id).to.equal(secondItemId);
      expect(Products[1].name).to.equal(secondItemName);
    });
  });

  it('Remove first product from the basket', () => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('baseURL')}/api/BasketItems/${firstItemBasketId}`,
      headers: { Authorization: `Bearer ${bearerToken}` },
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body.status).to.equal('success');
    });
  });

  it('Validate second product is remain in the basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/basket/${basketId}`,
      headers: { Authorization: `Bearer ${bearerToken}` },
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      const { Products } = body.data;
      expect(Products.length).to.equal(1);
      expect(Products[0].id).to.equal(secondItemId);
      expect(Products[0].name).to.equal(secondItemName);
    });
  });
});
