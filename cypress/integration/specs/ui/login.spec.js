import { header, login, allProducts } from '../../../support/element-store';

describe('Login validation', () => {
  before(() => {
    cy.clearLocalStorageCache();
    cy.openOWASPJuiceShop();
    cy.clickElement(header.navBarAccountButton);
    cy.clickElement(header.navBarLoginButton);
    cy.url().should('include', '/login');
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Error message shows if user login with incorrect info', () => {
    cy.fixture('user-invalid').then((users) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < users.length; i++) {
        cy.get(login.emailInput).should('be.visible').clear().type(users[i].invalid.email, { log: true });
        cy.get(login.passwordInput).should('be.visible').clear().type(users[i].invalid.password, { sensitive: true });
        cy.get(login.loginButton).should('be.enabled').click();
        cy.validateText(login.errorMessage, 'Invalid email or password.');
      }
    });
  });

  it('Login success with valid account', () => {
    cy.fixture('user').then((users) => {
      cy.login(users.valid.email, users.valid.password);
    });
    cy.get(allProducts.addToBasketButton).first().should('be.visible');
  });
});
