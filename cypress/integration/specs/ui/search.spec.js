import { allProducts, header, searchResults } from '../../../support/element-store';

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

  it('Open the OWASP Juice Shop home page', () => {
    cy.openOWASPJuiceShop();
  });

  it('Click Search', () => {
    cy.clickElement(header.searchButton);
  });

  it('Search for Apple', () => {
    cy.get(header.searchInput).first().should('be.visible').click()
      .type('Apple{enter}');
  });

  it('Validate search results shows Apple products', () => {
    cy.validateText(searchResults.searchValueText, 'Apple');
    cy.get(allProducts.itemNameText).each(($el) => {
      expect($el.text()).to.include('Apple');
    });
  });

  it('Validate search results does not show Banana products', () => {
    cy.get(allProducts.itemNameText).each(($el) => {
      expect($el.text()).not.to.include('Banana');
    });
  });

  it('Take a percy snapshot', () => {
    cy.percySnapshot('AppleSearchResults');
  });
});
