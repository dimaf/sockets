const net = require("net"),
  fs = require("fs");

sendFile();

function sendFile() {
  var socket = net.createConnection(8124);
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
  const readStream = fs.createReadStream(
    "C:\\Users\\khaynats\\Downloads\\rh-sso-7.2.0.GA.zip"
  );
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
