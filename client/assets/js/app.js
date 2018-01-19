(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'angularPaho',
    'avatar',
    'color.picker',
    'ui.sortable',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
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
