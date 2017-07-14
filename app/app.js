'use strict';

// Declare app level module which depends on views, and components
var msApp = angular.module('msApp', [
  'ngRoute',
  'ui.bootstrap',
    'elasticsearch',
    'chart.js'  ,
    'angular-d3-word-cloud'
]).
config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/visualize/', {
            templateUrl: 'partials/visualize.html',
            controller: 'VisualizeCtrl'
          }
      );
}]);
