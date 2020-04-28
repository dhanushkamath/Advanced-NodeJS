// UPLOADING FILES TO THE SERVER.

// HTTP response is a writeable stream.
// HTTP request is a readable stream.

// This Node.js app can stream the video content in the browser AND UPLOAD 
// A FILE TO THE SERVER. 

const { createServer } = require('http');
const { stat, createReadStream, createWriteStream } = require('fs');
const { promisify } = require('util');
const fileName = '../2-Advanced-Streams/1-buffer-and-stream/powder-day.mp4';
const fileInfo = promisify(stat);

// This is the same code present in 2-handling-range-requests.js but written as a function.
const respondWithVideo = async (req, res) => {
    const { size } = await fileInfo(fileName);
    const range = req.headers.range;
    if (range) {
      let [start, end] = range.replace(/bytes=/, '').split('-');
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : size - 1;
      res.writeHead(206, {
         'Content-Range': `bytes ${start}-${end}/${size}`,
         'Accept-Ranges': 'bytes',
         'Content-Length': (end-start) + 1,
         'Content-Type': 'video/mp4'
      })
      createReadStream(fileName, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': size,
        'Content-Type': 'video/mp4'
      });
      createReadStream(fileName).pipe(res);
    }
  }

// NOTICE THE FIRST TWO LINES AND THE LAST LINE in ./upload.file after uploading our text file. 
// That is a form boundary. It gives information regarding the data.
// So our content is wrapped inside and we have to parse it. This is covered
// in 4-parsing-multipart-form-data.js

createServer((req, res) => {
    
    if (req.method === 'POST'){
        // The uploaded file is displayed back and saved on the server. This can
        // be done with the same request stream, which is called FORKING.
        
        // Since req is a readable stream and res is a writeable stream. we can pipe them.
        // We are just displaying what we have uploaded.
        console.log("Enter POST")
        req.pipe(res);
        req.pipe(process.stdout);
        // FORKING - piping the same req stream to other streams.
        // Saving the content.
        req.pipe(createWriteStream('./upload.file'));
    }
    else if(req.url == '/video') {
        respondWithVideo(req,res);
    } else{
        res.writeHead(200, { 'Content-Type': 'text/html'});
        
        // Encoding of form data is in is multipart/form-data. 
        // This encoding is required for uploading files to the server.
        res.end(`
        <form enctype="multipart/form-data" method="POST" action="/">
          <input type="file" name="upload-file" />
          <button>Upload File</button>
        </form>
      `);
        }
    }).listen(3000, () => console.log('server running - 3000'));