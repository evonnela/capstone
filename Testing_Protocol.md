# Testing Protocol 

## Testing the Book + Quiz
  The quiz should not allow you to select multiple options after clicking submit. 
  To test the quiz:
  * Select one answer (option) and try selecting another option. It should not allow you
    to select multiple options at a time.
  * Next click 'Submit' and try clicking another option. Selecting other options, hence changing
    your answers should not be allowed once submitted. All options should be greyed out.
  * To test that quiz answers are saved, navigate to another page on the site. For example,
    the 'Library' page in the NavBar, then navigate back to the quiz. The quiz page should have 
    all previous answers saved.
  * To test the point functionality, every time you get a question right it should add 100 points
    to 'Your Score'. Double-check to prove this functionality.
## Testing the Character Building
The character building is a place to build your avatar. To test:
    * Take note of 'Your Score' on the quiz page. Then make sure it matches up to 
    the 'Wallet Points' under the avatar on the 'Character Building Page'. If it matches up then 
    this functionally is bug free. 
    * To test the actual avatar, choose modifications you would like to make, which should 
    display in real-time on the avatar. 
## Testing the Market Place
The marketplace is a place for you to buy additional accessories for your avatar, based 
on the number of points you got from the quiz. 
  * To test this functionality make sure your 'available points' match to the points you
    got from the quiz displayed on 'Your Score'
  * Next add something that you can't afford to your cart. For example, if you have 900 points
    try to add an item that is 1200 points to your cart. This should not be allowed, if you
    are unable to add this item to your cart; the page works correctly.
  * Then add something that you can afford to your cart:
      * Double-check that it is in your cart.
      * Next check out the item and make sure the points remaining, is the correct amount
                  For example, if you had 900 points and checked out something worth 500 points,                     then the points remaining should be 400 points. 


