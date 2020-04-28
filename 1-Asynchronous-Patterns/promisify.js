// Both promises and callbacks can be used to handle asynchronicity within JS.
// Promises make the code nicer - hence NodeJS comes with a function to convert 
// callbacks quickly into promises. 

// The NodeJS rule is that errors are always passed to the callback
// as the FIRST ARGUMENT! If there is no error, the error is set to null as shown below.
// If we structure all our callbacks like this - first argument is the error and the rest of the 
// arguments are data that we would like to pass, we can quickly convert these callbacks into Promises
// using a utility that ships with NodeJS called Promisify.
// Promisify is found in the util module which is a code module.
var { promisify } = require('util');

var delay = (seconds, callback) => {
    if (seconds > 3) {
        callback(new Error(`${seconds} seconds it too long!`));
    } else {
        setTimeout(() =>
            // Error set to null
            callback(null, `the ${seconds} second delay is over.`),
            seconds*1000
        );
    }
}

// we can wrap the function that takes callback with promisify
var promiseDelay = promisify(delay);

// now we can use it just like a Promise
promiseDelay(2)
    .then(console.log)
    .catch((error) => {
        console.log(`Error: ${error}`)
    });
