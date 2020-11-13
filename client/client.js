const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const args = process.argv.slice(2);
const name = args[0];
let processStatus = args[1];


socket.on('connect', (data) => {
    console.log(`Welcome ${name}!!`);
    console.log(`Your Process Status is ${processStatus}`);
    console.log();
    socket.emit('new-user-connected', {name, processStatus});
});

socket.on('warning-message', (message) => {
    console.log("WARNING! WARNING! WARNING!");
    console.log("Recieved a Message from the overlords...");
    console.log(message);
    console.log();
});

process.on('exit', () => {
    console.log('Disconnecting.... Adios...');
});

let toggle = false;
let prevState = null;
setInterval( () => {

    if(processStatus)
        console.log("Don't worry things are going fine!");
    else 
        console.log("THINGS ARE NOT FINE!");

    let rand = Math.floor(Math.random() * 100);
    if(rand <=50) {
        prevState = toggle;
        toggle = !toggle;
    }

    if(toggle && prevState !== toggle) {
        prevState = toggle;
        console.log(`Status Code: ${processStatus}`);
        console.log('Toggling the status...');
        processStatus = !processStatus;
        console.log(`Status Code: ${processStatus}`);
        console.log();
        socket.emit('process-status-change' , {name, processStatus});
    }

    console.log();
    console.log(' ============================================== ');
    console.log();
}, 5000);