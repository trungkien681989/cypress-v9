Feature: Computer Basic Function
  As a user I want to be able to run basic function for the website

  Background: The test envrionent is established
    Given I open the website

  Scenario: The new computer should be able to add    
    Given I click on add new computer button
    When I fill new computer information and click add new computer button
    Then I should see the add new computer succeed message dislay
    When I search the computer
    Then I should see new computer added with correct information

  Scenario: The new computer should be able to update
    Given I click on add new computer button
    When I fill new computer information and click add new computer button
    Then I should see the add new computer succeed message dislay
    When I search the computer
    Then I should see new computer added with correct information
    When I select the computer
    And I update the information for computer
    Then I should see the update succeed message display
    When I search the updated computer
    Then I should see the computer added with correct information

  Scenario: The new computer should be able to delete
    Given I click on add new computer button
    When I fill new computer information and click add new computer button
    Then I should see the add new computer succeed message dislay
    When I search the computer
    Then I should see new computer added with correct information
    When I select the computer
    And I delete the computer
    Then I should see the delete successfully message
    When I search the computer
    Then I should see the nothing to display message
