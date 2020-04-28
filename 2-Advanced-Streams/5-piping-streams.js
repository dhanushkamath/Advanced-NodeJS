// Instead of using events for connecting read and write streams,
// we can actually use PIPING which makes our code more compact.

const { createReadStream, createWriteStream } = require('fs');

const readStream = createReadStream('./1-buffer-and-stream/powder-day.mp4');
const writeStream = createWriteStream('./copy.mp4');

// Piping our read stream to our write stream.
// We don't have to worry about wiring listeners listening for data events and the passing them on
// to the writeStream. We dont have to worry about back-pressure either.
// Pipe() automatically handles all of that. We however have to wire up an error method.
readStream.pipe(writeStream).on('error', console.error);

// ANY read stream can be piped to ANY write stream
// Piping stdin with fs.writeStream
const writeStream2 = createWriteStream('./file.txt');
process.stdin.pipe(writeStream2);

// You can also use a unix pipe ' | ' to  send data to the file by
// executing - echo "Hello World" | node 5-piping-streams.js - in 
// the terminal.

// You can also pipe the contents of a file using the unix cat command
// by executing - cat ../sample.txt | node 5-piping-streams.js - in the
// terminal.
