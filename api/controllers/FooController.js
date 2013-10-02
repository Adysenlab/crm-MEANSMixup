/**
 * FooController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.

 exports.partials = function (req, res) {
    console.log('export.partials, user:', req.session.user_id);
     var name = req.params.name;
     res.render('partials/' + name,{username: req.session.user_id});
};
 */

module.exports = {

  //* e.g. all partials get called here
    partials: function (req,res) {
        console.log('partials... ',req.param('file'));
        res.render('partials/' + req.param('file'))
    },
    test: function (req,res) {

        console.log('test.shows how to pass param from partial.. ',req.param('lat') +'/'+ req.param('lng')+'/'+ req.param('radius'));//:lat/:lng/:radius'
       //req.body,
       //   res.send('<h1>say hello world!</h1><p>'+req.param('lat') + req.param('lng')+ req.param('radius')+'</p>');//  res.render('partials/' + req.param('file'))
        res.json(200, { "status": "success"} );


    },
    test2: function (req,res) {

        console.log('test2.shows how to pass params.. ',req.param('lat') + req.param('lng')+ req.param('radius'));//:lat/:lng/:radius'
        res.send('<h1>say hello world2!</h1><p>'+req.param('lat') + req.param('lng')+ req.param('radius')+'</p>');//  res.render('partials/' + req.param('file'))
    }
};