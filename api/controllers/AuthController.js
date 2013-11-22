/**
 * AuthController
 *
 */
var passport = require('passport');
module.exports = {
  login: function(req, res, next) {
    console.log('AuthController::login ');

    passport.authenticate('local', function(err, user) {
      console.log('passport.authenticate  user:', user, err);
      if (err) { return next(err); }
      if (!user) { return res.send(400); }
      req.logIn(user, function(err) {
        console.log(' after pp ', user);
        if (err) {
          return next(err);
        }
        if (req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;

        User.update(user.id, {
          online: true
        }, function(err) {
          if (err) return next(err);

          // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
          User.publishUpdate(user.id, {
            online: true,
            id: user.id,
            username: user.username,
            action: 'onlineChanged'
          });

          res.json(200, { 'role': user.role, 'username': user.username });
        });
      });
    })(req, res, next);
  },

  logout: function(req, res, next) {
    var oldUser = _.clone(req.user);
    console.log('AuthController::logout ', oldUser);

    req.logout();

    // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged out
    User.publishUpdate(oldUser.id, {
      online: false,
      id: oldUser.id,
      username: oldUser.username,
      action: 'onlineChanged'
    });
    res.send('logout successful');
  }

};


/**
 * Sails controllers expose some logic automatically via blueprints.
 *
 * Blueprints are enabled for all controllers by default, and they can be turned on or off
 * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
 * for AuthController.
 *
 * NOTE:
 *		REST and CRUD shortcut blueprints are only enabled if a matching model file
 *		(`models/Auth.js`) exists.
 *
 * NOTE:
 *		You may also override the logic and leave the routes intact by creating your own
 *		custom middleware for AuthController's `find`, `create`, `update`, and/or
 *		`destroy` actions.
 */

module.exports.blueprints = {

  // Expose a route for every method,
  // e.g.
  //	`/auth/foo` => `foo: function (req, res) {}`
  actions: true,


  // Expose a RESTful API, e.g.
  //	`post /auth` => `create: function (req, res) {}`
  rest: true,


  // Expose simple CRUD shortcuts, e.g.
  //	`/auth/create` => `create: function (req, res) {}`
  // (useful for prototyping)
  shortcuts: true

};
