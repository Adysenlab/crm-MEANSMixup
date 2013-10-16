var passport = require('passport');
var _ = require('underscore');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

// helper functions
function findById(id, fn) {
  User.findOne(id).done(function(err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findByUsername(u, fn) {
  User.findOne({
    username: u
  }).done(function(err, user) {
      // Error handling
      if (err) {
        return fn(null, null);
        // The User was found successfully!
      } else {
        return fn(null, user);
      }
    });
}
// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  //console.log('serializeUser ',user)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    //console.log('passport.js  ')
    process.nextTick(function() {
      // Find the user by username. If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message. Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(null, err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        // console.log('passport  password ',password,'  user.encryptedPassword ', user.encryptedPassword)
        //        bcrypt.compare(password, user.encryptedPassword, function(err, res) {
        bcrypt.compare(password, user.password, function(err, res) {          //  pasword is whats entered in form ; user.password is   encryptedPassword
          if (!res) return done(null, false, { message: 'Invalid Password'});
          // var returnUser = { username: user.username, createdAt: user.createdAt, id: user.id };
          user.online = true;
          console.log('passport ', user);
          var returnUser = user;
          //console.log('returnUser ',returnUser)
          return done(null, returnUser, { message: 'Logged In Successfully'});
        });
      });
    });
  }
));


//// Use the LocalStrategy within Passport. non bcrypt version
//// Strategies in passport require a `verify` function, which accept
//// credentials (in this case, a username and password), and invoke a callback
//// with a user object.
//passport.use(new LocalStrategy(
//  function(username, password, done) {
//    // asynchronous verification, for effect...
//    console.log('LocalStrategy;passport.js:  ',username, password)
//    process.nextTick(function () {
//            findByUsername(username, function(err, user) {
//             //findByUsername: function(username) {
////              console.log(' user.username === username     ',user.username === username);
////              console.log('findByUsername username ',username)
//              console.log('findByUsername  user', err,user)
////              console.log('findByUsername user.username ',user.username)
////              console.log('findByUsername user.role ',user.role)
//       if (err) { return done(null, err); }
//        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
//               var returnUser = { username: user.username, role:user.role, createdAt: user.createdAt, id: user.id };
//               return done(null, returnUser, { message: 'Logged In Successfully'} );
//
//            });
//
//
//   });
//  }
//));
