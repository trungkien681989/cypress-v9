import * as elements from '../../../support/element-store';

describe('Home page display when product search api returns internal server error', () => {
  before(() => {
    cy.clearLocalStorageCache();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Open the OWASP Juice Shop home page with internal server error mock', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.fixture('mock/internal-server-error.html').then((responseBody) => {
      cy.intercept('GET', '**/products/search?q=**', {
        statusCode: 500,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: responseBody,
      });
    });
    cy.openOWASPJuiceShop();
  });

  it('Validate home page display no product', () => {
    cy.get(elements.itemNameText).should('not.exist');
    cy.get(elements.itemPriceText).should('not.exist');
    cy.get(elements.addToBasketButton).should('not.exist');
  });
});
