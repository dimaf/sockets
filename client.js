const net = require("net"),
    fs = require("fs"),
    streamBuffers = require('stream-buffers');
var crypto = require("crypto");
var aBuffer = crypto.randomBytes(1024 * 100 * 10).toString('hex');
console.log("Buffer Length ", aBuffer.length)
sendFile();
let sum = 0;
let index = 0;

function sendFile() {
    var socket = net.createConnection(process.argv[2], process.argv[3]);
    socket.once("connect", function() {
        //console.log("connected");
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
        chunkSize: 1024 * 1000 // in bytes.
    });

    // With a buffer
    readStream.put(aBuffer);
    readStream.stop();
    readStream.pipe(socket);
    readStream.on("end", () => {
        //console.log("finished reading");

        socket.end();
        socket.destroy();
        hrend = process.hrtime(hrstart);
        index++;
        sum += hrend[0] * 1000 + hrend[1] / 1000000
        if (index === 100) {
            console.log("Average last 10", sum / 10)
            sum = 0;
            index = 0;
        }
        //console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
        callback();
        //  setTimeout(() => readFile, 1);
    });
}