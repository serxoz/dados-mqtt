(function() {
  'use strict';

  angular
    .module('application')
    .controller('BoardController', BoardController);


  BoardController.$inject = ['$scope', '$stateParams', '$state', '$controller', '$http', '$localstorage', 'MqttClient'];
  function BoardController($scope, $stateParams, $state, $controller, $http, $localstorage, MqttClient) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

    console.log("board");

    $scope.user = $localstorage.getObject('dados.user')
    if($scope.user == false){
      $state.transitionTo('home');
    }

    //Conectar ó MQTT e esperar eventos do formulario e as resposta do broker
    var ip = "127.0.0.1";
    var port = "4000"; //MQTT over WebSockets, unencrypted
    var id = $scope.user.nick;
    var mqttuser;
    var mqttpass;

    function MqttConnect(){
      MqttClient.init(ip, port, id);
      //MqttClient.connect({userName: mqttuser, password: mqttpass, onSuccess: MqttSuccessCallback});
      MqttClient.connect({onSuccess: MqttSuccessCallback});
    }

    function MqttSuccessCallback() {
      console.log("conectado!");
      //suscribe
      var topic_tiradas = "dados/"+$scope.user.room+"/tiradas";
      var topic_resultados = "dados/"+$scope.user.room+"/resultados";
      MqttClient.subscribe(topic_resultados);

      //hello
      var message = new Paho.MQTT.Message(JSON.stringify({"action":"HELLO","user":$scope.user}));
      message.destinationName = topic_resultados; //saludamos en resultados, xa que sirve para mostrar o xogador.
      MqttClient.send(message);
    }

    function MqttSend(msg) {
      var topic_tiradas = "dados/"+$scope.user.room+"/tiradas";
      var message = new Paho.MQTT.Message(msg);
      message.destinationName = topic_tiradas;
      MqttClient.send(message);
    }


    MqttConnect();

    // Mensajes recibidos
    $scope.people = [];
    MqttClient._client.onMessageArrived = onMessageArrived;
    function onMessageArrived(message) {
      var json = JSON.parse(message.payloadString);
      console.log("onMessage:"+json.user.nick);

      //Unha persoa nova, debuxala
      if(json.action == "HELLO"){
        console.log("HELLO message arrived!");
        $scope.people.push(json.user);

        $scope.$apply(); //actualización do DOM
      }

      //Resultado de WHO, debuxar a todos


    }







  }

})();
