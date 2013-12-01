'use strict';
//crmApp.Controllers.controller('UploadCtrl', ['$scope', '$http',
//  function ( $scope,  $http) {
//      console.log($file);

function UploadCtrl($scope, $http) {
  console.log('UploadCtrl ');
  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      console.log('$file ',$file);
//      $http.uploadFile({
//        url: '/uploadf', //upload.php script, node.js route, or servlet uplaod url)
//        data: {myObj: $scope.myModelObj},
//        file: $file
//      }).then(function(data, status, headers, config) {
//          // file is uploaded successfully
//            console.log(data);
//          // });
//
//          if (status.status='success') {
//             console.log ('status ',status.status);
//            //$location.path('/casprint');
//          } }).error(error);
//
//
    }
  }
};