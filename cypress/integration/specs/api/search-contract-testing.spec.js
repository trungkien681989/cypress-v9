let bearerToken;

describe('Contract testing for /search endpoint', () => {
  before(() => {
    cy.clearLocalStorageCache();
    cy.authenticate().then((authentication) => {
      bearerToken = authentication.token;
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Make GET request to endpoint /search then expect success response with valid schema', () => {
    cy.validateApiSchema('GET', 'rest/products/search?q=', bearerToken, 200, 'rest-products-search');
  });

  it('Make POST request to endpoint /search then expect method not allowed response', () => {
    // The API should return method not allowed 405 instead of 500
    cy.makeRequest('POST', 'rest/products/search?q=', bearerToken, 500);
  });

  it('Make GET request to endpoint /products/searches then expect not found response', () => {
    // The API should return not found 404 instead of 500
    cy.makeRequest('GET', 'rest/products/searches', bearerToken, 500);
  });

  it('Make GET request to endpoint /product/search then expect not found response', () => {
    // The API should return not found 404 instead of 500
    cy.makeRequest('GET', 'rest/product/search?q=', bearerToken, 500);
  });
});
