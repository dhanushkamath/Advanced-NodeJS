// Duplex Stream implements both a readable and writeable.
// They allow data to pass through. Readable streams will pipe data into a duplex stream,
// and the duplex streams can also write that data. They represent the middle
// section of pipelines.

const { createReadStream, createWriteStream } = require('fs');

// the most basic type of duplex stream - PassThrough
const { PassThrough, Duplex } = require('stream');

const readStream = createReadStream('./1-buffer-and-stream/powder-day.mp4')
const writeStream = createWriteStream('./copy.mp4')

const report = new PassThrough();

// To slow the stream and add a delay, we can create a custom duplex stream - Throttle.
// Since duplex is both a readable and writeable stream, we need to implements
// two methods - _read() and _write()
class Throttle extends Duplex {
    constructor(ms) {
        super();
        this.delay = ms;
    }

    _write(chunk, encoding, callback){
        this.push(chunk);
        // to add delay, use a timeout for the callback.
        setTimeout(callback, this.delay);
    }

    _read() {}

    // final means we are getting no more data from the read stream. 
    // So we need to end the write stream by pushing null.
    // Remember that pushing null ends the write stream.
    _final() {
        this.push(null);
    }
}



const throttle = new Throttle(10);

var total = 0;
// Since it is both a readable and writeable stream, it has a 'data' event.
report.on('data', (chunk) =>{
    total += chunk.length;
    console.log(`bytes: ${total}`);
})


// PassThrough can be piped between a readable and a writeable.
// They can receive data from a readStream and send that data to the writeStream
// They can be used for checking the data or reporting on the data.
// Typically, they dont modify the data, however TransformStream transforms the data which
// is covered in the next tutorial js file - 7-transport-streams.js
readStream
    .pipe(throttle)
    .pipe(report)
    .pipe(writeStream);