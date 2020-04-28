// import file system core module
var fs = require('fs');
var { promisify } = require('util');

// Remember from the NodeJS Essential training that fs.writeFile is an
// asynchronous function that takes a callback in which the first argument is error.
// So it follows the NodeJS callback rule and hence it can be wrapped with Promisify 
// and can be converted into a promise.
// Also remember that Promisify can be used only if the callback functions take an error
// as the first argument and other values are passed as the subsequent arguments.
var writeFile = promisify(fs.writeFile);

// Also remember that if your function is a single line function, no 
// curly braces are required (hence no curly braces for console.log below)
writeFile('sample.txt', 'This is a sample')
    .then(() => console.log("file successfully created"))
    .catch((error) => console.log(error));