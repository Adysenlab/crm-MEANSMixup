/**
 * AuthController
 *
 */
var passport = require('passport');
module.exports = {
    login: function(req, res, next) {
        console.log('in login of AuthContoller.js ')//,req)
        passport.authenticate('local', function(err, user) {
            console.log('passport.authenticate  user:',user,err)
            if(err)     { return next(err); }
            if(!user)   { return res.send(400); }
            req.logIn(user, function(err) {
                if(err) {
                    return next(err);
                }
                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                res.json(200, { "role": user.role, "username": user.username });
            });
        })(req, res, next);
    },

    logout: function (req,res){
    req.logout();
    res.send('logout successful');
  }

};

//  login: function(req, res){
//    console.log ('auth ')
//    passport.authenticate('local', function(err, user, info){
//     console.log ('AuthController login user ',user,err)
//      if ((err) || (!user)) res.send(err);
//      req.logIn(user, function(err){
//        if (err) res.send(err);
//       // return res.send({ message: 'login successful' });
//        return res.send( user);
//      });
//    })(req, res);
//  },

   /* from mas rc2
    login: function(req, res, next) {
    passport.authenticate('local', function(err, user) {

    if(err)     { return next(err); }
    if(!user)   { return res.send(400); }


    req.logIn(user, function(err) {
    if(err) {
    return next(err);
    }

    if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
    res.json(200, { "role": user.role, "username": user.username ,"adjusterid": user.adjusterid});
    });
    })(req, res, next);
    },

    logout: function(req, res) {
    console.log('in logout ');
    //passport.user='';
    req.socket.session = null;// clear cookue
    req.logout();
    res.send(200);
    }
    */

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
