// NodeJS is asynchronous and single threaded.

// Callback Pattern
// A callback is a block of code that is wrapped in a function to 
// be called when an asynchronous operation has completed.

// the below function masks the pattern present in the string with XX
// This is executed immediately on the current thread - it is synchronous.
// whenever we use the keyword 'return', it is referred to as direct style
// and it's synchronous.
function hideString(str) {
    return str.replace(/[a-zA-Z]/g, 'X');
}

var hidden = hideString("Hello World");

console.log( hidden );
console.log('end');

// Direct style is not the only way to return values from a function.
// Passing the values with Continuation Passing Style (CPS).
// No return statement is used, however, another function is taken as 
// argument and the return value is passed to that function.
function hideStringCPS(str, done) {
    // to make the code asynchronous, we use process.nextTick()
    // It tells nodeJs to invoke the function that is sent on the next loop
    // and not synchronously.
    // If we dont use process.nextTick(), the code will still be synchronous,
    // even though we have used a callback function.
    process.nextTick(()=> {
        done(str.replace(/[a-zA-Z]/g, 'X'));
    });
    
}

// NOTE: The sole purpose of process.nextTick is to just introduce some asynchronosity so that
// callbacks and their uses can be explained. Refer delay.js where timeout is used for introducing asynchronosity.
// Even delay.js is used for explaining the use of callbacks.
// Its functioning is mentioned in the comments above.

console.log("\n\n\n-----Begin CPS-----");

// Since the value is passed to another function, the hideStringCPS function
// doesn't return any value. Hence, we don't assign it to a variable.
// We pass in the function that takes the value that was meant to be returned
// as in the first example function above - hideString() function.
hideStringCPS("Hello world", (hidden) =>{
    console.log(hidden);
})

// You would notice 'End CPS' gets displayed before XXXXX XXXXX in console
// This is because all of our code is first executed and then the hidden string
// is logged in the next tick/loop as we have used process.nextTick()
// The process.nextTick() function executes the code inside only in the next tick, and
// we have passed the done function to handle it. That's why done fits the definition
// of a callback - a function that is executed when an asynchronous operation is completed.
// Here the process.nextTick() introduces asynchronicity.
console.log("------End CPS-----");