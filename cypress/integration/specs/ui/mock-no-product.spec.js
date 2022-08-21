import { allProducts } from '../../../support/element-store';

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
    cy.get(allProducts.itemNameText).should('not.exist');
    cy.get(allProducts.itemPriceText).should('not.exist');
    cy.get(allProducts.addToBasketButton).should('not.exist');
  });
});
