const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	//console.log('New user connected');
	
	socket.emit('newMessage', generateMessage('Admin','Welcome to the chat'));

	socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));
	

	
	socket.on('createMessage', (message, callback) => {
		//console.log('createMessage', message);
		io.emit('newMessage', generateMessage(message.from, message.text));
					
/* 		socket.broadcast.emit('newMessage', generateMessage(message.from, message.text)); */

		callback();
	});	
	
	//https://www.google.com/maps?q=52.132633,5.291265999999999
	socket.on('createLocationMessage', (coords) => {
		io.emit('newlocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
	});	
	
	socket.on('disconnect', () => {
		//console.log('User was disconnected');
	});	
});




server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
