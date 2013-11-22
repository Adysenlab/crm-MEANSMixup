/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  // This loads the sign-up page --> new.ejs
  'new': function(req, res) {
    console.log('render new user signup page');
    res.view();
  },


  // render the profile view (e.g. /views/show.ejs)
  show: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },

  create: function(req, res, next) {
    console.log('UserController.create: ', req.params.all());
    // Create a User with the params sent from ang dont need it
    User.create(req.params.all(), function userCreated(err, user) {

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        };
        //
        return res.send(500, { error: err, params: req.params.all() });
      }

      if (!user) {
        console.error('unable to create user');
        return res.send(500, { error: 'unknown failure', params: req.params.all() });
      }
      // Let other subscribed sockets know that the user was created.
      console.log('created user ', user);
      User.publishCreate({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        title: user.title,
        role: user.role,
        online: user.online,
        action: 'create'
      });

      return res.send(201, { data: user });
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
    User.update(req.param('id'), req.params.all(), function userUpdated(err, users) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      // Let other subscribed sockets know that the user was created.
      users[0].action = 'update';
      User.publishUpdate(users[0]);

      res.json({data: 'success'});

    });
  },

  destroy: function(req, res, next) {
    console.log('in destory ', req.param('id'));
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

        // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
        User.publishUpdate(user.id, {
          username: user.username,
          action: 'destroy'
        });

      });

      //  res.redirect('/user');
      return res.json({ data: 'success' });
    });
  },

  // This action works with socket.get('/user/subscribe') to
  // subscribe to the User model classroom and instances of the user
  // model
  subscribe: function(req, res, next) {

    // Find all current users in the user model
    User.find(function foundUsers(err, users) {
      if (err) return next(err);

      // subscribe this socket to the User model classroom
      User.subscribe(req.socket);

      // subscribe this socket to the user instance rooms
      User.subscribe(req.socket, users);

      // This will avoid a warning from the socket for trying to render
      // html over the socket.
      res.send(200);
    });
  }
};
