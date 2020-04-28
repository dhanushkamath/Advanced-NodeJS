// Handling Range Requests so that video can be seeded to any point and
// also to enable Safari to play the video as safari can't accept video from a server
// without range requests.

const { createServer } = require('http');
const { stat, createReadStream } = require('fs');
const { promisify } = require('util');
const fileName = '../2-Advanced-Streams/1-buffer-and-stream/powder-day.mp4';
const fileInfo = promisify(stat);

createServer(async (req, res) => {
    const { size } = await fileInfo(fileName);
    
    // range requests are handled via the headers.
    const range = req.headers.range;
    console.log(range);
    // the first line logged is 'undefined' - this is because the browser first requests for favicon
    // favicon obviously doesn't have a range header.
    // When we request for a later part of the video, we get "bytes=0-"
    // This is the range request and we have to PARSE it.
    
    // check if there is a range request, otherwise just pass the full video.
    if(range){
        // remove the 'bytes=' using a regex and parse the two numbers separated by a hyphen.
        let [start, end] = range.replace(/bytes=/,'').split('-');
        
        // convert to integer with base-10
        start = parseInt(start, 10)

        // the end value may not always be present, so check if it's present
        // using a conditional operator. If it's not present, set it to the end of the file (-1 since indexing is from 0)
        end = end ? parseInt(end,10) : size-1;

        // HTTP-206 is partial content. This is used because we are actually sending a part of the
        // video file.
        // In content range, we provide the byte range.
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': (end-start)+1,
            'Content-Type': 'video/mp4'

        })
        // Stream a part of the video file.
        createReadStream(fileName, { start,end }).pipe(res);

    } else {
        res.writeHead(200, {
            'Content-Length': size,
            'Content-Type': 'video/mp4'
        });
        // Stream the full video file.
        createReadStream(fileName).pipe(res);
    }   
  
}).listen(3000, () => console.log('server running - 3000'));