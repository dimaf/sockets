const net = require(`net`);

const cluster = require(`cluster`);
const http = require(`http`);
let numCPUs = require(`os`).cpus().length;
numCPUs = 1;
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    cluster.schedulingPolicy = cluster.SCHED_RR;
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on(`exit`, (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    const server = net.createServer(c => {
        // 'connection' listener
        console.log(`${process.pid} client connected`);
        c.on("end", () => {
            console.log(`${process.pid} client disconnected`);
        });
        c.on(`error`, e => {
            console.log(`${process.pid} socket error  error`, e);
        });
        let i = 0;
        c.on(`data`, function(data) {
            //console.log(i++, data.length);
            //console.log(`message: \n` + data + `\n - end of msg.`);
        });
        c.write(`hello\r\n`);
        //c.pipe(c);
    });
    server.on(`error`, err => {
        console.log(`server error`, err);
    });
    server.listen(process.argv[2], '0.0.0.0' () => {
        console.log(`${process.pid} server bound`);
    });
    console.log(`${process.pid} started worker`);
}