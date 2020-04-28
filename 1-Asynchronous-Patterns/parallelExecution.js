// We don't have to resolve all the promises sequentially. We can resolve 
// several promises at the same time and this is called PARALLEL EXECUTION.
// This can done use promise.all() and promise.race()


var fs = require('fs');
var { promisify } = require('util');

var writeFile = promisify(fs.writeFile);
var unlink = promisify(fs.unlink);

// readdir's callback also follows the nodejs rule of having 'error' as the first argument.
// hence we can use promisify.
var readdir = promisify(fs.readdir);

var beep = () => process.stdout.write("\x87");
var delay = (seconds) => new Promise((resolves) => {
    setTimeout(resolves, seconds*1000);
})

// We can create a single Promise that will resolve several promises at once using Promise.all
// It takes an array of Promises to be resolved.
// This code will run three asynchronous tasks(writeFile) together, WAIT FOR ALL the 
// promises to resolve,  then perform readdir and then log the results.
Promise.all([
    writeFile('readme.md', 'Hello World'),
    writeFile('readme.txt', 'Hello World'),
    writeFile('readme.json', '{ "Hello": "World" }')
]).then(() => readdir(__dirname))
  .then(console.log)


Promise.all([
    unlink('readme.md'),
    unlink('readme.txt'),
    delay(3),
    unlink('readme.json')
]).then(() => readdir(__dirname))
  .then(console.log)


// Use Promise.race() if you want to wait only for the first (earliest/fastest) 
// promise to be resolved. Here, the promise will be resolved when delay(2) is resolved
// as it will be the quickest.
Promise.race([
    delay(5),
    delay(2),
    delay(3),
    delay(5),
    unlink('readme.json')
]).then(() => readdir(__dirname))
  .then(console.log)

