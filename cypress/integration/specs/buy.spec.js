let bearerToken;
let basketId;
let products;

describe('Buying one product', () => {
  it('Login by api', () => {
    cy.fixture('user').then((users) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('baseURL')}/rest/user/login`,
        headers: {'content-type': 'application/json'},
        body: {email: `${users.valid.email}`, password: `${users.valid.password}`},
      }).then((response) => {
        bearerToken = response.body.authentication.token;
        basketId = response.body.authentication.bid;
      });
    });
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

  // it('Open the OWASP Juice Shop home page', () => {
  //   navigatorPage.navigateToSite();
  // });
  //
  // it('Login with valid account', () => {
  //   navigatorPage.navigateToSite();
  // });
  //
  // it('Add one product to the basket', () => {
  //   navigatorPage.navigateToSite();
  // });
  //
  // it('Validate one product that added to the basket has correct info', () => {
  //   navigatorPage.navigateToSite();
  // });
  //
  // it('Checkout products', () => {
  //   navigatorPage.navigateToSite();
  // });
  //
  // it('Add a new address', () => {
  //   navigatorPage.navigateToSite();
  // });
  //
  // it('Validate newly added address has correct info', () => {
  //   navigatorPage.navigateToSite();
  // });
  //
  // it('Clean up data', () => {
  //   navigatorPage.navigateToSite();
  // });
});
