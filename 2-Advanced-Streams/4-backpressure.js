// Back-pressure is caused when we are sending more data
// than the amount the stream can handle at a time.
// It is kind of like water overflowing from a funnel when we 
// pour in too much at really fast pace.
// In Node.js this can be verified by analyzing memory usage. 
// Backpressure leads to higher memory consumption.

const { createReadStream, createWriteStream } = require('fs');

const readStream = createReadStream('./buffer-and-stream/powder-day.mp4');

// in writeStream we can set the amount of data the stream candle at a time,
// this is set by the highWaterMark (same as the funnel analogy - height of the funnel
// decided how much water it can handle without overflowing at a time.)
// Setting a higher value results in lesser back pressure, it is faster but consumes more memory.
// const writeStream = createWriteStream('./copy.mp4', {
//     highWaterMark: 16289
// });
const writeStream = createWriteStream('./copy.mp4')

readStream.on('data', (chunk) => {
    // our writeStream.write() method actually returns a boolean value
    // that tells us whether it can handle more data or not.
    const result = writeStream.write(chunk);
    // if it returns false, it means it is full.

    if (!result){
        console.log('backpressure')
        // pause() since we cant read more data till the data is flushed/drained.
        readStream.pause();
        // Now we listen for a 'drain' event so that we can resume() the read flow.
    }
});

writeStream.on('drain', () => {
    console.log('drained');
    readStream.resume();
})


readStream.on('error', (error) => {
    console.log('an error occurred', error.message);
});

readStream.on('end', () => {
    writeStream.end();
});

writeStream.on('close', () => {
    process.stdout.write('file copied\n');
})