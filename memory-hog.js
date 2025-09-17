#!/usr/bin/env node

console.log(`[PID ${process.pid}] Starting memory-intensive task...`);

// Configuration
const ARRAY_SIZE = 100_000_000; // 50 million elements
const NUM_ARRAYS = 100; // Number of large arrays to create
const COMPUTE_ITERATIONS = 1_000_000_000; // 1 billion iterations

// Memory-intensive operations
const memoryArrays = [];
console.log(`[PID ${process.pid}] Allocating ${NUM_ARRAYS} arrays with ${ARRAY_SIZE.toLocaleString()} elements each...`);

for (let i = 0; i < NUM_ARRAYS; i++) {
    const largeArray = new Array(ARRAY_SIZE);
    
    // Fill array with random numbers to actually use the memory
    for (let j = 0; j < ARRAY_SIZE; j++) {
        largeArray[j] = Math.random() * 1000;
    }
    
    memoryArrays.push(largeArray);
    
    const memUsage = process.memoryUsage();
    console.log(`[PID ${process.pid}] Array ${i + 1}/${NUM_ARRAYS} created. Memory usage: RSS=${(memUsage.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
}

// CPU-intensive operations
console.log(`[PID ${process.pid}] Starting CPU-intensive calculations (${COMPUTE_ITERATIONS.toLocaleString()} iterations)...`);

let result = 0;
const startTime = Date.now();
let lastReport = startTime;

for (let i = 0; i < COMPUTE_ITERATIONS; i++) {
    // Complex calculations to burn CPU cycles
    result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
    
    // Periodically access arrays to maintain memory pressure
    if (i % 1000000 === 0) {
        const arrayIndex = Math.floor(Math.random() * NUM_ARRAYS);
        const elementIndex = Math.floor(Math.random() * ARRAY_SIZE);
        memoryArrays[arrayIndex][elementIndex] = result;
        
        // Report progress every 5 seconds
        const now = Date.now();
        if (now - lastReport > 5000) {
            const elapsed = (now - startTime) / 1000;
            const progress = (i / COMPUTE_ITERATIONS * 100).toFixed(1);
            console.log(`[PID ${process.pid}] Progress: ${progress}% | Elapsed: ${elapsed.toFixed(1)}s | Iterations: ${i.toLocaleString()}`);
            lastReport = now;
        }
    }
}

const totalTime = (Date.now() - startTime) / 1000;
console.log(`[PID ${process.pid}] Completed in ${totalTime.toFixed(2)} seconds. Final result: ${result}`);

// Keep process alive to maintain memory usage
console.log(`[PID ${process.pid}] Keeping process alive to maintain memory pressure...`);
setInterval(() => {
    const memUsage = process.memoryUsage();
    console.log(`[PID ${process.pid}] Still running. Memory: RSS=${(memUsage.rss / 1024 / 1024).toFixed(2)}MB`);
}, 10000);