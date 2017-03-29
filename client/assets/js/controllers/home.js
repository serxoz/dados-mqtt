(function() {
  'use strict';

  angular
    .module('application')
    .controller('HomeController', HomeController);


  HomeController.$inject = ['$scope', '$stateParams', '$state', '$controller', '$http', '$localstorage'];
  function HomeController($scope, $stateParams, $state, $controller, $http, $localstorage) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

    console.log("home");

    $scope.login = function() {
      console.log("click");
      if ($scope.user){
        console.log($scope.user);


      }
      //$state.transitionTo('board');
    }

  }

})();
