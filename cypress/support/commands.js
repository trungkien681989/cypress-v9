// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import dayjs from "dayjs"

/**
* @memberOf cy
* @method fillInformation
* @param {string} computerName
* @param {string} introducedDate
* @param {string} discontinueDate
* @param {string} company
*/

Cypress.Commands.add('fillInformation',
    (computerName, introducedDate, discontinueDate, company) => {
        cy.get('#name').should("be.visible").type(computerName)
        cy.get('#introduced').should("be.visible").type(introducedDate)
        cy.get('#discontinued').should("be.visible").type(discontinueDate)
        cy.get('#company').should("be.visible").select(company) 
});

/**
* @memberOf cy
* @method isComputerDisplaySuccessfully
* @param {obj} computerObj
*/

Cypress.Commands.add('isComputerDisplaySuccessfully',
    (computerObj) => {
    let computerName = computerObj.computerName
    let introducedDate = computerObj.introducedDate
    let discontinuedDate = computerObj.discontinuedDate
    let company = computerObj.company
  
    if(computerName !== undefined){
        cy.contains(computerName).should("be.visible")
    }
    if(introducedDate !== undefined){
        let displayIntroducedDate = dayjs(introducedDate).format("DD MMM YYYY")
        cy.contains(displayIntroducedDate).should("be.visible")         
    }
    if(discontinuedDate !== undefined){
        let displaydiscontinuedDate= dayjs(discontinuedDate).format("DD MMM YYYY")
        cy.contains(displaydiscontinuedDate).should("be.visible")
    }
    if(company !== undefined){
        cy.contains(company).should("be.visible")
    }
});

/**
* @memberOf cy
* @method updateInformation
* @param {obj} computerObj
*/
Cypress.Commands.add('updateInformation',
    (computerObj) => {
    let computerName = computerObj.computerName
    let introducedDate = computerObj.introducedDate
    let discontinuedDate = computerObj.discontinuedDate
    let company = computerObj.company
  
    if(computerName !== undefined){
        cy.get('#name').clear()
                                    .should("be.visible")
                                    .type(computerName)
    }
    if(introducedDate !== undefined){
        cy.get('#introduced').clear()
                                    .should("be.visible")
                                    .type(introducedDate)           
    }
    if(discontinuedDate !== undefined){
        cy.get('#discontinued').clear()
                                    .should("be.visible")
                                    .type(discontinuedDate)
    }
    if(company !== undefined){
        cy.get('#company').should("be.visible").select(company)
    }
    cy.contains("Save this computer").click()
});

/**
* @memberOf cy
* @method filterComputer
* @param {string} computerName
*/

Cypress.Commands.add('filterComputer',
    (computerName) => {
        cy.get('#searchbox').should("be.visible").type(computerName)
        cy.get('#searchsubmit').should("be.visible").click()
});