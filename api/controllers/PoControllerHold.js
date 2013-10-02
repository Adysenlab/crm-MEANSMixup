///**
// * PoController
// *
// * @module		:: Controller
// * @description	:: Contains logic for handling requests.
// */
//
//module.exports = {
//
//  /* e.g.
//  sayHello: function (req, res) {
//    res.send('hello world!');
//  }
//  */
//
//};

/*---------------------
 :: PO
 -> controller
 ---------------------*/
var _ = require('underscore')
  , Q = require('q');

var PoController;
PoController = {
  // process the info from edit view
  create: function (req, res, next) {

 // console.log('PoController.create: ',req.params.all());
    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    //console.log('req ',req)
//    var deferred = Q.defer();
//  //var POID;
//
//  // deferred.resolve(POID = Po.getNextPONumber());
//
//
// var POID=   deferred.resolve( Po.getNextPONumber() );
//
    var nid;
    var deferred = Q.defer();
    console.log('Model getNextPONumber ')
    Po.find()
      .limit(1)
      .sort( { POID: -1 } )// max
      .exec(function(err, po) {
        if (err) {
          console.log('er ',err)
          return next(err);
        } else {
           nid  = po[0].POID+1;
          console.log('next ',nid);//po[0].POID);//,po.POID)

          return deferred.resolve(nid);

        }
      })

//  //   deferred.resolve( Po.getNextPONumber() );
//   // nid=  Po.getNextPONumber();
//    var username = req.param("POID");
//    var password = req.param("Comments");
//    console.log(' username ',username,password)
//    console.log(' req.params.all() :',req.params.all() );//,xloop[1],xloop['POID']);
//    // console.log(' req.params.toJSON() :',req.params.all().toJSON );//,xloop[1],xloop['POID']);
//
//    //  var tloop = req.params.all();
//    //  var xval = _.toArray(tloop).length;
//    //  var xloop = _.toArray(tloop);
//    //  console.log(' xloop :',xloop);//req.param('id'));//,xloop[1],xloop['POID']);
//    //  console.log(' ,xloop[2] :' ,xloop[2],xloop['POID']);
//    //  console.log(' ,xloop[poid] :' ,xloop['POID']);
//
//    //  console.log(' req.params[0]  ',   req.params.all[0]);//, req.params[0].POID);
//    // req.params.all.replace("POID",POID);
//    //Po.create( req.params.all(), function userCreated (err, user) {
//    //   req.params.all.replace("POID",nid);
//    //  req.param("POID").replace("POID",nid);
//    //  req.param("POID").value = nid;

    deferred.promise
      .then(function (results) {

        Po.create({
          POID: nid,
          Comments: req.param("Comments"),
          PONumber: nid,
          TaxPcnt: req.param("TaxPcnt"),
          AccountID : req.param("AccountID" ),
          TaxAmount: req.param("TaxAmount"),
          Freight: req.param("Freight"),
          SubTotal: req.param("SubTotal"),
          POTotal: req.param("POTotal"),
          Date :  req.param("Date"),
          POType :  req.param("POType")

        }).done(function(err, po) {
            if (err) {
              return console.log(err);
            }else {
              console.log("Po created:", po);
            }
          });

      })


  },


  updateWrapped: function (req, res, next) {
  console.log('-------------updateWrapped-------------------------------------')


    // doesnt work req.params.all.length, req.params.all().length ,req.params.all()[0]
    //_
    //console.log('PoController updateWrapped req.params.all() ',req.params.all.length, req.params.all());
    // console.log('PoController updateWrapped req.params.all() ',req.params[0]);//[0],req.params[1],req.params[2]);
    var tloop = req.params.all();
    var xval = _.toArray(tloop).length;
    //var xloop = _.toArray(tloop).slice(0, xval - 3);// take away last 3 added on fields
    var xloop = _.toArray(tloop);//.slice(0, xval - 3);// take away last 3 added on fields
    console.log(' id :',req.param('id'),xloop[18],req.params.all());

    // if id is not part of params then it does not work from controllersPO.js
//    var id= req.param('id');
//    req.params('id').delete;
    //Po.update(req.param('id'), req.params.all(), function poUpdated (err) {
       Po.update(id, req.params.all(), function poUpdated (err) {
//
//    Po.findOne(id).exec(function(err, po) {
//      // update po with params
//
//      po.save(function(err) {
//        // unless err, value has been saved
//      })
//    })

  //      Po.update(xloop[18], req.params.all(), function poUpdated (err) {
              if (err) {
        console.log(' err :',err);

        //res.redirect('/po');
        //return res.redirect('/po/edit/' + req.param('id'));
      }
      res.redirect('/po');
      //res.redirect('/po));//user/show/' + req.param('id'));
    });


//  //  Po.update(xloop, function poUpdated(err) {
//    //    Po.update(req.param('id'), xloop, function userUpdated(err) {
//            Po.update(12443, xloop, function userUpdated(err) {
//
//
//          if (err) {
//            // return res.redirect('/po/edit/' + req.param('id'));
//            console.log('err ', err)
//          }
//        })

//    console.log('tloop len:',xval,xloop);//tloop.length)
//    var ftype = '';
//    _.each(tloop, function (metadesc, key) {
//          console.log(key, ' :', metadesc)
//      }
//    );
//
//    console.log('--------------------------------------------------')
//
//    _.each(xloop, function (metadesc, key) {
//        console.log(key, ' :', metadesc)
//      }
//    );
//    console.log('--------------------------------------------------')


        //   console.log('PoController updateWrapped req.params.all() ',req.params.length, req.params.all());
        //console.log('PoController req.params.all() slice ', req.params.all.slice(1,req.params.length-3));

//    console.log('po ',Po,req.param('id'), req.params.all())
        //res.redirect('/po');
      },   stuffed : function (req, res, next) {
      console.log('PoController:stuffed... ');
      var deferred = Q.defer();
      var vendorlist;
      Vendor.find({
      }).sort('VendorNumber ASC').done(function (err, vendors) {
          if (err) {
            deferred.reject(err);
            return next(err);
          } else {
            vendorlist = vendors;//.toArray()
            //deferred.resolve(res.json(vendorlist));
            deferred.resolve(vendorlist);
            console.log('Vendor.find with filter... ', vendorlist[10]);//, res.json(vendorlist[10]));
          }
        });
      console.log('lets get pos');
      var deferredP = Q.defer();
      var polist;
      Po.find({
      }).sort('POID ASC').done(function (err, peos) {
          if (err) {
            deferredP.reject(err);
            return next(err);
          } else {
            polist = peos;//.toArray()
            //deferred.resolve(res.json(vendorlist));
            deferredP.resolve(polist);
            console.log('polist.find with filter... ', polist[10]);//, res.json(vendorlist[10]));
          }

        });
      var deferredA = Q.defer();
      var acctlist;
      Account.find({
      }).done(function (err, accts) {
          if (err) {
            deferredA.reject(err);
            return next(err);
          } else {
            acctlist = accts;//.toArray()

            deferredA.resolve(acctlist);
            console.log('Vendor.find with filter... ', acctlist[10]);//, res.json(vendorlist[10]));
          }

        });

      /**
       * The function searches over the array by certain field value,
       * and replaces occurences with the parameter provided.
       *  var vendor = _.find(vendors, function(vendor) { finds first matching vendor in list
     *  po.vendorName = vendor.CompanyName; pushes the name at end of json object

     */
      Q.all([
          deferred.promise,
          deferredP.promise ,
          deferredA.promise

        ])
        .then(function (results) {
          var vendors = results[0];
          var peos = results[1];
          var accts = results[2];
          peos.forEach(function (po) {
            var vendor = _.find(vendors, function (vendor) {
              return vendor.VendorID === po.VendorID;
            });
            if (vendor) {
              po.vendorName = vendor.CompanyName;
            } else {
              po.vendorName = 'N/A';
            }

            var acct = _.find(accts, function (acct) {
              return acct.AccountID === po.AccountID;
            });
            if (acct) {
              po.acctDesc = acct.Desc;
            } else {
              po.acctDesc = 'N/A';
            }


          });

          // return
          res.json({ data: peos });
          //res.json(peos);


        });


//
//    var map = function () {
//      var output= {vendorname:this.name.first, lastname:this.name.last , department:db.department.findOne({_id:this.department}).department}
//      emit(this._id, output);
//    };
//    Po.native(function (err,collection) {
//      //collection.find()
//      // ZipCode : {startsWith:"100"}
//      var map
//      coll
//
//    }).sort('VendorNumber ASC').done(function(err, vendors) {
//        if (err) return next(err);
//        // pass the array down to the /views/vendor.ejs page
//        res.json(vendors);
//        console.log('Vendor.find with filter... ',vendors[0]);
//      });


    }

  };
module.exports = PoController;