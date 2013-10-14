'use strict'

Application.Controllers.controller('EventCtrl', ['$rootScope', '$scope', 'Event', '$location', '$http', 'Auth', 'lookupCacheEvent', '$modal', '$log', function ($rootScope, $scope, Event, $location, $http, Auth, lookupCacheEvent,  $modal, $log) {
  console.log(' VendorCtrl ')

  $scope.myData = [];
  $scope.showGrid = true;
  $scope.mySelections = [];
  $scope.navType = 'pills';


  $scope.refresh = function () {
    lookupCache.resetEvents;
  }

  var eventPromise = lookupCacheEvent.getEvents();
  eventPromise.then(function (cache) {
    console.log('eventPromise::inside lookup.then', cache)
    $scope.events = cache.data;
    console.log(' $scope.event ', $scope.events)
  });

  $scope.prevRow = '';
  $scope.selectedRow = {};
  $scope.isFormActive = false;
  $scope.toggleForm = function () {
    if ($scope.isFormActive) {
      $scope.isFormActive = false;
      return;
    }
    $scope.isFormActive = true;
    $scope.editableVendor = new Vendor();
  };

  $scope.addEvent = function () {
    $scope.editableVendor.$save();
    $scope.vendor.push($scope.editableVendor);
    $scope.toggleForm();
  };

  $scope.deleteevent = function (row) {
    Event.delete({id: $scope.selectedRow.id});
    $scope.events.splice($scope.events.indexOf($scope.selectedRow), 1);

  };


  $scope.popVendor = function (event1) {
    console.log('event  ', event1);// user[0]);//.id);
    if(event1==='new'){
      $scope.eventitem ={};
      $scope.newevent=1;
    } else
    {
      $scope.newevent=0;
    $scope.eventitem = event1;//Vendor.find1({id: $routeParams.VendorNumber});
    }
      var modalInstance = $modal.open({
      templateUrl: '/partials/myModalVendor',
      controller: ModalEventCtrl,

      resolve: {
          eventitem: function () {
          return $scope.eventitem;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      //$scope.selected = selectedItem;
      console.log('result back selectedItem',selectedItem);
      console.log('result back eventitem',$scope.eventitem);
      console.log('result back $scope.eventitem',$scope.events);


      //dont use id as a switch if (id === 0) {
      // id should not be assigned when create new
      if(  $scope.newvendor===1){
        console.log('save create ', $scope.eventitem);
        Event.create(0, ( $scope.eventitem), function (success, error) {
          if (success) {
            console.log('create success ', success,'---------',success.data);
            $scope.events.push(success.data);// this has real id
          }
        });

      } else {

          Event.update({id: $scope.eventitem.id}, $scope.eventitem, function (success, error) {
        console.log('uppdate success ', success);
        if (success) {
        }
      });
      }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.save = function () {
    angular.forEach(Object.keys($scope.events[0]), function (key) {
      //    $scope.colDefs.push({ field: key });
      console.log('key ', key);
    });
  };



    $scope.popup = function (event1) {
        console.log('event  ', event1);// user[0]);//.id);

        if(event1==='new'){
            $scope.eventitem ={};
            $scope.newevent=1;
        } else
        {
            $scope.newevent=0;
            $scope.eventitem = event1;//Vendor.find1({id: $routeParams.VendorNumber});
        }
        var modalInstance = $modal.open({
            templateUrl: '/partials/modalEvent',
            controller: ModalCtrl,

            resolve: {
                eventitem: function () {
                    return $scope.eventitem;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
            console.log('result back selectedItem',selectedItem);
            console.log('result back vendoritem',$scope.eventitem);
            console.log('result back $scope.vendor',$scope.vendor);

            //dont use id as a switch if (id === 0) {
            // id should not be assigned when create new
            if(  $scope.newevent===1){
                console.log('save create ', $scope.eventitem);
                Event.create(0, ( $scope.eventitem), function (success, error) {
                    if (success) {
                        console.log('create success ', success,'---------',success.data);
                        $scope.event.push(success.data);// this has real id
                    }
                });

            } else {
                console.log('in Event update ',$scope.eventitem)
                Event.update({id: $scope.eventitem.id}, $scope.eventitem, function (success, error) {
                    console.log('uppdate Event success ', success);
                    if (success) {
                    }
                });
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


}
]);


    var ModalCtrl = function ($scope, $modalInstance, eventitem,Event) {
console.log('ModalVendorCtrl ',eventitem)
  $scope.event = eventitem;

  $scope.ok = function () {
   $modalInstance.close($scope.event);///selected.item);
    console.log('$modalInstance ',$scope.event)
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}




