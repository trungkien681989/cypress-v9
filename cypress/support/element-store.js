/* LOCATORS
 Should place them in order: left-to-right & top-to-bottom */

export const popup = {
  closeWelcomeBannerButton: 'button[aria-label="Close Welcome Banner"]',
  dismissCookieMessage: 'a[aria-label="dismiss cookie message"]',
};

export const login = {
  emailInput: 'input#email',
  passwordInput: 'input#password',
  loginButton: 'button#loginButton',
  errorMessage: 'div[class*="error"]',
};

export const header = {
  backToHomePageButton: 'button[aria-label="Back to homepage"]',
  searchButton: 'mat-icon[class*="mat-search_icon-search"]',
  searchInput: 'input#mat-input-0',
  navBarAccountButton: 'button#navbarAccount',
  navBarLoginButton: 'button#navbarLoginButton',
  yourBasketButton: 'button[aria-label="Show the shopping cart"]',
};

export const allProducts = {
  itemNameText: 'div.item-name',
  itemPriceText: 'div.item-price span',
  addToBasketButton: 'button[aria-label="Add to Basket"]',
  itemsPerPage: 'div[class*="paginator-page-size-label"]',
};

export const searchResults = {
  searchValueText: 'span#searchValue',
};

export const basket = {
  checkoutButton: 'button#checkoutButton',
};

export const address = {
  addNewAddressButton: 'button[aria-label="Add a new address"]',
};

export const newAddress = {
  countryInput: 'input[data-placeholder="Please provide a country."]',
  nameInput: 'input[data-placeholder="Please provide a name."]',
  mobileInput: 'input[data-placeholder="Please provide a mobile number."]',
  zipCodeInput: 'input[data-placeholder="Please provide a ZIP code."]',
  addressInput: 'textarea[data-placeholder="Please provide an address."]',
  cityInput: 'input[data-placeholder="Please provide a city."]',
  stateInput: 'input[data-placeholder="Please provide a state."]',
  submitButton: 'button#submitButton',
};
