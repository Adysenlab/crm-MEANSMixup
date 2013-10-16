/**
 * PartialsController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  //* e.g. all partials templates get served from here
  partials: function (req,res) {
    console.log('PartialsController: action=partials ',req.param('file'));
    res.render('partials/' + req.param('file'));
  },

  // force blueprints for this very simple controller
  blueprints: {
    prefix: '',
    actions: false,
    shortcuts: false,
    rest: false
  }
};