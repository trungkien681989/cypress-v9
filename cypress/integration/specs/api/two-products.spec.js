let bearerToken;
let basketId;
let products;
let firstItemId;
let firstItemName;
let firstItemBasketId;
let secondItemId;
let secondItemName;
let secondItemBasketId;

describe('Add two products then remove one', () => {
  before(() => {
    cy.clearLocalStorageCache();
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

  it('Get items in basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/basket/${basketId}`,
      headers: {Authorization: `Bearer ${bearerToken}`},
    }).then((getResponse) => {
      expect(getResponse).property('status').to.equal(200);
      products = getResponse.body.data.Products;
    });
  });

  it('Delete items in basket', () => {
    // eslint-disable-next-line no-plusplus
    for(let i = 0; i < products.length; i++) {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('baseURL')}/api/BasketItems/${products[i].BasketItem.id}`,
        headers: {Authorization: `Bearer ${bearerToken}`},
      }).then((deleteResponse) => {
        expect(deleteResponse).property('status').to.equal(200);
        expect(deleteResponse.body.status).to.equal('success');
      });
    }
  });

  it('Search products to add to the basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/products/search?q=`,
      headers: {Authorization: `Bearer ${bearerToken}`},
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      firstItemId = response.body.data[0].id;
      firstItemName = response.body.data[0].name;
      secondItemId = response.body.data[1].id;
      secondItemName = response.body.data[1].name;
    });
  });

  it('Add first product to the basket', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('baseURL')}/api/BasketItems/`,
      headers: {Authorization: `Bearer ${bearerToken}`},
      body: {
        ProductId: firstItemId,
        BasketId: basketId,
        quantity: 1,
      },
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      firstItemBasketId = response.body.data.id;
    });
  });

  it('Add second product to the basket', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('baseURL')}/api/BasketItems/`,
      headers: {Authorization: `Bearer ${bearerToken}`},
      body: {
        ProductId: secondItemId,
        BasketId: basketId,
        quantity: 1,
      },
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      secondItemBasketId = response.body.data.id;
    });
  });

  it('Validate two products are added to the basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/basket/${basketId}`,
      headers: {Authorization: `Bearer ${bearerToken}`},
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      expect(response.body.data.Products.length).to.equal(2);
      expect(response.body.data.Products[0].id).to.equal(firstItemId);
      expect(response.body.data.Products[0].name).to.equal(firstItemName);
      expect(response.body.data.Products[1].id).to.equal(secondItemId);
      expect(response.body.data.Products[1].name).to.equal(secondItemName);
    });
  });

  it('Remove first product from the basket', () => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('baseURL')}/api/BasketItems/${firstItemBasketId}`,
      headers: {Authorization: `Bearer ${bearerToken}`},
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      expect(response.body.status).to.equal('success');
    });
  });

  it('Validate second product is remain in the basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/basket/${basketId}`,
      headers: {Authorization: `Bearer ${bearerToken}`},
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      expect(response.body.data.Products.length).to.equal(1);
      expect(response.body.data.Products[0].id).to.equal(secondItemId);
      expect(response.body.data.Products[0].name).to.equal(secondItemName);
    });
  });
});
