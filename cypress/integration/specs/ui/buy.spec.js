import {
  header, allProducts, basket, address, newAddress,
} from '../../../support/element-store';
import AddressUtil from '../../utils/addressUtil';
import ProductUtil from '../../utils/productUtil';

const addressUtil = new AddressUtil();
const productUtil = new ProductUtil();
let firstProductName;
let firstProductPrice;

describe('Buying one product', () => {
  before(() => {
    cy.clearLocalStorageCache();
    productUtil.cleanUpProducts();
    addressUtil.cleanupAddress();
    cy.openOWASPJuiceShop();
    cy.clickElement(header.navBarAccountButton);
    cy.clickElement(header.navBarLoginButton);
    cy.url().should('include', '/login');
    cy.fixture('user').then((users) => {
      cy.login(users.valid.email, users.valid.password);
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Add one product to the basket', () => {
    cy.intercept('GET', '**/rest/basket/**').as('basket');
    cy.get(allProducts.itemNameText).first().should('be.visible').then(($el) => {
      firstProductName = $el.text();
    });
    cy.get(allProducts.itemPriceText).first().should('be.visible').then(($el) => {
      firstProductPrice = $el.text();
    });
    cy.clickElement(allProducts.addToBasketButton);
    // Wait for first API /basket then validate zero product is in the basket before adding
    productUtil.validateProductNumberFromBackend('@basket', 0);
    // Wait for second API /basket then validate one product is in the basket after adding
    productUtil.validateProductNumberFromBackend('@basket', 1);
  });

  it('Validate one product that added to the basket has correct info', () => {
    cy.clickElement(header.yourBasketButton);
    cy.get(basket.checkoutButton).first().should('be.visible');
    productUtil.validateProductInfoInBasket(1, firstProductName, 1, firstProductPrice);
  });

  it('Checkout products', () => {
    cy.clickElement(basket.checkoutButton);
  });

  it('Add a new address', () => {
    cy.clickElement(address.addNewAddressButton);
    cy.fixture('address').then((addressData) => {
      addressUtil.fillAddress(addressData.country, addressData.name, addressData.mobile,
        addressData.zip, addressData.address, addressData.city, addressData.state);
    });
    cy.intercept('POST', '**/api/Addresss/**').as('createNewAddress');
    cy.clickElement(newAddress.submitButton);
    // Wait for API /Addresss return success after click on Submit
    cy.wait('@createNewAddress').then((interception) => {
      expect(interception.response.statusCode).to.equals(201);
      expect(interception.response.body.status).to.include('success');
    });
  });

  it('Validate newly added address has correct info', () => {
    cy.fixture('address').then((addressData) => {
      addressUtil.validateAddressInfo(addressData.name, addressData.address, addressData.city,
        addressData.state, addressData.zip, addressData.country);
    });
  });
});
