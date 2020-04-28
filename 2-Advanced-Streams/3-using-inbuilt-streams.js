// We can build our own readable and writeable streams but most of the time
// we'll be using already existing stream types.
// NodeJS comes with all kinds of streams - http requests and response streams,
// file system streams, zipping and unzipping, tcp sockets, stdin, stdout, stderr etc

const fs = require('fs');

const readStream = fs.createReadStream('./1-buffer-and-stream/powder-day.mp4');
const writeStream = fs.createWriteStream('./copy.mp4')

readStream.on('data', (chunk) => {
    // display the length of the chunk in the console.
    console.log('reading little chunk\n', chunk.length);
    // write the chunk of data to the file stream.
    writeStream.write(chunk);
});

readStream.on('end', () => {
    // this is used for notifying the writeStream that writing has ended.
    writeStream.end();

    console.log('read stream finished');
})

readStream.on('error', (error) => {
    console.log(`An error has occured: ${error}`);
})

// // Emitted when writing is over and writeStream is consoled.
writeStream.on('close', () => {
    console.log("file copied");
})

// stdin is a non flowing stream since it waits for data to be entered
// whereas createReadStream is flowing stream because it continuously reads the data in chunks without
// waiting for anything.

// We can convert flowing streams to non flowing streams with pause() and read()
// Now if we use read(), another chunk will be read and paused again automatically.
// if you want to fully resume i.e, convert it back to flowing stream, use resume().
// Both are demonstrated below.
readStream.pause();

process.stdin.on('data', (chunk) => {
    // Convert binary buffer to string.
    // var text = chunk.toString().trim();
    // console.log(`echo: ${text}`)

    if(chunk.toString().trim() === 'finish'){
        // resume() is used to let the flow continue fully again.
        // when we type in "finish" the whole flow resumes again, any other value,
        // only a chunk of data is read using read() given below.
        readStream.resume();
    }

    // With the help of pause(), the readStream was converted into a non-flowing stream
    // read() function can be used to read on chunk of data, rather than reading all the data chunk by 
    // chunk automatically in a flow. So now, every time there is an input given to stdin,
    // a chunk of data will be read by readStream.
    readStream.read();

})