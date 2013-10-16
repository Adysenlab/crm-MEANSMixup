/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  // This loads the sign-up page --> new.ejs
  'new': function(req, res) {
    console.log('creste new user ');
    res.view();
  },

//    create: function (req, res, next) {
//        console.log('UserController.create: ',req.params.all());
//        // Create a User with the params sent fromtd
//        // the sign-up form --> new.ejs
//        //console.log('req ',req)
//
//        User.create( req.params.all(), function userCreated (err, user) {
//
//            // // If there's an error
//            // if (err) return next(err);
//
//            if (err) {
//                console.log(err);
//                req.session.flash = {
//                    err: err
//                }
//
//                // If error redirect back to sign-up page
//                //return res.redirect('/user/new');
//               // return res.redirect('/user');
//              return res.json({ data: user });
//            }
//
//            // After successfully creating the user
//            // redirect to the show action
//            // From ep1-6: //res.json(user);
//
//            //res.redirect('/user/show/'+user.id);
//            return res.redirect('/user');
//        });
//    },

  // render the profile view (e.g. /views/show.ejs)
  show: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      console.log('matt debug', user);
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },
//
//    index: function (req, res, next) {
//
//        // Get an array of all users in the User collection(e.g. table)
//        User.find(function foundUsers (err, users) {
//            if (err) return next(err);
//            // pass the array down to the /views/index.ejs page
//            res.view({
//                users: users
//            });
//        });
//    },

  create: function(req, res, next) {
    console.log('UserController.create: ', req.params.all());
    // Create a User with the params sent from ang dont need it
    User.create(req.params.all(), function userCreated(err, user) {

      // // If there's an error
      // if (err) return next(err);

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        };

        // If error redirect back to sign-up page
        //return res.redirect('/user/new');
        // return res.redirect('/user');
        return res.json({ data: user });
      }
      return res.json({ data: user });
      // After successfully creating the user
      // redirect to the show action
      // From ep1-6: //res.json(user);

      //res.redirect('/user/show/'+user.id);
      //return res.redirect('/user');
    });
  },
  index: function(req, res, next) {
    console.log('user index... ');
    User.find().sort('username ASC').done(function(err, users) {
        if (err) return next(err);
        // pass the array down to the /views/vendor.ejs page
        //res.json(users);
        res.json({data: users});

        console.log('user index after res.json... ');
      });
  },


  // render the edit view (e.g. /views/edit.ejs)
  edit: function(req, res, next) {

    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      res.view({
        user: user
      });
    });
  },

  // process the info from edit view
  update: function(req, res, next) {
    console.log('in update', req.param('id'), req.param('email'), req.param('title') , req.params.all());//, req.params.all())
    User.update(req.param('id'), req.params.all(), function userUpdated(err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      //res.redirect('/user/show/' + req.param('id'));
      //res.redirect('/user/show/' + req.param('id'));
      res.json({data: 'success'});//User});

    });
  },

  destroy: function(req, res, next) {
    console.log('in destory ', req.param('id'));
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

      });

      //  res.redirect('/user');
      return res.json({ data: 'success' });
    });
  }

};
