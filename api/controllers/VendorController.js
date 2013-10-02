/**
 * VendorController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
//  see foo
//  partials: function (req,res) {
//        console.log('ven partials... ',req.param('file'));
//        res.render('partials/' + req.param('file'))
//
//    },
  sayHello: function (req, res) {
    res.send('hello world!');
  }

  , findAllWrapped: function(req, res, next) {
    console.log('VendorController::findAllWrapped... ');
    Vendor.find()
      .sort('VendorNumber ASC')
      .exec(function(err, vendors) {
        if (err) return next(err);
        return res.json({ data: vendors });
      });
  }
    // this is an overide for index which I thing is findAll
//    ,index: function (req, res, next) {
//      console.log('VendorContoller:index... ');
//        // Get an array of all users in the Vendor collection(e.g. table) sorted by VendorNumber
//        // this sort is the reason to overide default which requires no code
//        // Vendor.find(function foundVendors (err, vendors) { // this works
//      Vendor.find({ ZipCode : '10022'})
////        Vendor.find({
////            //age: 18
////            //  Vendor.find({ ZipCode : '10022'}) ZipCode does not work? needed sails-mongo drive 0.9.5
////            //ZipCode : '10022'
//////            zipcode : '10022'
////            //'ZipCode' : '10022' // this does not work
////            // 'ZipCode': { contains: '100'}
////            // 'State' : 'NY' // this works
////            //'Address': { startsWith: 'P.O'}
////            // "VendorNumber": { startsWith: '005'}
////        }).limit(100).sort('VendorNumber ASC').done(function(err, vendors) {
////                if (err) return next(err);
////                // pass the array down to the /views/vendor.ejs page
////                res.json(vendors);
////                console.log('ven Vendor... ',vendors);
////            });
//
//        Vendor.find({
//          // ZipCode : {startsWith:"100"}
//        }).sort('VendorNumber ASC').done(function(err, vendors) {
//                if (err) return next(err);
//                // pass the array down to the /views/vendor.ejs page
//                res.json(vendors);
//            console.log('Vendor.find with filter... ',vendors[0]);
//            });
//
//    }
//   ,
//find:function (req,res){
//   console.log('findall ')
//Vendor.find({VendorNumber: { '>': '0' }}).sort('VendorNumber DESC').done(function(err, allvendors) {
//        // Error handling
//        if (err) {
//            return console.log(err);
//        } else {
//            // do something else ...
//
//        }
//    })
//}
////    /* e.g.
// this is how we do a custom update
//     update:function (req, res) {
//      req. res.send('hello world!');
//  }

};
