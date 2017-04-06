(function() {
  'use strict';

  angular
    .module('application')
    .controller('HomeController', HomeController);


  HomeController.$inject = ['$scope', '$stateParams', '$state', '$controller', '$http', '$localstorage', 'fileReader'];
  function HomeController($scope, $stateParams, $state, $controller, $http, $localstorage, fileReader) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

    console.log("home");

    $scope.login = function() {
      console.log("click");
      if ($scope.user){
        if ($scope.user.nick && $scope.user.room){
          $scope.msg_error = "";

          $localstorage.setObject('dados.user', $scope.user);

          $state.transitionTo('board');

        } else {
          $scope.msg_error = "Elija un nick y una sala.";
        }
      } else {
        $scope.msg_error = "Elija un nick y una sala.";
      }

    }

    $scope.getFile = function () {
      $scope.progress = 0;
      fileReader.readAsDataUrl($scope.file, $scope)
                    .then(function(result) {
                        $scope.user.avatar = result;
                        // console.log($scope.user);
                    });
    };

  }

})();
