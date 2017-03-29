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
  console.log(message);

  var json;

  try {
    // message is Buffer
    json = JSON.parse(message.toString());
    console.log(json);
  }
  catch(err) {
    // console.log(err)
    // console.log("No JSON message");
  }

  if (typeof json !== 'undefined') {
    // Implementar acción WHO
    // así cando entre un novo, despois do HELLO mande un WHO
    // e o broker lle devolva a xente que está en ese canal



  }

})
