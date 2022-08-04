import * as elements from '../../../support/element-store';

describe('Home page display when no product found', () => {
  before(() => {
    cy.clearLocalStorageCache();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Open the OWASP Juice Shop home page with no product mock', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.intercept('GET', '**/products/search?q=**', { fixture: `mock/no-product.json` }).as('interceptProductSearch');
    cy.openOWASPJuiceShop();
  });

  it('Validate home page display no product', () => {
    cy.get(elements.itemNameText).should('not.exist');
    cy.get(elements.itemPriceText).should('not.exist');
    cy.get(elements.addToBasketButton).should('not.exist');
  });
});
