/**
 * Allow any authenticated user.
 */
//module.exports = function (req, res, ok) {
//
//  // User is allowed, proceed to controller
//  if (req.session.authenticated) {
//    return ok();
//  }
//
//  // User is not allowed
//  else {
//    return res.send("You are not permitted to perform this action.", 403);
//  }
//};

module.exports = function(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }else{
    return res.send(403, { message: 'Not Authorized' });
  }
}