(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'angularPaho',
    'avatar',
    'color.picker',
    'ui.sortable',
    'pascalprecht.translate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .config(['$translateProvider', function ($translateProvider) {

      $translateProvider.translations('es', {
        'NOMBRE': 'Nombre',
        'NOMBRE_SALA': 'Nombre de la sala',
        'IMAGEN': 'Selecciona una imagen para tu avatar',
        'ENTRAR': 'ENTRAR',
        'ERROR_LOGIN': 'Elija un nick y una sala',
        'SALA': 'Sala',
        'AUTOLIMPIAR': 'Autolimpiar',
        'SILENCIO': 'Silencio',
        'CONTADOR': 'Contador',
        'LIMPIAR': 'Limpiar',
        'LANZAR': 'Lanzar',
        'INVITAR': 'Invitar',
        'INVITAR_TITULO': 'Invita gente a esta sala',
        'INVITAR_TEXTO': 'Copia el siguiente enlace y compártelo',
        'SALIR': 'Salir'
      });

      $translateProvider.translations('en', {
        'NOMBRE': 'Nickname',
        'NOMBRE_SALA': 'Room name',
        'IMAGEN': 'Select an image for your avatar',
        'ENTRAR': 'ENTER',
        'ERROR_LOGIN': 'Choose a nickname and a room',
        'SALA': 'Room',
        'AUTOLIMPIAR': 'Autoclean',
        'SILENCIO': 'Silence',
        'CONTADOR': 'Counter',
        'LIMPIAR': 'Clean',
        'LANZAR': 'Roll',
        'INVITAR': 'Invite',
        'INVITAR_TITULO': 'Invite people to this room',
        'INVITAR_TEXTO': 'Copy and share this link',
        'SALIR': 'Exit'
      });

      console.log(navigator.language);
      if(navigator.language.indexOf('es') !== -1){
          $translateProvider.preferredLanguage('es');
      }else{
          $translateProvider.preferredLanguage('en');
      }
      // $translateProvider.preferredLanguage('es');
    }])
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }


  angular
    .module('application')
    .directive("ngFileSelect",function(){
      return {
        link: function($scope,el){

          el.bind("change", function(e){

            $scope.file = (e.srcElement || e.target).files[0];
            $scope.getFile();
          })
        }
      }

    })



})();
