// PARSING MULTIPART/FORM-DATA FOR EXTRACTING ACTUAL UPLOADED DATA

// This file marks the final HTTP server that we have created - It can stream video to the browser,
// handle range requests for skipping the video to another point 
// and also FOR UPLOADING FILES TO OUR SERVER.

// This is a continuation of 3-forking-and-upload-stream.js
// This covers parsing multipart/form-data to get the actual
// data we uploaded to the server. 

// HTTP response is a writeable stream.
// HTTP request is a readable stream.

// This Node.js app can stream the video content in the browser AND UPLOAD 
// A FILE TO THE SERVER. 

// we use an NPM module called multiparty to parse the multipart/form-data
const multiparty = require('multiparty');


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

createServer((req, res) => {
    
    if (req.method === 'POST'){
        // Using multiparty to parse the multipart/form-data.
        let form = new multiparty.Form();
        
        // parse the multipart/form-data. You can use it for parsing
        // form data (that users fill) as well as files (that users upload). 
        // Here we are using it only for files. Files and form fields are parsed as parts.
        // Each file is a part, each form field is a part.
        form.parse(req);

        // So, we listen for parts.
        form.on("part", (part) =>{
            // Each part we get in this callback is actually a readable stream. So we can 
            // pipe it to any write-able stream we like.
            // Since we want to save it to our directory, we use a file system writeable stream.
            // part.filename will give the filename of the original file.
            // Note: we are dynamically creating a file system writeable stream here.
            part.pipe(createWriteStream(`./${part.filename}`))
                .on('close', () =>{
                    // Send a simple HTTP response back to client saying file uploaded.
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`<h1>File uploaded: ${part.filename} </h1>`)
                })
            // Once the file is uploaded, you'll see the same file you uploaded with the same name
            // in this directory.
        })

    }
    else if(req.url == '/video') {
        respondWithVideo(req,res);
    } else{
        res.writeHead(200, { 'Content-Type': 'text/html'});
        
        // Encoding of form data is in multipart/form-data. 
        // This encoding is required for uploading files to the server.
        res.end(`
        <form enctype="multipart/form-data" method="POST" action="/">
          <input type="file" name="upload-file" />
          <button>Upload File</button>
        </form>
      `);
        }
    }).listen(3000, () => console.log('server running - 3000'));