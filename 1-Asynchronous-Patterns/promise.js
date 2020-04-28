// A promise is an object that can be used to represent
// the eventual completion of an asynchronous operation.

// Just like callback functions, it is a technique to handle asynchronous events.

// In delay.js, we saw how time-outs can be used to introduce asynchronosity
// and how callbacks were used to handle them.
// Here we shall use a promise to handle asynchronosity.

// IF THE CONSOLE OUTPUT OF THIS FILE IS VERY CONFUSING, COMMENT OUT EVERY OTHER DELAY
// FUNCTION EXCEPT THE ONE THAT YOU'RE CURRENTLY CHECKING. 

var delay = (seconds, callback) => {
    setTimeout(callback, seconds*1000);
}

console.log('Starting delays');

delay(1, ()=> {
    console.log('one second(s).');
});

console.log('End first tick');

// Creating the same delay function using a promise. 
// This time, we will not pass a callback. All we need are the seconds. 
// We use a promise object to handle our callback. 
// The idea behind a Promise is that we can wait for the asynchronous operation
// to complete and then we can resolve it.
// The constructor of Promise takes two functions - resolves and rejects
// resolves is invoked once we have a successful resolution to the Promise
// and the rejects, when something goes wrong.
var delay2 = (seconds) => new Promise( (resolves, rejects) => {
    setTimeout(resolves, seconds*1000);
});

// Using the promise is slightly different. We don't have to pass a callback function.
// We can invoke the delay function. Once it's executed, the success response is passed to
// a then() function where we pass the handler function.
delay2(3).then(() => console.log('The delay has ended. Promise resolved'));


// You can also pass in data to the resolves function as shown below:
var delay3 = (seconds) => new Promise( (resolves, rejects) => {
    setTimeout( () => {
        resolves('The long delay has ended.')
    }, seconds*1000);
});

// You can receive that data in then()
delay3(4).then( (message) => console.log(message));

// You can just pass in console.log since it's a function and it takes a string as shown below:
// delay3(4).then(console.log);

// We can actually log more .then() methods which is called CHAINING
delay3(5).then(console.log).then(() => {console.log("hello world")});

// We can also return data while chaining then methods:
 delay3(6).then(console.log).then(() => 42).then((number)=>{console.log(number)});

 
 // Implementing rejects - invoked when something goes wrong. 
 // Rejects is invoked when an error is raised.
 // rejects is used for handling errors inside a Promise.
 // This is done using .catch() just like how .then() was used for 'resolves'.

var delay4 = (seconds) => new Promise( (resolves, rejects) => {
            
    // deliberately thowing an error for catch() to be executed in chaining
    throw new Error('Argh')
    
    setTimeout( () => {
        resolves('The long delay has ended.')
    }, seconds*1000);
});

delay4(7)
    .then(console.log)
    .then(() => 42)
    .then((number)=>{console.log(number)})
    .catch((error) => {console.log(`Error: ${error.message}`)});


    
// We don't necessarily need an error to invoke 'rejects' method, we can simply call 'rejects' 
// whenever we want and pass a string or an error or any value and that will invoke catch().
// Note: Here we are passing an error in rejects, but we can pass ANY VALUE as mentioned,
// even a simple string and that will invoke the .catch() method where it can be handled.
var delay5 = (seconds) => new Promise( (resolves, rejects) => {
            
    // Invoking rejects by setting a custom condition
    if (seconds < 3){
        rejects(new Error(`${seconds} is too less`));
    }
    
    setTimeout( () => {
        resolves('The long delay has ended.')
    }, seconds*1000);
});

delay5(1)
    .then(console.log)
    .then(() => 42)
    .then((number)=>{console.log(number)})
    .catch((error) => {console.log(`error: ${error.message}`)});
