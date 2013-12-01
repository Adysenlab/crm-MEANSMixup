/**
 * AccountController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  findAllWrapped: function(req, res, next) {
    console.log('AccountController::findAllWrapped... ');
    Account.find()
      .sort('Desc ASC')
      .exec(function(err, accounts) {
        if (err) return next(err);
        return res.json({ data: accounts });
      });
  }
  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */


};
