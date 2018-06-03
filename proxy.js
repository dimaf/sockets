const net = require("net");
let i = 0;
if (process.argv.length > 3) {
    const server = net.createServer(c => {
        // 'connection' listener
        i++;
        console.log("client connected", i);
        proxyConnection(c, process.argv[3], process.argv[4], i);
    });
    server.on("error", err => {
        throw err;
    });
    server.listen(process.argv[2], () => {
        console.log("Proxy server bound on 8125");
    });
}

process.on('message', function(message, socket) {
    console.log("Received message", message);
    i++
    proxyConnection(socket, message.destinationPort, message.destinationHost, i)
});

function proxyConnection(socketIn, destinationPort, destinationHost, index) {

    var socketOut = net.createConnection(destinationPort, destinationHost);
    socketOut.once("connect", function() {
        console.log("proxy: connected to ", destinationHost, destinationPort, index);
        socketOut.pipe(socketIn);
        socketIn.pipe(socketOut);
    });
    socketOut.on("error", e => {
        console.log("proxy: Error", index, e);
    });
    socketOut.on("end", () => {
        console.log("proxy: End", index);
    });
    socketOut.on("close", () => {
        console.log("proxy: Close", index);
    });
    socketIn.on("end", () => {
        console.log("socketIn:client end", index);
        socketOut.end();
    });
    socketIn.on("close", hadError => {
        console.log("socketIn:client close", hadError, index);
    });
    socketIn.on("error", e => {
        console.log("socketIn:client Error", e, index);
        socketOut.end();
    });
}
/*var hrstart = process.hrtime();
setInterval(() => {
    hrend = process.hrtime(hrstart);
    console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
    hrstart = process.hrtime();
}, 500);*/