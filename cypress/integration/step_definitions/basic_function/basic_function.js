import {Given, When, Then} from "cypress-cucumber-preprocessor/steps"

let glNewCompanyName = ''
let glUpdateComputerName = ''
const glUpdateCompany = 'Netronics'

Given('I open the website', () => {
  cy.visit(Cypress.config().baseUrl)
})

Given('I click on add new computer button', () => {
  cy.get("#add").should("be.visible").click()
})

When('I fill new computer information and click add new computer button', () => {
  cy.fixture('new-computer-info.json').then((computerNew) => {
    var newComputerName = `${computerNew.computerName}_${Math.floor(Math.random() * 100000)}`
    glNewCompanyName = newComputerName
    cy.fillInformation(newComputerName, computerNew.introducedDate, computerNew.discontinuedDate, computerNew.company)
    cy.get("[type=submit]").should("be.visible").click()
  })
  
})

Then('I should see the add new computer succeed message dislay', () => {
  cy.contains(`Computer ${glNewCompanyName} has been created`).should("be.visible")
})

When('I search the computer', () => {
  cy.filterComputer(glNewCompanyName)
})

Then('I should see new computer added with correct information', () => {
  cy.fixture('new-computer-info.json').then((computerNew) => {
    cy.isComputerDisplaySuccessfully(computerNew)
  })
  
})

When('I select the computer', () => {
  cy.contains(glNewCompanyName).click()
})

When('I update the information for computer', () => {
  const newUpdateName = `Update_${Math.floor(Math.random() * 100000)}`
  glUpdateComputerName = newUpdateName
  cy.updateInformation({computerName: newUpdateName, company: glUpdateCompany})
})

Then('I should see the update succeed message display', () => {
  cy.contains(`Computer ${glUpdateComputerName} has been updated`).should("be.visible")
})

When('I search the updated computer', () => {
  cy.filterComputer(glUpdateComputerName)
})

Then('I should see the computer added with correct information', () => {
  cy.isComputerDisplaySuccessfully({computerName: glUpdateComputerName, company: glUpdateCompany})
})

When('I delete the computer', () => {
  cy.get('.topRight [type=submit]').should("be.visible").click()
})

Then('I should see the delete successfully message', () => {
  cy.contains("Computer has been deleted").should("be.visible")
})

Then('I should see the nothing to display message', () => {
  cy.contains("Nothing to display").should("be.visible")
}) 
