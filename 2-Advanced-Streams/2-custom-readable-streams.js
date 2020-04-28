// The benefits of using streams are not just limited to files,
// we can "extend" it to objects like arrays by creating
// custom readable streams.

// Readable streams read data from a source and feeds it into a pipeline
// bit by bit or chunk by chunk. 
// We can create a stream for arrays as well.

// We can pass in binary data or string data (by setting encoding) or we 
// can pass objects in ObjectMode. All of this is done with the super() call
// in the constructor. Recall that in OOP, super() calls the constructor of the 
// parent class. In our case, it calls the constructor of Readable().

const { Readable } = require('stream');

const peaks = [
    "Tallac",
    "Ralston",
    "Rubicon",
    "Twin Peaks",
    "Castle Peak",
    "Rose",
    "Freel Peak"
];

// Inheriting the Readable interface
class StreamFromArray extends Readable {
    constructor(array){
        // super () invokes the constructor of the readable stream(super class).
        
        // if you don't pass an encoding to super, it will be read as binary.
        // Hence, while logging, you'll see buffers in the console.
        // super(); 

        // For encoding the data passed as string.
        //super({ encoding: 'UTF-8'});
        
        // If it's in Object mode, you can pass any type of js object.
        super({objectMode: true});
        
        this.array = array;
        this.index = 0; // This will track the index of array at which data is to be read.
    }

    // This inherited function has to implemented. 
    // This is invoked for reading a chunk.
    _read() {
        if (this.index <= this.array.length){
            
            
            // push() is used for pushing data to the stream.
            // Use the line below for binary and string encoding mode.
            // const chunk = this.array[this.index];
            // this.push(chunk);


            // For object mode, pass an object
            const chunk = {
                data: this.array[this.index],
                index: this.index
            }
            this.push(chunk)  
              
            this.index += 1;
        } else {
            // when you push null, the "end" event is automatically emitted - it is a
            // signal to the readable stream that all the data has been read.
            this.push(null);
        }
    }
}

// Using our custom StreamFromArray class
const peakStream = new StreamFromArray(peaks);

//Remember that each time a chunk is passed, the "data" event is emitted
peakStream.on('data', (chunk) => console.log(chunk));

// Remember that once all the date has been read, it emits an "end" event.
peakStream.on('end', () => console.log('done!'))
