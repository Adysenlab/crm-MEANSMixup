/**
 * TWO
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */
var Q = require('q');
module.exports = {

    attributes: {
        "TenantID" : 'STRING',
        "CompanyName":'STRING',
        "Description":'STRING',
        "TWOID": 'INTEGER',
        "POID": 'INTEGER',
        "AccountID": 'STRING',
        "VendorID": 'STRING',
        "Date": 'DATE',
        "POType": 'INTEGER',
        "Freight": 'INTEGER',
        "VendorInvNum": 'STRING',
        "vendor": 'json',
        "details":'array'

        // show detial meta
    },
    getNextTWOONumber: function () {
        var nid;
        var deferred = Q.defer();
        console.log('Model getNextTWONumber ')

// only return 1 deferred promise
        TWO.find()
            .sort({ TWOID: -1 })// max
            .limit(1)
            .exec(function (err, two) {
                if (err) {
                    deferred.reject(err);
                    //return next(err);
                } else {
                    nid = two[0].TWOID + 1;
                    console.log('next1 ', nid);//po[0].POID);//,po.POID)
                    deferred.resolve(nid);
                    console.log('next2 ', nid);//po[0].POID);//,po.POID)

                }

                // console.log('return getNextPONumber 2')
            })

        console.log('return getNextTWONumber 1 nid',nid)
        return deferred.promise;
        console.log('return getNextTWONumber 2 nid',nid)
    }
    ,
    //next and cb are equiv
    beforeCreate: function(two,next) {


        TWO.getNextTWOONumber()
            .then(function (nid) {
                two.TWOID= nid
                console.log('beforeCreate getNextTWONumber 1 nid',nid)
                return next(null, two);
            })
            .catch(function(err){
                console.error('er ',err)
                return next(err);
            })


    }

};
