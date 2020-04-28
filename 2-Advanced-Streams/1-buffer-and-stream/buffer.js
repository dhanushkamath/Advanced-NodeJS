// When we have to move data from source to destination - in this case,
// the video file is the source and the http response is the destination - we can do 
// so using Buffers or Streams.

// USING BUFFER TO TO SEND CONTENT AS HTTP RESPONSE
// In a buffer, we read the whole video file into the buffer and then
// send the whole thing

var fs = require('fs');
var http =  require('http');
var file = './powder-day.mp4';

http.createServer((req, res) => {

    // Remember from the Essential training that the fs.readFile reads 
    // the entire data into a single variable (which is our buffer) 
    // and we are sending the entire data back as the response.
    fs.readFile(file, (error, data) => {
        if (error) {
            console.log('hmmmm: ', error);
        }
        res.writeHeader(200, { 'Content-Type': 'video/mp4' });
        res.end(data);
    })

}).listen(3000, () => console.log('buffer - http://localhost:3000'));

// Open Activity Monitor in mac -> Memory -> search for NodeJS
// Now in console execute node --trace_gc buffer.js
// trace_gc traces garbage collection on this process.
// Now open up a browser with 5 tabs, all at http://localhost:3000
// Now check the memory consumption in Activity Monitor. It consumed 100MB+ which is
// a lot.
// IN the console you can Mark-sweep and Scavenge. Mark-sweep will stop the node process
// to clean up the garbage and it is a much bigger deal than Scavenge.