// Import events module
const EventEmitter = require('events');

// Create emitter object
const eventEmitter = new EventEmitter();

// Register listener 1
eventEmitter.on('greet', (name) => {
    console.log(`Hello ${name}!`);
});

// Register listener 2 (multiple listeners)
eventEmitter.on('greet', (name) => {
    console.log(`Welcome to Node.js, ${name}`);
});

// Register another event
eventEmitter.on('bye', () => {
    console.log('Goodbye! See you again!');
});

// Emit events
eventEmitter.emit('greet', 'Vineetha');
eventEmitter.emit('bye');