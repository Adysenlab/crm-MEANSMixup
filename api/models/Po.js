/**
 * Po
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 *      name: 'STRING',
 type: 'STRING',
 expiration: 'DATE',
 quantity: 'STRING', //for sake of example, ignore that this is a string...
 percentRemaining: 'INTEGER',
 Details:'json'

 "details" : 'json'[
 {
     "_id" : ObjectId("520674291e8a8530c80c0cae"),
     "PODetailID" : 10671,
     "PONumber" : 25471,
     "ItemNumber" : 0,
     "Quantity" : 1,
     "Desc" : "SCAFFOLD MAINTENANCE FOR NOV 2012",
     "UnitPrice" : 1393.38,
     "LineItemPrice" : 0,
     "POID" : 0
       "POID" : 111128,
    "Comments" : "test bomi",
    "PONumber" : 111128,
    "TaxPcnt" : "1",
    "AccountID" : 400270,
    "TaxAmount" : "1",
    "Freight" : 1,
    "SubTotal" : "1",
    "POTotal" : "1",
    "Date" : "2013-09-11T04:00:00.000Z",
    "POType" : null,
    "createdAt" : ISODate("2013-09-17T18:34:07.991Z"),
    "updatedAt" : ISODate("2013-09-17T18:34:07.991Z"),
    "_id" : ObjectId("5238a09f8726556c39000005")
 }
 ]
 */
var Q = require('q');

module.exports = {
  attributes: {
    "POID": 'INTEGER',
    "PONumber": 'INTEGER',
    "AccountID": 'INTEGER',
    "VendorID": 'STRING',
    "Date": 'DATE',
    "POType": 'INTEGER',
    "Freight": 'INTEGER',
    "VendorInvNum": 'STRING',
    "vendor": 'json',
    "details":'array'
    // show detial meta
  },
  getNextPONumber: function () {
    var nid;
    var deferred = Q.defer();
    console.log('Model getNextPONumber ')

// only return 1 deferred promise
    Po.find()
      .sort({ POID: -1 })// max
      .limit(1)
      .exec(function (err, po) {
        if (err) {
          deferred.reject(err);
          //return next(err);
        } else {
          nid = po[0].POID + 1;
          // console.log('next ', nid);//po[0].POID);//,po.POID)
          deferred.resolve(nid);

        }

       // console.log('return getNextPONumber 2')
      })


    return deferred.promise;
    //console.log('return getNextPONumber 3 ')
  },
  //next and cb are equiv
  beforeCreate: function(po,next) {


    Po.getNextPONumber()
      .then(function (nid) {
        po.POID= nid,
          po.PONumber= nid
        return next(null, po);
      })
      .catch(function(err){
        console.error('er ',err)
        return next(err);
      })


  }

};
