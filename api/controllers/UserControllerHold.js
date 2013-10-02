/**
 * UserController
 *
 */

module.exports = {

    index: function (req, res, next) {
        console.log('ven index... ');
        User.find({
        }).sort('username ASC').done(function(err, users) {
                if (err) return next(err);
                // pass the array down to the /views/vendor.ejs page
                res.json(users);
                console.log('ven Vendor... ');
            });
    },
    index1: function (req, res, next) {
        //      console.log('test.shows how to pass param from partial.. ',req.param('lat') +'/'+ req.param('lng')+'/'+ req.param('radius'));//:lat/:lng/:radius'

        console.log(' index1... ',req.param('id'));
        User.findOne({
            id :req.param('id') // this does not work
        }).done(function(err, users) {
                if (err) return next(err);
                // pass the array down to the /views/vendor.ejs page
                res.json(users);
                console.log('users... ',users);
            });
    }


}




/**
 * Sails controllers expose some logic automatically via blueprints.
 * 
 * Blueprints are enabled for all controllers by default, and they can be turned on or off
 * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
 * for UserController.
 *
 * NOTE:
 *		REST and CRUD shortcut blueprints are only enabled if a matching model file
 *		(`models/User.js`) exists.
 *
 * NOTE:
 *		You may also override the logic and leave the routes intact by creating your own
 *		custom middleware for UserController's `find`, `create`, `update`, and/or 
 *		`destroy` actions.
 */

module.exports.blueprints = {

	// Expose a route for every method,
	// e.g.
	//	`/user/foo` => `foo: function (req, res) {}`
	actions: true,


	// Expose a RESTful API, e.g.
	//	`post /user` => `create: function (req, res) {}`
	rest: true,


	// Expose simple CRUD shortcuts, e.g.
	//	`/user/create` => `create: function (req, res) {}`
	// (useful for prototyping)
	shortcuts: true	

};
