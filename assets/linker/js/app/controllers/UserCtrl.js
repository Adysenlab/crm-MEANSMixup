'use strict';
/* jshint camelcase:false */

angular.module('crmApp')
    .controller('UserEditCtrl', ['$rootScope', '$scope', 'UserResource', '$location', '$http', '$routeParams', 'mongosailsHelper', '$resource', 'lookupCacheUser', '$log', '$q', function($rootScope, $scope, UserResource, $location, $http, $routeParams, mongosailsHelper, $resource, lookupCacheUser, $log, $q) {

        $scope.param = $routeParams.id;

        $log.debug('UserEditCtrl ', $scope.param, $routeParams.id);

        $scope.cancel = function() {
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


        if ($scope.param !== '0') {
            $scope.user = UserResource.find1({id: $scope.param}).$promise;
            $scope.user.then(function() {
                $scope.user.id = $scope.param;
            });
        } else {
            $scope.user = {};
        }

        $scope.cancel = function() {
            $location.path('/user');
        };

        $scope.save = function() {
            $log.debug('in save  ', $scope.user, $scope.param, $scope.param === 0, $scope.param === '0');
            if ($scope.param === '0') {
                UserResource.create($scope.user).$promise
                    .then(function(response) {
                        $log.debug('user:create: ', response);
                        if (response) {
                            var userPromise = lookupCacheUser.pushUser(response.data);// push created object with key and not hUser);
                        }
                    })
                    .catch(function(error) {
                        $log.debug('user:create failure', error);
                    });
            } else {
                var id = $scope.user.id;
                $log.debug('saving edited user, user.id='+id)

                UserResource.update({id: id}, $scope.user, function(success, error) {
                    if (success) {
                        var userPromise = lookupCacheUser.updateUsers($scope.user);
                    }
                });
            }


            $location.path('/user');
        };
    }])

    .controller('UserCtrl', ['$rootScope', '$scope', 'UserResource', '$location', '$modal', '$log', 'lookupCacheUser', '$q', 'socket', function($rootScope, $scope, UserResource, $location, $modal, $log, lookupCacheUser, $q, socket) {
        $log.debug('UserCtrl start');

        $scope.edit = function(user) {
            $rootScope.userid = user.id;
            $location.path('/user/' + $rootScope.userid);
            UserResource.find1(function(res) {
                $log.debug('controllerUser res ', res);

                $scope.loading = false;
            }, function(err) {
                $rootScope.error = 'Failed to fetch users.';
                $scope.loading = false;
            });
        };

        $scope.delete = function(user) {
            $log.debug('delete user  ', user, user.id);
            $scope.items = user.username + ' ' + user.id;

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
                        $log.debug('success ', success, success.data === 'success');
                        $scope.reset();
                    }
                });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.new = function(user) {
            $rootScope.userid = 0;//user.id;
            $scope.users.push({'username': 'fillname'});
            $log.debug('  controllerUser | $rootScope.userid  ', $rootScope.userid);
            $location.path('/user/' + $rootScope.userid);
            $scope.reset();
        };


        $scope.reset = function() {
            var deferred = $q.defer();
            lookupCacheUser.resetUsers();
            lookupCacheUser.getUsers()
                .then(function(cache) {
                    $scope.users = cache.data;
                    deferred.resolve();
                })
                .catch (function(err) {
                $log.error('users', err);
                deferred.reject();
            });
            return deferred.promise;
        };
        $scope.reset()
            .then(function() {

                // socket.io realtime message handler
                socket.on('message', function(message) {
                    $log.debug('socket listener: ', message);
                    var userIdx = -1;
                    var numFound = 0;
                    angular.forEach($scope.users, function(user, idx) {
                        if (user.username === message.data.username) {
                            userIdx = idx;
                            numFound += 1;
                        }
                    });

                    if (message.data.action === 'destroy' && userIdx >= 0) {
                        // delete user from list
                        $scope.users.splice(userIdx, 1);
                        $log.debug(':::deleted user', message.data, $scope.users)
                    } else if (message.data.action === 'create' && userIdx < 0) { // only create if not in list already
                        $scope.users.push(message.data);
                        $log.debug(':::added user', message.data, $scope.users)
                    } else if (message.data.action === 'update' && userIdx >= 0) {
//            angular.extend($scope.users[userIdx], message.data);
                        $log.debug(':::updating user='+userIdx, message.data, $scope.users)
                        $scope.users[userIdx] = message.data;
                        $log.debug(':::updated user='+userIdx, message.data, $scope.users)
                    } else if (message.data.action === 'onlineChanged' && userIdx >= 0) {
                        $scope.users[userIdx].online = message.data.online;
                    } else {
                        // unknown error
                        $log.error('unknown error, userIdx='+userIdx);
                    }
                });
            });

        var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
        var editrowTemplate = '<a class="icon-edit edit" href="{{\'/user/\'+row.entity.id}}"></a>';

        $scope.filterOptions = {
            filterText: '',          //filteringText
            useExternalFilter: false
        };

    }]);


// TODO: refactor this function
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



