// Transform Streams are a special type of duplex streams.
// Instead of simply passing the data from a readable to a writeable stream,
// they transform data.

const { Transform } = require('stream');

// Creating a custom ReplaceText Transform stream.
// The implement different methods - not _read and _write
class ReplaceText extends Transform {

    constructor(char){
        super();
        this.replaceChar = char;
    }

    // instead of write, we use _transform
    _transform(chunk, encoding, callback) {
        const transformChunk = chunk.toString()
          .replace(/[a-z]|[A-Z]|[0-9]/g, this.replaceChar);
        this.push(transformChunk)
        callback();
    }
    
    
    _flush(callback) {
        this.push('more stuff is being passed...');
        callback();
     }
}

// Replacing any text with 'X'
var xStream = new ReplaceText('X');

// This will replace any character you enter in the console with 'X'
process.stdin.pipe(xStream).pipe(process.stdout);
