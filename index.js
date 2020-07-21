//imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require("body-parser");
const mysql = require("mysql2");

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
    conn.query("select user.username, user.connection from user;", function (err, results) {
        if (err) throw err;
        console.log(results);
    });
});


//server init
server.listen(3000, function () {
    console.log("Servidor corriendo en el puerto 3000");
});

//express routes
app.get('/', function (req, res) {
        res.sendFile(__dirname + '/login.html');

});

app.post("/login", function (request, response) {
    var sql = "SELECT *, SHA2(?, 256) as try  FROM exfinal_g8.user WHERE username = ?";
    var param = [request.body.password, request.body.username];
    console.log(request.body.password);
    console.log(request.body.username);
    conn.query(sql, param, function (err, jsonRespuesta) {
        if (err) {
            console.log(err);
            response.sendFile(__dirname + '/login.html');
        } else {
            console.log(jsonRespuesta.password);
            console.log(jsonRespuesta.try);
            if(jsonRespuesta[0] != null) {


                if (jsonRespuesta[0].password === jsonRespuesta[0].try) {
                    connectedUsers++;
                    users[jsonRespuesta[0].userid] = jsonRespuesta[0].username;
                    response.sendFile(__dirname + '/index.html');
                } else {
                    response.sendFile(__dirname + '/login.html');
                }
            }else {
                response.sendFile(__dirname + '/login.html');
            }
        }
    })
});



var connectedUsers = 0;
var users = {};
var Utipeando = {};

//Socket io
io.on('connection', function (socket) {


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
        if(msg.equals("chiqui") || msg.equals("crash") || msg.equals("hielo")){
        socket.disconnect;
        }
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
