var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var server = require("http").Server(app);
var io = require('socket.io')(server);
server.listen(9000);

nodeMcuID = "";

var deviceState = {};
deviceState.device1 = "off"
deviceState.device2 = "off"

io.on("connection", function(socket){
    console.log("Co nguoi ket noi toi " + socket.id);
    socket.on("disconnect", function(){
        console.log(socket.id + " da ngat ket noi");
    });

    socket.on("register", function(data){
        console.log(data.content);
        nodeMcuID = socket.id;
        console.log("NodeMCU co ID la " + nodeMcuID);
    });

    socket.on("keep-connection", function(data){
        socket.emit("server-keep-connection", "keep")
    });

    socket.on("Client-send-data", function(data){
        console.log(data);
        io.sockets.emit("Server-send", "Ok man 1")
    });

    socket.on("message", function(data){
        console.log(socket.id + " vua gui " + data.content);
        io.sockets.emit("Server-send", "Ok man")
    });
    
});


app.get('/', function (req, res) {
    res.render("trangchu");
});

app.get('/deviceon1', function (req, res) {
    deviceState.device1 = "on";
    io.to(nodeMcuID).emit("Server-send", "1on")
});

app.get('/deviceon2', function (req, res) {
    deviceState.device2 = "on";
    io.to(nodeMcuID).emit("Server-send", "2on")
});

app.get('/deviceoff1', function (req, res) {
    deviceState.device1 = "on";
    io.to(nodeMcuID).emit("Server-send", "1off")
});

app.get('/deviceoff2', function (req, res) {
    deviceState.device2 = "on";
    io.to(nodeMcuID).emit("Server-send", "2off")
});


