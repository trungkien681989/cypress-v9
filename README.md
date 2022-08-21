# Cypress [![Circle CI](https://circleci.com/gh/cypress-io/cypress-example-todomvc.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-todomvc) [![Build status](https://ci.appveyor.com/api/projects/status/6wjyoye82orkkyny/branch/master?svg=true)](https://ci.appveyor.com/project/cypress-io/cypress-example-todomvc/branch/master)

This repo contains an example of automation testing written in Cypress v9. It provides automation solution for both API (Contract testing, Flow testing) and UI (E2E, Alternative, Visual)

The tests are written to verify basic functions of https://juice-shop.guardrails.ai website.

This project uses `cy.intercept` and `cy.wait` to wait for responses thus reduce flake. Refer link: [Flake](https://docs.cypress.io/guides/guides/network-requests#Flake)

## Project structure

This project follows [cypress structure](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Folder-structure). Besides, some key utility files and directories are explained as below:

```
📦cypress
 ┣ 📂fixtures
 ┃ ┣ 📂mock                        ---> store mock response to simulate alternative case of an API (5xx, 4xx, etc.)
 ┃ ┣ 📂schema                      ---> store schema baseline to validate payload of an API
 ┃ ┗ 📜<test-data>.json            ---> normal test data for the cy.fixture() method
 ┣ 📂integration
 ┃ ┣ 📂specs
 ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┣ 📜login.spec.js
 ┃ ┗ 📂utils                       ---> util functions to make code DRY(er)
 ┃ ┃ ┣ 📜<util-implement>.js
 ┣ 📂plugins
 ┃ ┗ 📜index.js
 ┣ 📂support
 ┃ ┣ 📜commands.js
 ┃ ┣ 📜element-store.js            ---> store all elements locator for cy.get() or cy.xpath() method
 ┃ ┗ 📜index.js
 ┗ 📜.eslintrc.json
```

This project presents following tests:
- Testing API flows:
  - `cypress/integration/specs/api/one-product.spec.js`
  - `cypress/integration/specs/api/two-products.spec.js`
- API contract testing: `cypress/integration/specs/api/search-contract-testing.spec.js`
- E2E testing: `cypress/integration/specs/ui/buy.spec.js`
- Testing UI alternative cases using mock/stub response from API: 
  - `cypress/integration/specs/ui/mock-no-product.spec.js`
  - `cypress/integration/specs/ui/mock-server-error.spec.js`
- Data driven testing using fixture: `cypress/integration/specs/ui/login.spec.js`
- Visual UI testing with `Percy/Cypress`: `cypress/integration/specs/ui/search.spec.js`

## Installation

The steps below will take you all the way through setup and running the tests. You will also need to clone the repo and have a basic understanding of [Git](https://en.wikipedia.org/wiki/Git).

### 1. Install Node.js

[Node.js download](https://nodejs.org/en/download/)

### 2. Installing node_modules
```npm install```

## Run Test

### 1. Open Cypress and select a test to run
```npm run cypress:open```

### 2. Run all tests (headless)
```npm run cypress:run```

## Help!
**If you get stuck, here is more help:**

* [Install Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)
* [Gitter Channel](https://gitter.im/cypress-io/cypress)
* [Cypress Docs](https://on.cypress.io)
* [Cypress CLI Tool Docs](https://docs.cypress.io/guides/guides/command-line)
