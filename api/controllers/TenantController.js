/**
 * TenantController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
    index: function (req, res, next) {
    console.log('user index... ');
    Tenant.find({
    }).sort('CompanyName ASC').done(function(err, tenants) {
            if (err) return next(err);
            // pass the array down to the /views/vendor.ejs page
            //res.json(users);
            res.json({data:tenants});

            console.log('tenants index after res.json... ');
        });
}

};
