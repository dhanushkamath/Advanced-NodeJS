// Check out the 'PyramidOfDoom-Example.js' file to know what callback hell or
// pyramid of doom looks like. It follows a series of callbacks to ensure that the code
// get executed synchronously. Even though we achieve our purpose of making the code execute synchronously,
// it looks very untidy.

// The pyramid of doom from that file can be cleaned up using promises
// with the help of promisify.

var fs = require('fs');
var { promisify } = require('util');

// Creating a promise for fs.write and fs.unlink as its callback follows the NodeJS rule of keeping error as the first argument
var writeFile = promisify(fs.writeFile);
var unlink = promisify(fs.unlink);

// this makes the mac beep
var beep = () => process.stdout.write("\x07");

// creating a delay promise the standard way (without promisify)
// We are not handling rejects here as we are just calling the setTimeout.
var delay = (seconds) => new Promise((resolves) => {
    setTimeout(resolves, seconds*1000);
})

// REPLACING THE PYRAMID OF DOOM WITH SEQUENTIAL EXECUTION USING PROMISES.
// Instead of returning a new Promise, we invoke Promise.resolve() 
// This will create a new promise object, but automatically resolve it. 
// So we can directly wire a then() method on it since resolve() has already been invoked.
// We can then chain up multiple steps to execute sequentially using .then() methods.
// Note: when we use delay(), it returns a promise. So the next step to be executed,
// should de done with the then() method and hence we can chain it to another then() method.
// note: Remember that if we just want to invoke one function that takes the value returned by the 
// previous then method, we can simply provide the name of the method - in this case, console.log
const doStuffSequentially = () => Promise.resolve()
    .then(() => console.log('starting'))
    .then(() => delay(1))
    .then(() => 'waiting')
    .then(console.log)
    .then(() => delay(2))
    .then(() => writeFile('file.txt', 'Sample file...'))
    .then(beep)
    .then(() => 'file.txt created')
    .then(console.log)
    .then(() => delay(3))
    .then(() => unlink('file.txt'))
    .then(() => delay(3))
    .then(beep)
    .then(() => 'file.txt removed')
    .then(console.log)
    .catch((error) => console.error(error))

    // you can replace the last line with .catch(console.error) and it will work the same
    // since it is taking only one argument and it is a single line function.

// You can also chain more functions later
 doStuffSequentially()
    .then(()=>{console.log("This is chained later")});

const doStuffSequentially2 = () => Promise.resolve()
    .then(() => {console.log("hi")})
    .then(() => {console.log("my name")})
    .then(() => {console.log("is")})
    .then(() => {setTimeout(() => {
        console.log("3 seconds delay over")
    },3000)})
    .then(() => console.log("is three seconds over?"))

// doStuffSequentially2()

// Comment out doStuffSequentially() and run doStuffSequentially2() only.
// You would notice that 'is three seconds over' is logged before '3 seconds delay over', 
// even though it is chained after. Since, we are not returning a promise with 
// the setTimeout() method, the .then() function  that logs "is three seconds over?", 
// does not wait for the timeout to finish. That is, the setTimeout() introduces asynchronosity 
// and does not wait for the time delay to finish. 
// If you want sequential execution, you have to write a function that returns a Promise like the 
// delay function defined at the top. This will make the next .then() function wait for the promise to 'resolve()'.

