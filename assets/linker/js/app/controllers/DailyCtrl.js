function DailyCtrl($scope, $rootScope,    $q,  $location, $routeParams,$filter) {
  console.log(' ======================================DailyCtrl=========================')

    $scope.claims = [
        {CLAIM_NO: '03-08842', name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
        {CLAIM_NO: '03-08843', name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
        {CLAIM_NO:  '03-08844', name: 'awesome user3', status: 2, group: null}
    ];

    $scope.expenses = [
        {id: 1, name: 'exp1'},
        {id: 2, name: 'exp2'},
        {id: 3, name: 'exp3'},
        {id: 4, name: 'exp4'}
    ];
    $scope.services = [
        {id: 1, name: 'status1'},
        {id: 2, name: 'status2'},
        {id: 3, name: 'status3'},
        {id: 4, name: 'status4'}
    ];


  $scope.checkName = function(data, id) {
    console.log('data ',data,id)
    if (id === '010' & data !== 'awesome') {
      return "Username 2 should be `awesome`";
    }
  };


  $scope.saveDaily = function(data, id) {
    //console.log('data ',data,id)
    angular.extend(data, {SERVICE_ID: data.SERVICE_ID},{CLAIM_NO: data.CLAIM_NO},{EXPENSE:data.EXPENSE});//
  };

    $scope.postBatch = function(data, id) {
      //  _.each({one: 1, two: 2, three: 3}, alert);
      //  _.each([{a: 1},{a: 2, a: 3}], alert);
        //        _.each([{a: 1},{a: 2, a: 3}], function(num)
        //            {
        //                alert(num.a)
        //            } );
//        _.each($scope.dailies, function(num)
//        {
//            alert(num.CLAIM_NO +' '+num.WORK_DESCRIPTION)
//        } );

        VendorResource.create(0, ($scope.vendor), function(success, error) {
            if (success) {
                console.log('create success ', success);
                //var vendorPromise = lookupCache.resetVendors();
                var vendorPromise = lookupCache.pushVendor($scope.vendor);//success);
                $location.path('/vendor');
            }
        });
    };


    $scope.dailies = [
        {DAILY_DETAIL_ID: 1, DAILY_ID_: 0, WORK_DATE: '10/15/2013', WORK_TIME: '.10', WORK_DESCRIPTION: 'Work Description pending.', SERVICE_ID:2, MILEAGE: '0', EXPENSE: 3, CLAIM_NO: '03-08842', AR_ID: "null"}

    ]


  // remove ucd
  $scope.removeUser = function(index) {
    $scope.dailies.splice(index, 1);
  };

  // add user
  $scope.addUser = function() {
    Y=$scope.dailies.length+1;
    console.log('y ',Y-2 )
    console.log('$scope.dailies ',$scope.dailies[Y-2] )
    X=$scope.dailies[Y-2].CLAIM_NO;// PICK OFF LAST ENTRY
    $scope.inserted = {
      DAILY_DETAIL_ID: Y,
      DAILY_ID_: 0,
      WORK_DATE: '10/15/2013',
      CLAIM_NO:X

  };

    $scope.dailies.push($scope.inserted);
  };

  $scope.showClaim = function(daily) {
    console.log('sele' ,daily)
     var selected = [];
    if(daily.CLAIM_NO) {
      selected = $filter('filter')($scope.claims, {CLAIM_NO: daily.CLAIM_NO});
      console.log('selected ',selected,selected[0].CLAIM_NO);//daily.CLAIM_NO);//$scope.claims,
    }
    return selected.length ? selected[0].CLAIM_NO : 'Not set';
  };
  $scope.showService = function(daily) {
      var selected = [];
    if(daily.SERVICE_ID) {
      selected = $filter('filter')($scope.services, {id: daily.SERVICE_ID});
      //console.log('selected ',daily.SERVICE_ID,selected)
    }
    return selected.length ? selected[0].name : 'Not set';
  };

  $scope.showExpesne = function(daily) {
    var selected = [];
    if(daily.EXPENSE) {
      selected = $filter('filter')($scope.expenses, {id: daily.EXPENSE});
      //console.log('selected ',daily.SERVICE_ID,selected)
    }
    return selected.length ? selected[0].name : 'Not set';
  };
  //////////////////////////////////////////////
  $scope.form = {};
  $scope.isTest = null;
  $scope.form.text = 'john';
  var dd = new Date;
  var now = new Date();

  // add one week exactly
  now.setDate(now.getDate() - 7);
  $scope.form.SET_WORK_DATE1 = now;
  $scope.form.SET_WORK_DATE2 = dd;
  $scope.form.ADJUSTER_ID = 135;
  $scope.form.SET_WORK_DATEDEF = dd;
  $scope.form.SET_WORK_DATEDEFSHORT = moment(dd).format("MM/DD/YYYY");

  $scope.postDaily = function () {
//    var rowLen = $scope.daily.length;
    console.log('postDaily rowLen  ');
//    console.log('postDaily $scope currentDaily  ', $scope.currentDaily);
//
//    masCrud.postDaily($scope.currentDaily);

  }


}
