const net = require("net"),
    fs = require("fs"),
    streamBuffers = require('stream-buffers');
var crypto = require("crypto");
var aBuffer = crypto.randomBytes(1024 * 100 * 100).toString('hex');
sendFile();

function sendFile() {
    var socket = net.createConnection(process.argv[2]);
    socket.once("connect", function() {
        console.log("connected");
        readFile(socket, () => {
            sendFile();
        });
    });

    socket.addListener("data", function(data) {
        //console.log("Message: '" + data + "'");
    });
}

function readFile(socket, callback) {
    var hrstart = process.hrtime();
    var readStream = new streamBuffers.ReadableStreamBuffer({
        frequency: 1, // in milliseconds.
        chunkSize: 1024 * 100 // in bytes.
    });

    // With a buffer
    readStream.put(aBuffer);
    readStream.stop();
    readStream.pipe(socket);
    readStream.on("end", () => {
        console.log("finished reading");

        socket.end();
        hrend = process.hrtime(hrstart);
        console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
        callback();
        //  setTimeout(() => readFile, 1);
    });
}