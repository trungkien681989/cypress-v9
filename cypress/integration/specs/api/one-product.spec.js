let bearerToken;
let basketId;
let products;
let itemId;
let itemName;

describe('Add one product', () => {
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
      itemId = response.body.data[0].id;
      itemName = response.body.data[0].name;
    });
  });

  it('Add one product to the basket', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('baseURL')}/api/BasketItems/`,
      headers: {Authorization: `Bearer ${bearerToken}`},
      body: {
        ProductId: itemId,
        BasketId: basketId,
        quantity: 1,
      },
    }).then((response) => {
      expect(response).property('status').to.equal(200);
    });
  });

  it('Validate one product is added to the basket', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURL')}/rest/basket/${basketId}`,
      headers: {Authorization: `Bearer ${bearerToken}`},
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      expect(response.body.data.Products.length).to.equal(1);
      expect(response.body.data.Products[0].id).to.equal(itemId);
      expect(response.body.data.Products[0].name).to.equal(itemName);
    });
  });
});
