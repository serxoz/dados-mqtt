(function() {
  'use strict';

  angular
    .module('application')
    .controller('HomeController', HomeController);


  HomeController.$inject = ['$scope', '$stateParams', '$state', '$controller', '$http', '$localstorage', 'fileReader'];
  function HomeController($scope, $stateParams, $state, $controller, $http, $localstorage, fileReader) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

    console.log("home");

    $scope.user = {};

    //If came from invite link
    if($stateParams.room){
      $scope.user.room = $stateParams.room;
    }

    $scope.login = function() {
      console.log("click");
      if ($scope.user){
        if ($scope.user.nick && $scope.user.room){
          $scope.msg_error = false;

          //slugify nick to use as identifier
          $scope.user.slug = "nick-"+getCleanedString($scope.user.nick);

          //encoding room name
          $scope.user.room = encodeURI($scope.user.room);

          $localstorage.setObject('dados.user', $scope.user);

          $state.transitionTo('board');

        } else {
          $scope.msg_error = true;
        }
      } else {
        $scope.msg_error = true;
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


function getCleanedString(cadena){
   // Definimos los caracteres que queremos eliminar
   var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,;.";

   // Los eliminamos todos
   for (var i = 0; i < specialChars.length; i++) {
       cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
   }

   // Lo queremos devolver limpio en minusculas
   cadena = cadena.toLowerCase();

   // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
   cadena = cadena.replace(/ /g,"-");

   // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
   cadena = cadena.replace(/á/gi,"a");
   cadena = cadena.replace(/é/gi,"e");
   cadena = cadena.replace(/í/gi,"i");
   cadena = cadena.replace(/ó/gi,"o");
   cadena = cadena.replace(/ú/gi,"u");
   cadena = cadena.replace(/ñ/gi,"n");
   return cadena;
}
