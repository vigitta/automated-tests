Feature: Cable Guy

  Scenario: Filtering and Adding a cable to basket

    Given I navigate to Cable Guy Page
    Then I expect text "cable beginning" is displayed
    When I click "CableGuy"."Cable_Beginning_Button"
    Then I expect text "All cable types" is displayed
    And  I Click on a random cable type
    Then a cable type is displayed on the begining part of the cable UI
    And  I click "CableGuy"."Cable_End_Button"
    Then I expect text "All cable types" is displayed
    And  I Click on a random cable type
    And  I click on a random manufacturer item
    Then it shows the same number of products as listed under the manufacturer logo
    When I click on a filtered product
    Then the page opened is having the same title
    And When I add the product to the cart
    Then the basket notification popup has the same product name