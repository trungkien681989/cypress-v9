import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
let bearerToken;
let responseBody;

function makeRequest(method, endpoint, statusCode) {
  cy.request({
    method,
    url: `${Cypress.env('baseURL')}/${endpoint}`,
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    failOnStatusCode: false,
  }).should(({ status, body }) => {
    expect(status).to.equal(statusCode);
    responseBody = body;
  });
}

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

  it('Make GET request to endpoint /search then expect success response', () => {
    makeRequest('GET', 'rest/products/search?q=', 200);
  });

  it('Validate schema of the response', () => {
    cy.fixture('schema/rest-products-search').then((schema) => {
      const validate = ajv.compile(schema);
      const valid = validate(responseBody);
      if (!valid) {
        cy.log(validate.errors).then(() => {
          throw new Error('Wrong Schema. Please double check recent commits.');
        });
      }
    });
  });

  it('Make POST request to endpoint /search then expect method not allowed response', () => {
    // The API should return method not allowed 405 instead of 500
    makeRequest('POST', 'rest/products/search?q=', 500);
  });

  it('Make GET request to endpoint /products/searches then expect not found response', () => {
    // The API should return not found 404 instead of 500
    makeRequest('GET', 'rest/products/searches', 500);
  });

  it('Make GET request to endpoint /product/search then expect not found response', () => {
    // The API should return not found 404 instead of 500
    makeRequest('GET', 'rest/product/search?q=', 500);
  });
});
