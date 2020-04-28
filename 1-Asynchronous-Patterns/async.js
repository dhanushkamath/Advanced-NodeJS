// Async functions
// Apart from chaining using multiple .then() handlers, we can also execute code
// sequentially by waiting for the promise to complete. This can be done using async functions.

var fs = require('fs');
var { promisify } = require('util');

// Creating a promise for fs.write and fs.unlink as its callback follows the NodeJS rule of keep error as the first argument
var writeFile = promisify(fs.writeFile);
var unlink = promisify(fs.unlink);


// this makes the mac beep
var beep = () => process.stdout.write("\x07");

// creating a delay promise the standard way (without promisify)
// We are not handling 'rejects' here as we are just calling the setTimeout.
var delay = (seconds) => new Promise((resolves) => {
    setTimeout(resolves, seconds*1000);
})



// Modifying the doStuffSequential function from sequentialExecution.js.
// Notice that we have replaced Promise.resolve() with async function.
// We actually define a function async using an async keyword. 
// And for each function that returns a promise we use 'await' - which basically
// means 'wait for the promise to resolve'. Hence by using asynch and await we can make
// our code wait for the promises to get resolves thereby making it sequential.
const doStuffSequentially = async () => {
    console.log('starting');
    await delay(1);
    console.log('waiting');
    await delay(3);
    // Now we can handle errors with try-catch now as opposed .catch()
    try{
        await writeFile('file.txt', 'Sample file...');
        beep();
    } catch(error){
        console.error(error);
    }
    
    console.log('file.txt created');
    await delay(3);
    await unlink('file.txt');
    beep();
    console.log('file.txt removed')

    // This return statement will allow us to link more .then() methods later
    return Promise.resolve();
}

doStuffSequentially()
    .then(() => console.log("Promise returned."));
