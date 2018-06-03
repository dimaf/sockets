const net = require("net");
const server = net.createServer(c => {
    // 'connection' listener
    console.log("client connected");
    proxyConnection(c, process.argv[3], process.argv[4]);
});
server.on("error", err => {
    throw err;
});
server.listen(process.argv[2], () => {
    console.log("Proxy server bound on 8125");
});

function proxyConnection(socketIn, destinationPort, destinationHost) {
    var socketOut = net.createConnection(destinationPort, destinationHost);
    socketOut.once("connect", function() {
        console.log("proxy: connected to destination");
        socketOut.pipe(socketIn);
        socketIn.pipe(socketOut);
    });
    socketOut.on("error", e => {
        console.log("proxy: Error", e);
    });
    socketOut.on("end", () => {
        console.log("proxy: End");
    });
    socketOut.on("close", () => {
        console.log("proxy: Close");
    });
    socketIn.on("end", () => {
        console.log("socketIn:client end");
        socketOut.end();
    });
    socketIn.on("close", hadError => {
        console.log("socketIn:client close", hadError);
    });
    socketIn.on("error", e => {
        console.log("socketIn:client Error", e);
        socketOut.end();
    });
}
/*var hrstart = process.hrtime();
setInterval(() => {
    hrend = process.hrtime(hrstart);
    console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
    hrstart = process.hrtime();
}, 500);*/