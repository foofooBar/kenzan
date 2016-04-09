'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.customer'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/customer', {
    templateUrl: 'customer/customer.html',
    controller: 'CustomerCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/customer'});
}]);
