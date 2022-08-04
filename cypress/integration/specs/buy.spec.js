import * as elements from '../../support/element-store';

let bearerToken;
let basketId;
let products;
let firstProductName;
let firstProductPrice;
let firstItemBasketId;
let addressId;

describe('Buying one product', () => {
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

  it('Open the OWASP Juice Shop home page', () => {
    cy.visit(Cypress.env('baseURL'));
    expect(cy.title().should('equal', 'OWASP Juice Shop'));
    cy.get(elements.closeWelcomeBannerButton).should('be.visible').click();
    cy.get(elements.dismissCookieMessage).should('be.visible').click();
    cy.get(elements.itemsPerPage).should('exist');
  });

  it('Login with valid account', () => {
    cy.get(elements.navBarAccountButton).should('be.visible').click();
    cy.get(elements.navBarLoginButton).should('be.visible').click();
    cy.url().should('include', '/login');
    cy.fixture('user').then((users) => {
      cy.login(users.valid.email, users.valid.password);
    });
  });

  it('Add one product to the basket', () => {
    cy.intercept('GET', '**/rest/basket/**').as('basket');
    cy.get(elements.itemNameText).first().should('be.visible').then(($el) => {
      firstProductName = $el.text();
    });
    cy.get(elements.itemPriceText).first().should('be.visible').then(($el) => {
      firstProductPrice = $el.text();
    });
    cy.get(elements.addToBasketButton).first().should('be.visible').click();
    cy.wait('@basket').then((interception) => {
      expect(interception.response.body.status).to.include('success');
      expect(interception.response.body.data.Products.length).to.eq(0);
    });
    cy.wait('@basket').then((interception) => {
      expect(interception.response.body.status).to.include('success');
      expect(interception.response.body.data.Products.length).to.eq(1);
      firstItemBasketId = interception.response.body.data.Products[0].BasketItem.id;
    });
  });

  it('Validate one product that added to the basket has correct info', () => {
    cy.get(elements.yourBasketButton).first().should('be.visible').click();
    cy.get(elements.checkoutButton).first().should('be.visible');
    cy.get('app-basket mat-row').first().find('mat-cell').eq(1)
      .invoke('text')
      .should('equal', firstProductName);
    cy.get('app-basket mat-row').first().find('mat-cell').eq(2)
      .first()
      .find('span')
      .eq(3)
      .invoke('text')
      .should('equal', ' 1');
    cy.get('app-basket mat-row').first().find('mat-cell').eq(3)
      .invoke('text')
      .should('include', firstProductPrice);
  });

  it('Checkout products', () => {
    cy.get(elements.checkoutButton).first().should('be.visible').click();
  });

  it('Add a new address', () => {
    cy.get(elements.addNewAddressButton).first().should('be.visible').click();
    cy.fixture('address').then((address) => {
      cy.get(elements.newAddressCountryInput).first().should('be.visible').clear()
        .type(address.country);
      cy.get(elements.newAddressNameInput).first().should('be.visible').clear()
        .type(address.name);
      cy.get(elements.newAddressMobileInput).first().should('be.visible').clear()
        .type(address.mobile);
      cy.get(elements.newAddressZipCodeInput).first().should('be.visible').clear()
        .type(address.zip);
      cy.get(elements.newAddressInput).first().should('be.visible').clear()
        .type(address.address);
      cy.get(elements.newAddressCityInput).first().should('be.visible').clear()
        .type(address.city);
      cy.get(elements.newAddressStateInput).first().should('be.visible').clear()
        .type(address.state);
    });
    cy.intercept('POST', '**/api/Addresss/**').as('createNewAddress');
    cy.get(elements.newAddressSubmitButton).first().should('be.visible').click();
    cy.wait('@createNewAddress').then((interception) => {
      expect(interception.response.statusCode).to.equals(201);
      expect(interception.response.body.status).to.include('success');
      addressId = interception.response.body.data.id;
    });
  });

  it('Validate newly added address has correct info', () => {
    cy.fixture('address').then((address) => {
      cy.get('app-address mat-row').first().find('mat-cell').eq(1)
        .invoke('text')
        .should('contain', address.name);
      cy.get('app-address mat-row').first().find('mat-cell').eq(2)
        .invoke('text')
        .should('include', `${address.address}, ${address.city}, ${address.state}, ${address.zip}`);
      cy.get('app-address mat-row').first().find('mat-cell').eq(3)
        .invoke('text')
        .should('include', address.country);
    });
  });

  it('Clean up data', () => {
    // Delete address
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('baseURL')}/api/Addresss/${addressId}`,
      headers: {Authorization: `Bearer ${bearerToken}`},
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      expect(response.body.status).to.equal('success');
    });
    // Delete items
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('baseURL')}/api/BasketItems/${firstItemBasketId}`,
      headers: {Authorization: `Bearer ${bearerToken}`},
    }).then((response) => {
      expect(response).property('status').to.equal(200);
      expect(response.body.status).to.equal('success');
    });
  });
});
