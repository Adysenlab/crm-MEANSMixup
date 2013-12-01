/**
 * AuthController
 *
 */
var passport = require('passport');

// for upload
var _und = require('underscore');
var  fs = require('fs-extra');


module.exports = {

  pdfview: function (req,res) {
    console.log('./api/uploads... ',req.param('file'));
    console.log("Request handler show was called." ,'./api/uploads/' + req.param('file'));
    fs.readFile('./api/uploads/' + req.param("file"),"binary", function(error,file)
    {
      if (error)
      {
        res.writeHead(500, {"Content-Type": "text/plain" });
        res.write(error + "\n");
        res.end();
      }
      else
      {
        res.writeHead(200, {"Content-Type" : "application/pdf" });
        res.write(file, "binary" );
        res.end();
      }
    });

  },
  upload: function (req, res, next) {
//   var poid = req.body.poid; //lvl
    var poid = req.body.myObj; // dragDrop upld

    console.log('--AuthController req.body---------------------\n', poid,req.body)

  if (req.body) {
  console.log(JSON.stringify(req.body));
}

var data = {
  //msg: "/files/post"
  msg: "./api/uploads/"
  //var target_path = './api/uploads/' + 14439+'.pdf';//req.files.thumbnail.name;
};

data.msg = Object.keys(req.files).length + " files posted";
Object.keys(req.files).forEach(function(key) {
  var file = req.files[key];
  console.log('Found a file named ' + key + +' fileName',file.name,' it is ' + file.size + ' bytes'+ ' saved as  ',poid);
  //console.log('--AuthController req.body---------------------\n', req.body)

    if (file.size>0) {
      // only 1 image
      var tmp_path = file;
    }
      var target_path = './api/uploads/' + poid+'.pdf';

  console.log('--tmp_path  ----------------\n', console.log('--target_path----------------\n',target_path)
  )
  console.log('====================================================')
  console.log('--tmp_path path----------------\n',tmp_path.path)

  console.log('--target_path----------------\n',target_path)

  fs.copy(tmp_path.path, target_path, function (err) {
        if (err) {
          console.error(err);
        }
        else {
          console.log("AuthController:upload upload success!")
        }
      });
res.send(data);
})
  },

//  upload: function (req, res, next) {
//    console.log('--AuthController req.body---------------------\n', req.body)
//    if (req.files.thumbnail[0] == undefined) {
//      // only 1 image
//      var tmp_path = req.files.thumbnail.path;
//      allfiles = req.files.thumbnail.name;
//      //    // set where the file should actually exists - in this case it is in the "images" directory
//      //var target_path = './public/uploads/' + req.files.thumbnail.name;
//      //   var target_path = './uploads/' + req.files.thumbnail.name;//C:\Node\Apps\Mas\mas-rc2\uploads
//      var target_path = './api/uploads/' + 14439+'.pdf';//req.files.thumbnail.name;
//      // move the file from the temporary location to the intended location
//      // console.log('upload;  tmp_path ,target_path   ', req.files.thumbnail, tmp_path, target_path);
//// this only works for the same drive
////  fs.rename(tmp_path, target_path, function (err) {
//      fs.copy(tmp_path, target_path, function (err) {
//        if (err) {
//          console.error(err);
//        }
//        else {
//          console.log("AuthController:upload upload success!")
//
//
////          fs.unlink(tmp_path, function () {
////            if (err) throw err;
////          });
//
//          //  res.json(200, { "status": "success"});
//          // res.redirect('/login');
//          //res.send('upload successful');
//        }
//      }); //copies file
//    }
//    else {
//      var len = req.files.thumbnail.length;
//      allfiles ='';
//      for (var i = 0; i < len; i++) {
//        allfiles += req.files.thumbnail[i].name + ' ';
//        var tmp_path = req.files.thumbnail[i].path;
//        var target_path = './server/uploads/' + req.files.thumbnail[i].name;
//        console.log('upload from AuthController;  tmp_path ,target_path ', tmp_path, target_path);
//        fs.copy(tmp_path, target_path, function (err) {
//          if (err) {
//            console.error(err);
//          }
//          else {
//            console.log("upload success from auth!")
//            //res.redirect('/users');
//            res.json(200, { "status": "success"});
//
//            // res.redirect('/upload');
//
//          }
//        }); //copies file
//
////          }
//      }
//
//    }
//  },






  /////////////////
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




///**
// * AuthController
// *
// */
//var passport = require('passport');
//// for upload
//var _und = require('underscore');
//var  fs = require('fs-extra');
//
//module.exports = {
//  pdfview: function (req,res) {
//    console.log('./api/uploads... ',req.param('file'));
//    console.log("Request handler show was called." ,'./api/uploads/' + req.param('file'));
//    fs.readFile('./api/uploads/' + req.param("file"),"binary", function(error,file)
//    {
//      if (error)
//      {
//        res.writeHead(500, {"Content-Type": "text/plain" });
//        res.write(error + "\n");
//        res.end();
//      }
//      else
//      {
//        res.writeHead(200, {"Content-Type" : "application/pdf" });
//        res.write(file, "binary" );
//        res.end();
//      }
//    });
//
//  },
//  upload: function (req, res, next) {
////   var poid = req.body.poid; //lvl
//    var poid = req.body.myObj; // dragDrop upld
//
//    console.log('--AuthController req.body---------------------\n', poid,req.body)
//
//  if (req.body) {
//  console.log(JSON.stringify(req.body));
//}
//
//var data = {
//  //msg: "/files/post"
//  msg: "./api/uploads/"
//  //var target_path = './api/uploads/' + 14439+'.pdf';//req.files.thumbnail.name;
//};
//
//data.msg = Object.keys(req.files).length + " files posted";
//Object.keys(req.files).forEach(function(key) {
//  var file = req.files[key];
//  console.log('Found a file named ' + key + +' fileName',file.name,' it is ' + file.size + ' bytes'+ ' saved as  ',poid);
//  //console.log('--AuthController req.body---------------------\n', req.body)
//
//    if (file.size>0) {
//      // only 1 image
//      var tmp_path = file;
//    }
//      var target_path = './api/uploads/' + poid+'.pdf';
//
//  console.log('--tmp_path  ----------------\n', console.log('--target_path----------------\n',target_path)
//  )
//  console.log('====================================================')
//  console.log('--tmp_path path----------------\n',tmp_path.path)
//
//  console.log('--target_path----------------\n',target_path)
//
//  fs.copy(tmp_path.path, target_path, function (err) {
//        if (err) {
//          console.error(err);
//        }
//        else {
//          console.log("AuthController:upload upload success!")
//        }
//      });
//res.send(data);
//})
//  },
//
//    login: function(req, res, next) {
//        console.log('in login of AuthContoller.js ')//,req)
//
//    passport.authenticate('local', function(err, user) {
//      console.log('passport.authenticate  user:', user, err);
//      if (err) { return next(err); }
//      if (!user) { return res.send(400); }
//      req.logIn(user, function(err) {
//        console.log(' after pp ', user);
//        if (err) {
//          return next(err);
//        }
//        if (req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
//
//        User.update(user.id, {
//          online: true
//        }, function(err) {
//          if (err) return next(err);
//
//          // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
//          User.publishUpdate(user.id, {
//            online: true,
//            id: user.id,
//            username: user.username,
//            action: 'onlineChanged'
//          });
//
//          res.json(200, { 'role': user.role, 'username': user.username });
//        });
//      });
//    })(req, res, next);
//  },
//
//  logout: function(req, res, next) {
//    var oldUser = _.clone(req.user);
//    console.log('AuthController::logout ', oldUser);
//
//    req.logout();
//
//    // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged out
//    User.publishUpdate(oldUser.id, {
//      online: false,
//      id: oldUser.id,
//      username: oldUser.username,
//      action: 'onlineChanged'
//    });
//    res.send('logout successful');
//  }
//
//};
//
//
///**
// * Sails controllers expose some logic automatically via blueprints.
// *
// * Blueprints are enabled for all controllers by default, and they can be turned on or off
// * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
// * for AuthController.
// *
// * NOTE:
// *		REST and CRUD shortcut blueprints are only enabled if a matching model file
// *		(`models/Auth.js`) exists.
// *
// * NOTE:
// *		You may also override the logic and leave the routes intact by creating your own
// *		custom middleware for AuthController's `find`, `create`, `update`, and/or
// *		`destroy` actions.
// */
//
//module.exports.blueprints = {
//
//  // Expose a route for every method,
//  // e.g.
//  //	`/auth/foo` => `foo: function (req, res) {}`
//  actions: true,
//
//
//  // Expose a RESTful API, e.g.
//  //	`post /auth` => `create: function (req, res) {}`
//  rest: true,
//
//
//  // Expose simple CRUD shortcuts, e.g.
//  //	`/auth/create` => `create: function (req, res) {}`
//  // (useful for prototyping)
//  shortcuts: true
//
//};
