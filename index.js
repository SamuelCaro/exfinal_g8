//imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//configs
var app = express();
var server = http.Server(app);
var io = socketIO(server);



app.use(bodyParser.urlencoded({extended: true}));
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "exfinal_g8"
});

conn.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Conexión exitosa a base de datos");
    }
});





//server init
server.listen(3000, function () {
    console.log("Servidor corriendo en el puerto 3000");
});

//express routes
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var connectedUsers = 0;
var users = {};
var Utipeando = {};

//Socket io
io.on('connection', function (socket) {

    connectedUsers++;
    io.emit('connUsers', connectedUsers);

    console.log("Usuario Conectado");
    socket.on('disconnect', function () {
        connectedUsers--;
        io.emit('connUsers', connectedUsers);

        console.log('Usuario Desconectado');
    });

    socket.on('chat message', function (msg) {
        console.log("Mensaje del cliente: " + msg);
        socket.broadcast.emit('mensaje', {username: users[socket.id], msg: msg});
    });


    socket.on('username', function (username) {
        users[socket.id] = username;
        console.log(users);
    });

    socket.on('typing', function (caso) {
        Utipeando[socket.id] = {username: users[socket.id], tip: caso};
        socket.broadcast.emit('tipeando', Utipeando[socket.id]);

    });


});
