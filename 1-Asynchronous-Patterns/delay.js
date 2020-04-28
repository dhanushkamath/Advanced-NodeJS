// setTimeout can also be used to introduce some asynchronicity in our code.

function delay(seconds, callback){
    setTimeout(callback, seconds*1000);
}

console.log('Starting delays');

delay(2, ()=> {
    console.log('two seconds.');
});

// we can sequentially execute delays using callbacks.
delay(2, ()=> {
    console.log('two seconds.');
    delay(1, () => {
        console.log('three seconds');
        delay(1, ()=> {
            console.log('four seconds');
        })
    })
});
// Note that both the 'two seconds' appear simultaneously as they are executed asynchronously.
// however 'three seconds' and 'four seconds' appear one after the other as they are executed sequentially.

// This code is an example of Sequential Execution of Callbacks. However, this is a REALLY BAD PRACTICE.
// It looks nasty and is called CALLBACK HELL or PYRAMID OF DOOM.