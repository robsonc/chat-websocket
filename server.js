"use strict";

/* jshint node: true */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client){

    var usernames = {};
    
    usernames[client.id] = 'Guest' + client.id;
    
    client.send('Welcome ' + usernames[client.id]);
       
    client.on('set nickname', function(nickname){
        var oldNickname = usernames[client.id];
        usernames[client.id] = nickname;
        io.emit('message', oldNickname + ' change your nickname to ' + nickname);
    });   
       
    client.on('chat message', function(msg){
        io.emit('chat message', usernames[client.id], msg);
    });
    
    client.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(80, function(){
   console.log('App listening on port 80'); 
});