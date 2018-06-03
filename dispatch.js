var child = require('child_process').fork('proxy.js');

// Open up the server and send sockets to child
var server = require('net').createServer();

server.on('connection', function(socket) {
    console.log("Got Connection")
    child.send({
        destinationPort: process.argv[3],
        destinationHost: process.argv[4]
    }, socket);
    server.getConnections(function(err, count) {
        console.log("Connections: " + count);
    });
});
server.listen(process.argv[2]);