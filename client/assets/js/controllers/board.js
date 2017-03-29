(function() {
  'use strict';

  angular
    .module('application')
    .controller('BoardController', BoardController);


  BoardController.$inject = ['$scope', '$stateParams', '$state', '$controller', '$http', '$localstorage'];
  function BoardController($scope, $stateParams, $state, $controller, $http, $localstorage) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));



  }

})();
