'use strict';

angular.module('speech',[]);

// Declare app level module which depends on views, and components
var msApp = angular.module('msApp', [
  'ngRoute',
  'ui.bootstrap',
    'elasticsearch',
    'chart.js'  ,
    'angular-d3-word-cloud',
    'speech'
]).
config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/visualize/', {
            templateUrl: 'partials/visualize.html',
            controller: 'VisualizeCtrl'
          }
      ).when('/search/', {
              templateUrl: 'partials/speechSearch.html',
              controller: 'SpeechSearchCtrl'});
}]);
