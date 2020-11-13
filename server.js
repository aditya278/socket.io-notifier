//Express Server
const express = require('express');
const app = express();
const http = require('http');

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
    console.log('App started at Port: ', port);
})

//Socket

const io = require('socket.io')(httpServer);
const fs = require('fs');
const logPath = './logs';

const logger = (path, data) => {

    let dateTime = new Date();
    dateTime = dateTime.toLocaleDateString() + ' - ' + dateTime.toLocaleTimeString();
    data = `[${dateTime}] : ${data} \n`;

    fs.appendFile(path, data, (err) => {
        if(!err) {
            console.log();
            console.log(data);
            console.log();
        }
    })
}

const connectedUsers = {};
let userCount = 0;

io.on('connection', (socket) => {

    socket.on('new-user-connected', (userData) => {
        
        let path = logPath + `/${socket.id}`;
        let msg = "New User Connected!";
        logger(path, msg);

        connectedUsers[socket.id] = userData;

        logger(path, 'Users Name: ' + userData.name + ' & Process Status: ' + userData.processStatus);

    })

    socket.on('process-status-change', (userData) => {
        
        let path = logPath + `/${socket.id}`;
        let msg = `${userData.name}'s Process Status Changed to ${userData.processStatus}`;
        logger(path, msg);

        connectedUsers[socket.id].processStatus = userData.processStatus;
    
        if(!userData.processStatus) {
            logger(path, `Notifying ${userData.name} to keep the process running...`);
            socket.emit('warning-message', "Please keep the process running...");
        }
        
    })

    socket.on('disconnect', (message) => {
        
        let path = logPath + `/${socket.id}`;
        logger(path, `${connectedUsers[socket.id].name} disconnected!!`);
        delete connectedUsers[socket.id];
    
    })
})