'use strict';

/* globals moment */

angular.module('crmApp', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg , version);
    };
  }])
  .filter('moment', [function() {
    return function(dateString, format) {
      return moment(dateString).format(format);
    };
  }])
  .filter('checkbox', [function() {
    return function(string) {
      console.log('cb ', string);
      if (string === 'X') {
        console.log('in 1');
        return 1;
      } else {
        return 0;
      }
    };
  }])
  .filter('money', ['$filter', function($filter) {
    return function(input) {
      var output = '';
      var clean;

      if (angular.isUndefined(input)) return output;

      if (angular.isString(input)) {
        input = parseFloat(input.replace(/[$]/g, ''));
      }

      if (angular.isNumber(input)) {
        clean = parseFloat(input);
        output = (clean !== 0) ? $filter('currency')(clean) : output;
      }
      return output;
    };
  }])
  .filter('percent', [function() {
    return function(text, length, end) {
      if (text === null || text === '') text = '0';
      text = parseInt(text, 10) / 100;
      return text.toFixed(2);
    };
  }]);

