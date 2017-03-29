(function() {
  'use strict';

  angular
    .module('application')
    .controller('BoardController', BoardController);


  BoardController.$inject = ['$scope', '$stateParams', '$state', '$controller', '$http', '$localstorage'];
  function BoardController($scope, $stateParams, $state, $controller, $http, $localstorage) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

    console.log("board");

    $scope.user = $localstorage.getObject('dados.user')
    if($scope.user == false){
      $state.transitionTo('home');
    }

    //Conectar ó MQTT e esperar eventos do formulario e as resposta do broker



  }

})();
