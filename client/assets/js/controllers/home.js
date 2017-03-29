(function() {
  'use strict';

  angular
    .module('application')
    .controller('HomeController', HomeController);


  HomeController.$inject = ['$scope', '$stateParams', '$state', '$controller', '$http', '$localstorage'];
  function HomeController($scope, $stateParams, $state, $controller, $http, $localstorage) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));



  }

})();
