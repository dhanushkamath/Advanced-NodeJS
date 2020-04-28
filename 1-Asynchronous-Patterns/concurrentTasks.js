// Running too many tasks sequentially can take a lot of time.
// Running too many tasks in parallel can consume a lot of resources.
// Solution - use a task queue that runs a specified amount of 
// tasks concurrently in parallel.
// This combines both sequential and parallel execution.
// We use a Promise Queue that can run a specified amount of tasks at the same time.

// This is an NPM module that allows to keep the updates we want to log in the console 
// at the same place. So it overwrites logs.
// It is used for tracking the status of our tasks.
var logUpdate = require('log-update');

// It's just going to return an X. We'll represent every element in the queue with an X.
var toX = () => 'X';

var delay = (seconds) => new Promise ((resolves) => {
    setTimeout(resolves, seconds*1000);
});

// Imagine these delays are some tasks that take a certain amount of time
// given by delay
var tasks = [
    delay(4),
    delay(6),
    delay(4),
    delay(3),
    delay(5),
    delay(7),
    delay(8),
    delay(9),
    delay(10),
    delay(3),
]

// We actually have to create the PromiseQueue.
// THIS PromiseQueue will work with any array of promises.
class PromiseQueue{
    constructor(promises=[], concurrentCount=1){
        this.todo = promises;
        this.total = promises.length;
        this.concurrent = concurrentCount;
        this.running = []; // array to hold the tasks currently running
        this.complete = []; // array to hold the tasks that have completed
    }
    
    // this will tell us if we can run another task or not. It is a boolean.
    // Check if the number of tasks currently running are less than concurrentCount
    // Also check if there are any more tasks to run in todo.
    get runAnother(){
        return (this.running.length < this.concurrent) && this.todo.length;
    }

    graphTasks() {
        var { todo, running, complete } = this;
        logUpdate(`
        todo: [${todo.map(toX)}]
        running: [${running.map(toX)}]
        complete: [${complete.map(toX)}]
        `)
    }

    run() {
        while(this.runAnother){
            // remove the promise from the todo list and assign to the variable
            var promise = this.todo.shift();
            // add the promise to the running list
            this.running.push(promise);
            this.graphTasks()
            promise.then(() => {
                // once it has finished, add it to the complete list.
                this.complete.push(this.running.shift());
                this.graphTasks();
                this.graphTasks;
                this.run();
            })
            
        }
    }
}



// Using PromiseQueue
var delayQueue = new PromiseQueue(tasks, 2);
delayQueue.run()

