// When we have to move data from source to destination - say server
// to client, we can do so using Buffers or Streams.

// USING STREAM TO TO SEND CONTENT IN CHUNKS AS HTTP RESPONSE

var fs = require('fs');
var http =  require('http');
var file = './powder-day.mp4';

http.createServer((req, res) => {

    res.writeHeader(200, { 'Content-Type': 'video/mp4' });
    
    // Remember from the Essential training (Chapter 6) that the fs.createReadStream
    // can be used for creating a stream to read data chunk by chunk/ bit by bit rather
    // than reading the whole file at once which saves a lot of memory.
    // We then pipe it to res so that it send these chunks/bits as soon as it gets them.
    fs.createReadStream(file)
        .pipe(res)
        .on('error', console.error);

}).listen(3000, () => console.log('stream - http://localhost:3000'));

// Open Activity Monitor in mac -> Memory -> search for NodeJS
// Now in console execute node --trace_gc stream.js
// trace_gc traces garbage collection on this process.
// Now open up a browser with 5 tabs, all at http://localhost:3000
// Now check the memory consumption in Activity Monitor.
// IN the console you can now only see Scavenge and no Mark-sweeps as you saw in buffer.js
// Mark-sweeps are used for big garbage collections and savenge for smaller ones. 
// In addition to that, the memory consumsion is very low around 40MB or lesser.
// Compare this with results in buffer.js mentioned as comments in the file. Ofc, you can run and see!

// THIS PROVES THAT FOR CREATING EFFICIENT APPS, STREAMS ARE ABSOLUTELY ESSENTIAL.