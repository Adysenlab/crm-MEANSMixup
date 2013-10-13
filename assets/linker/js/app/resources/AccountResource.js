'use strict';

//angular.module('addicaidMeetingsApp')
//  .factory('ProfileResource', ['$resource', '$log', function($resource, $log) {
//    return $resource(
//      '/api/:action/:username', {
//        action: '@action',
//        username: '@username'
//      }, {
//        profile: {
//          method: 'GET',
//          params: { action: 'profile' }
//        }
//      });
//  }]);
angular.module('application')
.factory('Account', ['$resource', function($resource){
  return $resource(
    '/account/:action/:id',
    {action:'@action', id:'@id' },
    {
      findAll:{method:'GET',isArray:true},   // same as query
      findAllWrapped: {method: 'GET', params: { action: 'findAllWrapped'} },
      find1: {method:'GET',params: {id:'@id'}} ,
      update:{method:'PUT',params: {id:'@id'} },

      upsert:  {method:'PUT',params: {id:'@id'} }
    }
  )
}]);

//angular.module('addicaidMeetingsApp')
//  .factory('GenericApiResource', ['$resource', '$log', function($resource, $log) {
//    return $resource(
//      '/api/:action', {
//        action: '@action'
//      }, {
//        mapstyle: {
//          method: 'GET',
//          params: { action: 'mapstyle' }
//        }
//      });
//  }]);
//angular.module('addicaidMeetingsApp')
//  .factory('GeoResource', ['$resource', '$log', function($resource, $log) {
//    return $resource(
//      '/api/geo/:action', {
//        action: '@action'
//      }, {
//        geoWithin: {
//          method: 'GET',
//          params: { action: 'geoWithin' }
//        }
//      });
//  }]);
//angular.module('addicaidMeetingsApp')
//  .factory('MeetingDetailResource', ['$resource', '$log', function($resource, $log) {
//    return $resource(
//      '/api/meeting/:action', {
//        action: '@action'
//      }, {
//        detail: {
//          method: 'GET',
//          params: { action: 'detail' }
//        }
//      });
//  }]);
//
//angular.module('addicaidMeetingsApp')
//  .factory('MeetingResource', ['$resource', '$log', function($resource, $log) {
//    return $resource(
//      '/api/meeting/:meetingId/:action/:mappingId', {
//        action: '@action',
//        meetingId: '@meetingId',
//        mappingId: '@mappingId'
//      }, {
////        detail: {
////          method: 'GET',
////          params: { action: 'detail' }
////        },
//        memberAdd: {
//          method: 'POST',
//          params: {
//            action: 'membership'
//          }
//        },
//        memberDrop: {
//          method: 'DELETE',
//          params: {
//            action: 'membership'
//          }
//        },
//        favoriteAdd: {
//          method: 'POST',
//          params: {
//            action: 'favorite'
//          }
//        },
//        favoriteDrop: {
//          method: 'DELETE',
//          params: {
//            action: 'favorite'
//          }
//        },
//        commentAdd: {
//          method: 'POST',
//          params: {
//            action: 'comment'
//          }
//        },
////        commentDrop: {
////          method: 'DELETE',
////          params: {
////            action: 'comment'
////          }
////        },
//        tagAdd: {
//          method: 'POST',
//          params: {
//            action: 'tag'
//            // note: mappingId is tagid
//          }
//        },
//        tagDrop: {
//          method: 'DELETE',
//          params: {
//            action: 'tag'
//            // note: mappingId is tagid
//          }
//        }
//      });
//  }]);
