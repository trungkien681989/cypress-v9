let bearerToken;
let basketId;
let itemId;
let itemName;

describe('Add one product', () => {
  before(() => {
    cy.clearLocalStorageCache();
    cy.authenticate().then((authentication) => {
      bearerToken = authentication.token;
      basketId = authentication.bid;
      cy.cleanupProducts(basketId, bearerToken);
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
      itemId = body.data[0].id;
      itemName = body.data[0].name;
    });
  });

  it('Add one product to the basket', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('baseURL')}/api/BasketItems/`,
      headers: { Authorization: `Bearer ${bearerToken}` },
      body: {
        ProductId: itemId,
        BasketId: basketId,
        quantity: 1,
      },
    }).should(({ status }) => {
      expect(status).to.equal(200);
    });
  });

  it('Validate one product is added to the basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/basket/${basketId}`,
      headers: { Authorization: `Bearer ${bearerToken}` },
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      const { Products } = body.data;
      expect(Products.length).to.equal(1);
      expect(Products[0].id).to.equal(itemId);
      expect(Products[0].name).to.equal(itemName);
    });
  });
});
