/**
 * User
 *
 * @description
 *		A short summary of the kind of data this model represents.
 *
 */
var userRoles = require('../../assets/linker/js/routingConfig').userRoles;
var bcrypt = require('bcrypt');
//var users = [
//    {
//        id:         1,
//        username:   "user",
//        password:   "123",
//        role:   userRoles.user
//    },
//    {
//        id:         2,
//        username:   "admin",
//        password:   "123",
//        role:   userRoles.admin
//    }
//];
module.exports = {
  // only accpet what in schema : true,
  attributes: {

    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    role: {
      type: 'INTEGER',
      required: true
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },
    email: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string',
      required: true
    },

    //-----------------
    // instance methods
    //-----------------
    toJSON: function() {
      // this gives you an object with the current values
      var obj = this.toObject();
      // Remove the password object value
      delete obj.password;
      // return the new object without password
      return obj;
    }
  },

  beforeCreate: function(user, cb) {
    console.log(' user.password = hash ', user);
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        }else {
          console.log(' user.password = hash ', user.password = hash);
          user.password = hash;
          cb(null, user);
        }
      });
    });
  }
};
