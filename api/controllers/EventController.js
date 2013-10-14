/**
 * EventController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

  var EventController;
  EventController = {


index: function (req, res, next) {
    console.log('EventController index... ');
    Event.find({
    }).sort('name ASC').done(function(err, events) {
            if (err) return next(err);
            // pass the array down to the /views/vendor.ejs page
            //res.json(users);
            res.json({data:events});

            console.log('user index after res.json... ');
        });
}


};

module.exports = EventController;

