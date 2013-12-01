/**
 * Template
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var Q = require('q');

module.exports = {
    attributes: {
        "TemplateID": 'INTEGER',
        "AccountID": 'INTEGER',
        "VendorID": 'STRING',
        "Date": 'DATE',
        "POType": 'INTEGER',
        "Freight": 'INTEGER',
        "vendor": 'json',
        "details":'array'

    },
    getNextTemplateID: function () {
        var nid;
        var deferred = Q.defer();
        console.log('Model getNextTemplateID ')

        Template.find()
            .sort({ TemplateID: -1 })// max
            .limit(1)
            .exec(function (err, template) {
                if (err) {
                    deferred.reject(err);

                } else {
                    nid = template[0].TemplateID + 1;
                    deferred.resolve(nid);
                }
            })
        return deferred.promise;
    },
    //next and cb are equiv
    beforeCreate: function(template,next) {

        Template.getNextTemplateID()
            .then(function (nid) {
                template.TemplateID= nid
                return next(null, template);
            })
            .catch(function(err){
                console.error('er ',err)
                return next(err);
            })
    }
};
