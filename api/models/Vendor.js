/**
 * Vendor
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

    'VendorID' : 'string',
    'VendorNumber' : 'string',
    'CompanyName' : 'string',
    'Address' : 'string',
    'City' : 'string',
    'State' : 'string',
    'ZipCode' : 'string',
    'Country' : 'string',
    'Type' : 'integer',
    'CompanyAddition' : 'string',
    'Terms' : 'integer',
    'AccountID' : 'integer',
    'VendorAccountId' : 'integer',
    'contacts' : 'array'
  }

//    ,
//    find:function (req,res){
//        console.log('findall ')
//        Vendor.find({VendorNumber: { '>': '0' }}).sort('VendorNumber DESC').done(function(err, allvendors) {
//            // Error handling
//            if (err) {
//                return console.log(err);
//            } else {
//                // do something else ...
//
//            }
//        })
//    }
};
