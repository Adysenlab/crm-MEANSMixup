// var _ =   require('underscore')
var _und = require('underscore'),
  fs = require('fs-extra');

module.exports = {




  upload: function (req, res, next) {
    console.log('--UploadCtrl upload ctrl req.body---------------------\n', req.body)
//    var upwd = req.param('updesc', '');
//    var allfiles = '';
//    console.log('uo ', upwd);
//    console.log('req.files ', req.files)

    if (req.files.thumbnail[0] == undefined) {
      // only 1 image
      var tmp_path = req.files.thumbnail.path;
      allfiles = req.files.thumbnail.name;
      //    // set where the file should actually exists - in this case it is in the "images" directory
      //var target_path = './public/uploads/' + req.files.thumbnail.name;
      //   var target_path = './uploads/' + req.files.thumbnail.name;//C:\Node\Apps\Mas\mas-rc2\uploads
      var target_path = './api/uploads/' + req.files.thumbnail.name;//C:\Node\Apps\Mas\mas-rc2\server\uploads
      // move the file from the temporary location to the intended location
     // console.log('upload;  tmp_path ,target_path   ', req.files.thumbnail, tmp_path, target_path);
// this only works for the same drive
//  fs.rename(tmp_path, target_path, function (err) {
      fs.copy(tmp_path, target_path, function (err) {
        if (err) {
          console.error(err);
        }
        else {
          console.log("upload success1!")
          fs.unlink(tmp_path, function () {
            if (err) throw err;
          });
          res.json(200, { "status": "success"});

        }
      }); //copies file


    }
    else {
      var len = req.files.thumbnail.length;
//      console.log('# TO UPLD ', len);
      allfiles ='';
      for (var i = 0; i < len; i++) {
  //      console.log('multi ', req.files.thumbnail[i]);
        allfiles += req.files.thumbnail[i].name + ' ';
        var tmp_path = req.files.thumbnail[i].path;
        var target_path = './server/uploads/' + req.files.thumbnail[i].name;
        console.log('upload;  tmp_path ,target_path ', tmp_path, target_path);
        fs.copy(tmp_path, target_path, function (err) {
          if (err) {
            console.error(err);
          }
          else {
            console.log("upload success2!")
            res.redirect('/users');
            //res.json(200, { "status": "success"});

           // res.redirect('/upload');
//            fs.unlink(tmp_path, function () {
//              if (err) throw err;
//            });
          }
        }); //copies file

//        for (var i = 0; i < len; i++) {
//          var tmp_path = req.files.thumbnail[i].path;
//              fs.unlink(tmp_path, function () {
//              if (err) throw err;
//            });
//          }
      }
    }
    console.log("upload success3!")
   // res.json(200, { "status": "success"});

    //res.json(200, { "status": "success"} );// res.redirect('/');
//      for (var i = 0; i < len; i++) {
//        console.log('multi ', req.files.thumbnail[i]);
//
//        allfiles += req.files.thumbnail[i].name+' ';
//        var tmp_path = req.files.thumbnail[i].path;
//        fs.remove(tmp_path, function(err){
//                if (err) {
//                  console.error(err);
//                }
//                else {
//                  console.log("remove temp success!")
//                }
//              });
//        }
  }
};