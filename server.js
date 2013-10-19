
var serialport = require("serialport"),			// include the serialport library
	SerialPort  = serialport.SerialPort,			// make a local instance of serial
	express = require('express'),
	app = express(),						// start Express framework
  	server = require('http').createServer(app),	// start an HTTP server
  	io = require('socket.io').listen(server),		// filter the server using socket.io
  	serialData = {},										// object to hold what goes out to the client
  	portName = process.argv[2];						// third word of the command line should be serial port name

server.listen(8080);										// listen for incoming requests on the server

console.log("Listening for new clients on port 8080");

var current_buffer = "";
function myparser(e, raw){
	var s = raw.toString();
	if(s == "A"){
		current_buffer = current_buffer.substring(2, 8);
		e.emit("data", current_buffer);
		current_buffer="";
	}else{
		current_buffer = current_buffer + s;
	}
}
var myPort = new SerialPort(portName, {
	baudrate: 9600,
	parser: myparser 
});
  
app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
	myPort.on('data', function (data) {
		serialData.value = data;
		socket.emit('serialEvent', serialData);
	});
});
