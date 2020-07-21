//imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//configs
var app = express();
var server = http.Server(app);
var io = socketIO(server);

//server init
server.listen(3000, function () {
    console.log("Servidor corriendo en el puerto 3000");
});

//express routes
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
var conexiones = 0;
//Socket io
io.on('connection', function (socket) {
    console.log("Usuario Conectado");
    conexiones++;
    console.log("cantidad de usuarios: " + conexiones);
    io.emit("conexiones", conexiones);

    socket.on('disconnect', function () {
        console.log('Usuario Desconectado');
        conexiones--;
        console.log("cantidad de usuarios: " + conexiones);
        io.emit("conexiones", conexiones);

    });

    socket.on('chat', function (msg) {
        console.log("mensaje del cliente: " + msg);

        io.emit("mensaje recibido", msg);
    });


});

