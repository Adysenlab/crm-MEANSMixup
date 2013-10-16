/*---------------------
 :: Food
 -> model
 ---------------------*/

module.exports = {
  attributes: {
    name: 'STRING',
    type: 'STRING',
    expiration: 'DATE',
    quantity: 'STRING', //for sake of example, ignore that this is a string...
    percentRemaining: 'INTEGER',
    Details: 'json'
  }
};
