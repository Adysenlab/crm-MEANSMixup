'use strict'
Application.Controllers.controller('UserEditCtrl', ['$rootScope', '$scope', 'User', '$location', '$http', '$routeParams', 'mongosailsHelper',  '$resource',
    function ($rootScope, $scope, User, $location, $http, $routeParams, mongosailsHelper,$resource) {
        console.log(' UserEditCtrl ', $routeParams.id)
//
    if ($routeParams.id) {
         console.log(' before UserEditCtrl in  find1 ')
        $scope.user = User.find1({id:$routeParams.id});
        console.log(' after find1   ', $scope.user)
    }
    $scope.cancel = function(){
        $location.path('/user');
    };
    $scope.save = function(success, error) {
        console.log('in save  ', $scope.user)
        //var tmp = mongosailsHelper.deleteID($scope.user);
        ///console.log('back  - tmp ', tmp);//.id);
        console.log('back  ,$scope.user- ', $scope.user);
        //User.update ({id:$scope.user.id},tmp ); // updates json without the id
     //  User.create ({id:$scope.user});//,tmp );
   //    User.create({id: $scope.zip,di:$scope.miles,first:$scope.first,last:$scope.last,practice:$scope.practice,specialty:$scope.specialty}, function (res) {
//        $http.post('/meetings/10/11/12',   $scope.colors).success(function(status){

//            if (status.status='success') {
//                console.log ('status ',status.status);
//                //  $location.path('/froiprint');
//            } }).error(error);
//    }
       //User.create({id: $scope.zip,di:$scope.miles,first:$scope.first,last:$scope.last,practice:$scope.practice,specialty:$scope.specialty}, function (res) {
//        var s = '/user/create?username='+$scope.user.username+'&name='+$scope.user.name+'&email='+$scope.user.email+'&password='+$scope.user.password+'&role=4';//+$scope.user.role;
      var s = '/user/create?username='+$scope.user.username+'&name='+$scope.user.name+'&email='+$scope.user.email+'&password='+$scope.user.password+'&role=4';//+$scope.user.role;

      console.log(s);

       $http.post(s,   $scope.user).success(function(status){
        if (status.status='success') {
          console.log ('status ',status.status);
          //  $location.path('/froiprint');
        } }).error(error);


         //,function()
//      var newUser = User.create({$scope.user} {
//
//      })     ;
      // User.create ({id:$scope.user});//,tmp );

// Define CreditCard class
//      var CreditCard = $resource('/user/:userId/card/:cardId',
//        {userId:123, cardId:'@id'}, {
//          charge: {method:'POST', params:{charge:true}}
//        });
//      var User = $resource('/user/:useraction/id/:userid',
//        {userId:'create', userid:'@id'}, {
//          charge: {method:'POST', params:{charge:true}}
//        });


//// we can create an instance as well
//      var newUser = new User();
//      newUser.user = $scope.user;// newCard.name = "Mike Smith";
//      console.log()
//      newUser.$save('newUser.user ',newUser.user);
// POST: /user/123/card {number:'0123', name:'Mike Smith'}
// server returns: {id:789, number:'01234', name: 'Mike Smith'};
  //    expect(newUser.id).toEqual(789);










//        $rootScope.user=$scope.user;
//           //User.create({id: $scope.id,di:$scope.miles,first:$scope.first,last:$scope.last,practice:$scope.practice,specialty:$scope.specialty}, function (res) {
//               User.create({id: $scope.id}, function (res) {
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
    }]);

Application.Controllers.controller('UserCtrl', ['$rootScope', '$scope', 'User', '$location',function ($rootScope, $scope, User,$location) {
    console.log(' UserCtrl js home ')
    $scope.edit = function (user) {
        $rootScope.userid = user.id;
        console.log('  controllerUser \ $rootScope.userid  ', $rootScope.userid);
        $location.path('/user/'+ $rootScope.userid);
        User.find1(function (res) {
            console.log('controllerUser res ', res);

            $scope.loading = false;
        }, function (err) {
            $rootScope.error = "Failed to fetch users.";
            $scope.loading = false;
        });
    };

    $scope.new = function (user) {
        $rootScope.userid = 0;//user.id;
        $scope.users.push({'username':'fillname'});
        console.log('  controllerUser \ $rootScope.userid  ', $rootScope.userid);
        $location.path('/user/'+ $rootScope.userid);
//        User.find1(function (res) {
//            console.log('controllerUser res ', res);
//
//            $scope.loading = false;
//        }, function (err) {
//            $rootScope.error = "Failed to fetch users.";
//            $scope.loading = false;
//        });
    };


    User.findAll(function (res) {
        console.log('res ', res);
        $scope.users = res;
        $scope.loading = false;
    }, function (err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });
    // $scope.myData = $scope.users;
    var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
    var editrowTemplate = '<a class="icon-edit edit" href="{{\'/user/\'+row.entity.id}}"></a>';
//
//
    $scope.filterOptions = {
        filterText: '',          //filteringText
        useExternalFilter: false
    };

//    $scope.colDefs = [
//        { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate },
//        { field: 'VendorNumber', displayName: 'VendorNumber', groupable: false, width: 60 },
//        { field: 'CompanyName', displayName: 'CompanyName', groupable: false, width: 200},
//        { field: 'Address', displayName: 'Address', groupable: true, width: 200 },
//        { field: 'State', displayName: 'State', groupable: true, width: 60 },
//        { field: 'ZipCode', displayName: 'ZipCode', width: 100 },
//        //        { field: 'DateofLoss', displayName: 'Date of Loss', width: 100  }, //   cellFilter: " moment:'dddd'" hh:mm a ddd Do not display currency symbol},
//        { field: 'Country', displayName: 'Country', width: 100, groupable: true },
//        { field: 'Type', displayName: 'Type', width: 60 },
//        { field: 'CompanyAddition', displayName: 'CompanyAddition', groupable: true, width: 20},
//        { field: 'AccountID', displayName: 'AccountID', groupable: false, width: 200},
//        { field: 'VendorAccountId', displayName: 'VendorAccountId', groupable: false, width: 75},
//        { field: 'contacts', displayName: 'contacts', groupable: false, width: 75, visible: false}
//    ]

//
    $scope.colDefs = [
        { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate },
        { field: 'username', displayName: 'username' ,groupable: false, width: 100 },
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


}]);



