
// WE CAN ALSO PASS DATA WITH ASYNC AS WELL.
// Using async with readdir for passing files names

var fs = require('fs');
var { promisify } = require('util');

var writeFile = promisify(fs.writeFile);
var unlink = promisify(fs.unlink);

// readdir's callback also follows the nodejs rule of having error as the first argument.
// hence we can use promisify.
var readdir = promisify(fs.readdir);

var beep = () => process.stdout.write("\x87");
var delay = (seconds) => new Promise((resolves) => {
    setTimeout(resolves, seconds*1000);
})

// Using .then() for 'resolving' the promises asynchronously.
readdir(__dirname).then((files) => {
    console.log(files);
});

// Creating an async function for resolving promises sequentially.
const start = async() => {
    
    await delay(3);

    // wait for the promise to be resolved...
    var files = await readdir(__dirname);
    
    console.log("USING ASYNC FOR SEQUENTIAL EXECUTION");
    console.log(files);
}

start()