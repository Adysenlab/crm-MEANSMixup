'use strict';
/* jshint camelcase:false */

angular.module('crmApp')
  .controller('UserEditCtrl', ['$rootScope', '$scope', 'UserResource', '$location', '$http', '$routeParams', 'mongosailsHelper', '$resource', 'lookupCacheUser', function($rootScope, $scope, UserResource, $location, $http, $routeParams, mongosailsHelper, $resource, lookupCacheUser) {

    $scope.param = $routeParams.id;//POID;

    console.log(' UserEditCtrl ', $scope.param, $routeParams.id);

    $scope.cancel = function() {
      //var poPromise = lookupCachePO.resetPO();
      $location.path('/user');

    };
    $scope.table_properties = {
      client_status: ['Morning', 'Afternoon', 'Evening']
    };

    // 1,2,3,4

    $scope.roles = {
      role_status: ['clerk', 'user', 'supervisor', 'admin']
    };


    $scope.roles2 = [
      { name: 'clerk', id: 1},
      { name: 'user', id: 2 },
      { name: 'supervisor', id: 3 },
      { name: 'admin', id: 4 }
    ];


    if ($scope.param !== 0) {
      console.log(' before UserEditCtrl in  find1 ', $routeParams.id !== 0);
      $scope.user = UserResource.find1({id: $routeParams.id});
      console.log(' after find1   ', $scope.user);
    } else {
      console.log('new');
      $scope.user = {};

    }

    $scope.cancel = function() {
      $location.path('/user');
    };
    $scope.save = function(success, error) {
      console.log('in save  ', $scope.user, $scope.param, $scope.param === 0, $scope.param === '0');
      var hUser = {};// do a depp copy
      angular.copy($scope.user, hUser);
      if ($scope.param === 0) {

//        var s = '/user/create?username=' + $scope.user.username + '&email=' + $scope.user.email + '&password=' + $scope.user.password + '&role=' + $scope.user.role;
//        console.log(s);
//        console.log('back  ,$scope.user- ', $scope.user);
//        console.log("$scope.user.id == 'undefined' ", $routeParams.id === 0, $scope.user.id === undefined);
//        //     }
//        //   else
//        //   {
//       http://localhost:1337/user/update/522de9476b16c2383d000004?username=JOEM
//        //     var s = '/user/update?username=' + $scope.user.username + '&email=' + $scope.user.email + '&password=' + $scope.user.password + '&role='+$scope.user.role;
//        //   }
//        $http.post(s, $scope.user).success(function (status) {
//          console.log('status ', status);
//          if (status.status = 'success') {
//            console.log('status ', status.status);
//            //$location.path('/user');
//          }
//        }).error(error);

        // console.log('in sav 1');


        UserResource.create($scope.user, function(success, error) {
          //  UserResource.createDefault($scope.user, function (success, error) {
          //console.log('success, error ',success, error)
          console.log('success:create: ', success);
          if (success) {
            var userPromise = lookupCacheUser.pushUser(success.data);// push created object with key and not hUser);

          }
        });
        //   console.log('in sav 2');
//
//        var userPromise = lookupCacheUser.resetUsers();
//        userPromise.then(function (cache) {
//          $scope.users = cache.data;
//          //$scope.accountIndex = cache.combo;
//          //console.log(' $scope.account ', $scope.account)
//        })
//          .catch(function (err) {
//            console.error('users', err)
//          });
      } else {

        var id = $scope.user.id;



        UserResource.update({id: id}, $scope.user, function(success, error) {
          if (success) {
            var userPromise = lookupCacheUser.updateUsers(hUser);

          }
        });



      }


      $location.path('/user');
      //,function()   console.error('update u', $scope.user)
//      var newUser = UserResource.create({$scope.user} {
//
//      })     ;
      // UserResource.create ({id:$scope.user});//,tmp );

// Define CreditCard class
//      var CreditCard = $resource('/user/:userId/card/:cardId',
//        {userId:123, cardId:'@id'}, {
//          charge: {method:'POST', params:{charge:true}}
//        });
//      var UserResource = $resource('/user/:useraction/id/:userid',
//        {userId:'create', userid:'@id'}, {
//          charge: {method:'POST', params:{charge:true}}
//        });


//// we can create an instance as well
//      var newUser = new UserResource();
//      newUser.user = $scope.user;// newCard.name = "Mike Smith";
//      console.log()
//      newUser.$save('newUser.user ',newUser.user);
// POST: /user/123/card {number:'0123', name:'Mike Smith'}
// server returns: {id:789, number:'01234', name: 'Mike Smith'};
      //    expect(newUser.id).toEqual(789);


//        $rootScope.user=$scope.user;
//           //UserResource.create({id: $scope.id,di:$scope.miles,first:$scope.first,last:$scope.last,practice:$scope.practice,specialty:$scope.specialty}, function (res) {
//               UserResource.create({id: $scope.id}, function (res) {
//                   console.log('res ', res);//.length);//,Users);
//               $scope.dentists = res;
//               progressbar.complete();
//               $scope.loading = false;
//           }, function (err) {
//               $rootScope.error = "Failed to fetch users.";
//               $scope.loading = false;
//           });
      //$location.path(s);
      //       $location.path('/user');
    };
  }])
// $scope.posts.forEach(function(post, index) {
//if (post_id === post.id) {
//  post.$delete({user:"tjb1982",action:"delete",post_id:post.id}, function() {
//    $scope.posts.splice(index, 1);
//  });
//}

  .controller('UserCtrl', ['$rootScope', '$scope', 'UserResource', '$location', '$modal', '$log', 'lookupCacheUser' , function($rootScope, $scope, UserResource, $location, $modal, $log, lookupCacheUser) {
    console.log(' UserCtrl js home ');
    /*var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
     $scope.items = items;
     $scope.selected = {
     item: $scope.items[0]
     };
     $scope.ok = function () {
     $modalInstance.close($scope.selected.item);
     };
     $scope.cancel = function () {
     $modalInstance.dismiss('cancel');
     };
     };*/
//  $scope.items = ['item1', 'item2', 'item3'];


    $scope.edit = function(user) {
      $rootScope.userid = user.id;
      console.log('  controllerUser | $rootScope.userid  ', $rootScope.userid);
      $location.path('/user/' + $rootScope.userid);
      UserResource.find1(function(res) {
        console.log('controllerUser res ', res);

        $scope.loading = false;
      }, function(err) {
        $rootScope.error = 'Failed to fetch users.';
        $scope.loading = false;
      });
    };
// http://localhost:1337/user/destroy/522e1a34784c1d1c5d000001 manual way to delete
    $scope.delete = function(user) {
      console.log('delete user  ', user, user.id);// user[0]);//.id);
      $scope.items = user.username + ' ' + user.id;//'You are about to delete ',
      //alert( 'user  '+ user.id)
      // UserResource.destroy( {id:user.id}, user, function (success, error) {
      var modalInstance = $modal.open({
        templateUrl: '/partials/myModalContent',
        controller: ModalInstanceCtrl,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      });
      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
        UserResource.destroy({id: user.id}, function(success, error) {

          if (success) {
            console.log('success ', success, success.data === 'success');
            $scope.reset();
            //          UserResource.findAll(function (res) {
            //            console.log('res ', res);
            //            $scope.users = res.data;
            //            $scope.loading = false;
            //          }, function (err) {
            //            $rootScope.error = "Failed to fetch users.";
            //            $scope.loading = false;
            //          });



          }
        });
        //alert('Record is deleted: ' + result);

      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.new = function(user) {
      $rootScope.userid = 0;//user.id;
      $scope.users.push({'username': 'fillname'});
      console.log('  controllerUser | $rootScope.userid  ', $rootScope.userid);
      $location.path('/user/' + $rootScope.userid);
      $scope.reset();
//        UserResource.find1(function (res) {
//            console.log('controllerUser res ', res);
//
//            $scope.loading = false;
//        }, function (err) {
//            $rootScope.error = "Failed to fetch users.";
//            $scope.loading = false;
//        });
    };


    $scope.reset = function() {
      lookupCacheUser.resetUsers();
      var userPromise = lookupCacheUser.getUsers();
      userPromise.then(function(cache) {
        $scope.users = cache.data;
        //$scope.accountIndex = cache.combo;
        //console.log(' $scope.account ', $scope.account)
      })
        .catch (function(err) {
        console.error('users', err);
      });
    };
    var userPromise = lookupCacheUser.getUsers();
    userPromise.then(function(cache) {
      $scope.users = cache.data;
      //$scope.accountIndex = cache.combo;
      //console.log(' $scope.account ', $scope.account)
    })
      .catch (function(err) {
      console.error('users', err);
    });


    //$scope.users ={};
    /*
     UserResource.findAll(function (res) {
     console.log('res ', res);
     $scope.users = res;
     $scope.loading = false;
     }, function (err) {
     $rootScope.error = "Failed to fetch users.";
     $scope.loading = false;
     });
     */
    // $scope.myData = $scope.users;
    var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
    var editrowTemplate = '<a class="icon-edit edit" href="{{\'/user/\'+row.entity.id}}"></a>';
//
//
    $scope.filterOptions = {
      filterText: '',          //filteringText
      useExternalFilter: false
    };
    /*
     $scope.colDefs = [
     { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate },
     { field: 'username', displayName: 'username', groupable: false, width: 100 },
     { field: 'email', displayName: 'email', groupable: false, width: 100},
     { field: 'role', displayName: 'role', groupable: true, width: 30 },
     { field: 'title', displayName: 'title', groupable: true, width: 100 }
     ]
     $scope.gridOptions1 = {
     data: 'users',
     multiSelect: false,
     primaryKey: 'id',
     filterOptions: $scope.filterOptions,
     //  beforeSelectionChange: self.selectionchanging,
     columnDefs: 'colDefs',
     selectedItems: $scope.selections,
     enableRowReordering: false,
     showGroupPanel: true,
     showColumnMenu: true,
     maintainColumnRatios: false,
     groups: [],
     showFooter: true,
     enableColumnResize: true,
     enableColumnReordering: true
     };
     */

  }]);


// TODO: refactor this function
//Application.Controllers.controller('ModalInstanceCtrl' ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, items) {
var ModalInstanceCtrl = function($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function() {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
};
// }]);



