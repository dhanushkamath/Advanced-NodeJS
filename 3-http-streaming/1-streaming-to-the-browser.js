// CREATING A MEDIA STREAMING WEB SERVER


// Putting everything we've learnt to use by building
// a web server that handles upload and download stream.

// NOTE:
// 1) THIS JS FILE WILL ONLY STREAM TO GOOGLE CHROME AND NOT TO SAFARI.
// 2) In chrome, even though it plays the video, we can't seed/move the video to 
// a future point. We can't skip to a later point.
// THE REASON FOR BOTH: We need to handle RANGE REQUESTS. Safari will not play a video without RANGE REQUESTS.
// Range Requests are required to seed/move the video to a later point.
// Range Requests are covered in the next js file 2-handling-range-requests.js

const { createServer } = require('http');

// stat can be used for getting file info.
// The length of the video is then passed to the browser via the header.
const { stat, createReadStream } =require('fs');

// stat uses callback handlers, so lets convert it to a promise
const { promisify } = require('util');
const fileInfo  = promisify(stat);

// the video file
const fileName = '../2-Advanced-Streams/1-buffer-and-stream/powder-day.mp4';

// create a new web-server
// remember that req and response are streams and we can pipe them.
// Also remember that when you're piping two streams, you dont have to worry about
// back-pressure and highWaterMark (discussed in back-pressure, lesson 2)
createServer( async (req,res) => {
    const { size } = await fileInfo(fileName);
    // Since fileInfo executes asynchronously, we use await to make it execute sequentially 
    // so that the size is returned before the next line of code is executed i.e,
    // before writing the header.
    res.writeHead(200, {
        'Content-Length': size,
        'Content-Type': 'video/mp4'
    });
    // pipe the fs readable stream to the response which is a writeable stream.
    createReadStream(fileName).pipe(res);
}).listen(3000, () => {
    console.log('Server running - port: 3000')
})
