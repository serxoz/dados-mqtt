// Server
var mosca = require('mosca');
var http = require('http');

var moscaSettings = {
  port: 1883,
  persistence: mosca.persistence.Memory,
  http: {
    port: 4000,
    bundle: true,
    static: './'
  }
};

var server = new mosca.Server(moscaSettings, function() {
  console.log('Mosca server is up and running')
});

function setup() {

}

server.on('ready', setup);

server.on('clientConnected', function(client) {
	console.log('client connected', client.id);
});

server.on('clientDisconnected', function(client) {
  console.log('Client Disconnected:', client.id);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Control Client
// Subscribe to global topic and react to their messages
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost');

client.on('connect', function () {
  client.subscribe('#')
})

client.on('message', function (topic, message) {
  // console.log(message);

  var json;

  try {
    // message is Buffer
    json = JSON.parse(message.toString());
    // console.log(json);
  }
  catch(err) {
    // console.log(err)
    // console.log("No JSON message");
  }

  if (typeof json !== 'undefined') {
    //tiradas
    if(json["action"] == "ROLL" && Object.keys(json).length > 1){
      var resposta = {};
      resposta.action = "RESULT";
      resposta.user = json.user;
      resposta.room = json.room;
      resposta.result = {};

      for (dice in json.dice){
        if(dice=="fudge"){
          resposta.result["fudge"]=[];
          for(var i = 0; i<json.dice.fudge;i++){
            resposta.result["fudge"].push(Math.floor(Math.random() * 3) + 1);
          }
        } else {
          resposta.result[dice]=[];
          for(var i = 0; i<json.dice[dice]; i++){
            var max = dice.split("d")[1];
            resposta.result[dice].push(Math.floor(Math.random() * 3) + 1);
          }
        }
      }

      var topic = "dados/"+resposta.room+"/resultados";
      client.publish(topic, JSON.stringify(resposta));
      console.log(JSON.stringify(resposta));
      console.log(topic);
    }

  }

})
