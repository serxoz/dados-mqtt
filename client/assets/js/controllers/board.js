(function() {
  'use strict';

  angular
    .module('application')
    .controller('BoardController', BoardController);


  BoardController.$inject = ['$scope', '$stateParams', '$state', '$controller', '$http', '$localstorage', 'MqttClient', '$window', 'ModalFactory'];
  function BoardController($scope, $stateParams, $state, $controller, $http, $localstorage, MqttClient, $window, ModalFactory) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

    console.log("board");
    $scope.autoreset=true; //Autolimpieza por defecto.
    $scope.colorPickerOptions = {
      format: 'hex',
      swatchOnly: true,
      pos: 'bottom right'
    };

    $scope.user = $localstorage.getObject('dados.user')
    if($scope.user == false){
      $state.transitionTo('home');
    }
    $scope.nombre_sala = decodeURI($scope.user.room);

    //Conectar ó MQTT e esperar eventos do formulario e as resposta do broker
    // var ip = "127.0.0.1";
    var ip = "dados.tr4ck.net";
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
      //saludamos en resultados, xa que sirve para mostrar o xogador.
      var message = new Paho.MQTT.Message(JSON.stringify({"action":"HELLO","user":$scope.user}));
      message.destinationName = topic_resultados;
      MqttClient.send(message);

      //WHO
      //preguntamos quen hai, para dibuxalos
      var message = new Paho.MQTT.Message(JSON.stringify({"action":"WHO"}));
      message.destinationName = topic_resultados;
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
      // console.log("onMessage:"+json.user.nick);

      //Unha persoa nova, debuxala si non existe xa
      if(json.action == "HELLO"){
        console.log("HELLO message arrived!");

        var existe = false;
        for(var i=0; i<$scope.people.length; i++){
          if($scope.people[i].nick == json.user.nick){
            // console.log("existe");
            existe = true;
            break;
          }
        }

        if(existe == false){
          $scope.people.push(json.user);
          $scope.$apply(); //actualización do DOM
        }
      }

      //Resultado de WHO, debuxar a todos
      if(json.action == "WHO"){
        console.log("WHO message arrived!");
        //Si recibimos un WHO enviamos un HELLO
        var topic_resultados = "dados/"+$scope.user.room+"/resultados";
        var message = new Paho.MQTT.Message(JSON.stringify({"action":"HELLO","user":$scope.user}));
        message.destinationName = topic_resultados; //saludamos en resultados, xa que sirve para mostrar o xogador.
        MqttClient.send(message);
      }

      //Sale un xogador
      if(json.action == "QUIT"){
        console.log("QUIT message arrived!");
        var indice;
        for(var i=0; i<$scope.people.length; i++){
          if($scope.people[i].nick == json.user){
            // console.log("existe");
            indice = i;
            break;
          }
        }

        if(indice > -1){
          // console.log(indice);
          $scope.people.splice(indice, 1);
          $scope.$apply();
        }
      }

      //Resultado de tirada
      if(json.action == "RESULT"){
        console.log(JSON.stringify(json));
        var div_result = angular.element( document.querySelector("#"+json.slug) );

        if($scope.autoreset){
          div_result.html(''); //clean div
        }

        for (var dado in json.result){
          var tiradas = json.result[dado];
          if(tiradas.length>0){
            // console.log(tiradas);
            for (var tirada in tiradas){
              // console.log(typeof(tiradas[tirada]));
              var num = tiradas[tirada].toString();

              //for fudge dices
              if(dado=="fudge"){
                if(num == "1"){
                  num = "+"
                }
                if(num == "2"){
                  num = ""
                }
                if(num == "3"){
                  num = "-"
                }
              }

              // <i class="icon-dice-d8"></i>
              var html = '<div class="grid-content text-center" style="float: left;"><img src="assets/img/'+dado+'-resultado.png" style="width:40px;"><label style="font-size:2em; color:'+json.color+'">'+num+'</label></div>';
              // div_result.append(dado+":"+tiradas[tirada].toString()+"&nbsp;");
              div_result.append(html);
              $scope.$apply();

              if(!$scope.mute){
                var audio = new Audio('assets/audio/dado.mp3');
                audio.play();
              }

            }
          }
        }

      }

      //Cambio en el contador
      if(json.action == "COUNTER") {
        var div_result = angular.element( document.querySelector("#counter_"+json.slug) );
        if (json.active) {
          div_result.css("display", "block");
        } else {
          div_result.css("display", "none");
        }
        div_result.text(json.value);
      }

      if(json.action == "CLEAN"){
        var div_result = angular.element( document.querySelector("#"+json.slug) );
        div_result.html(''); //clean div
      }

    }

    // Controles frontend

    $scope.input = {};
    var dados = ['d4', 'd6', 'd8', 'd10', 'd100', 'd12', 'd20', 'fudge'];
    for (var i = 0; i < dados.length; i++) {
      $scope.input[dados[i]] = 0; //todos los input a 0
    }

    $scope.sumardado = function(dado){
      // console.log("sumar"+dado);
      $scope.input[dado] = $scope.input[dado]+1;
    }

    $scope.restardado = function(dado){
      // console.log("restar"+dado);
      if($scope.input[dado]>0){
        $scope.input[dado] = $scope.input[dado]-1;
      }
    }

    $scope.reset = function(){
      var div_result = angular.element( document.querySelector("#"+$scope.user.slug) );
      div_result.html(''); //clean div

      for (var i = 0; i < dados.length; i++) {
        $scope.input[dados[i]] = 0; //todos los input a 0
      }

      console.log("Send CLEAN");
      var topic_resultados = "dados/"+$scope.user.room+"/resultados";
      var message = new Paho.MQTT.Message(JSON.stringify({"action":"CLEAN",
                                                          "user":$scope.user.nick,
                                                          "slug":$scope.user.slug,
                                                          "room":$scope.user.room}));
      message.destinationName = topic_resultados; //avisamos en resultados, xa que sirve para limpar os interfaces do resto de xogadores.
      MqttClient.send(message);
    }

    $scope.roll = function(){
      //Debería mandar o array coas tiradas e o nick, para dibuxalo no seu espacio

      var dados = ['d4', 'd6', 'd8', 'd10', 'd100', 'd12', 'd20', 'fudge'];
      for (var i = 0; i < dados.length; i++) {
        //Cando o campo input tipo number ten un max e se supera estableceo como undefined.
        if( $scope.input[dados[i]] == undefined ){
          var config = {
            id: 'alert_too_much_dices',
            template: '<br><span class="alert label" style="font-size:1.3rem;">¡Está intentando lanzar demasiados dados!</span><br><br>Inténtelo de nuevo con una cantidad menor.<br>',
            animationIn: 'slideInFromTop'
          }
          $scope.modal = new ModalFactory(config);
          $scope.modal.activate();

          break;
        }
      }

      var tirada = JSON.stringify({"action":"ROLL",
                                   "user":$scope.user.nick,
                                   "slug":$scope.user.slug,
                                   "room":$scope.user.room,
                                   "dice": $scope.input,
                                   "color": $scope.dicecolor})
      console.log(tirada);

      MqttSend(tirada);
    }

    $scope.singleRoll = function(dice){
      console.log(dice);
      var dados = {"d4":0,"d6":0,"d8":0,"d10":0,"d100":0,"d12":0,"d20":0,"fudge":0};
      dados[dice] = 1;
      var tirada = JSON.stringify({"action":"ROLL",
                                   "user":$scope.user.nick,
                                   "slug":$scope.user.slug,
                                   "room":$scope.user.room,
                                   "dice": dados,
                                   "color": $scope.dicecolor})
      console.log(tirada);

      MqttSend(tirada);
    }

    $scope.onExit = function(){
      console.log("Send QUIT");
      var topic_resultados = "dados/"+$scope.user.room+"/resultados";
      var message = new Paho.MQTT.Message(JSON.stringify({"action":"QUIT",
                                                          "user":$scope.user.nick,
                                                          "slug":$scope.user.slug,
                                                          "room":$scope.user.room}));
      message.destinationName = topic_resultados; //avisamos en resultados, xa que sirve para quitar o xogador.
      MqttClient.send(message);
    };

    //click on quit button
    $scope.quit = function(){
      $scope.onExit();
      $localstorage.remove('dados.user');
      $state.transitionTo('home');
      MqttClient.disconnect();
    }

    //navigating out of board
    $scope.$on("$destroy", function(){
      console.log("Leaving!");
      $scope.quit();
    });

    //closing window
    $window.onbeforeunload =  $scope.onExit;

    // Implement counter

    $scope.counter = 0;
    $scope.counterActive = false;
    function MqttCounterQuery() {
      var counterQuery = new Paho.MQTT.Message(JSON.stringify({"action":"COUNTER",
        "user":$scope.user.nick,
        "slug":$scope.user.slug,
        "room":$scope.user.room,
        "active": $scope.counterActive,
        "value": $scope.counter
      }));

      counterQuery.destinationName = "dados/"+$scope.user.room+"/resultados";
      MqttClient.send(counterQuery);
    }
    $scope.counterActive_toggle = function () {
      MqttCounterQuery();
    }
    $scope.counter_add = function() {
      $scope.counter++;
      if ($scope.counter > 99) $scope.counter = 99;
      MqttCounterQuery();
    }
    $scope.counter_remove = function() {
      $scope.counter--;
      if ($scope.counter < 0) $scope.counter = 0;
      MqttCounterQuery();
    }

  }

})();
