class performanceMonitor {
  static async measure(fn, fnName = 'Function', iterations = 1) {
    try {
      if (typeof fn !== 'function') {
        throw new Error('First parameter must be a function');
      }

      const results = {
        functionName: fnName,
        iterations: iterations,
        measurements: [],
        summary: {}
      };

      // Run multiple iterations
      for (let i = 0; i < iterations; i++) {
        // Force garbage collection before measurement
        if (global.gc) global.gc();

        // Memory measurement
        const memStart = process.memoryUsage().heapUsed;

        // CPU measurement start
        const cpuStart = process.cpuUsage();

        // Execute the function
        const returnValue = fn();

        // CPU measurement end
        const cpuEnd = process.cpuUsage(cpuStart);

        // Memory measurement end
        if (global.gc) global.gc();
        const memEnd = process.memoryUsage().heapUsed;

        const measurement = {
          iteration: i + 1,
          memoryUsedKB: (memEnd - memStart) / 1024,
          cpuTimeMs: (cpuEnd.user / 1000).toFixed(4),
          result: returnValue
        };

        results.measurements.push(measurement);
      }

      // Calculate summary statistics
      const memValues = results.measurements.map(m => m.memoryUsedKB);
      const cpuValues = results.measurements.map(m => parseFloat(m.cpuTimeMs));

      results.summary = {
        "Memory": `Min: ${Math.min(...memValues).toFixed(2)} KB ---- Max: ${Math.max(...memValues).toFixed(2)} KB ---- Avg: ${(memValues.reduce((a, b) => a + b, 0) / memValues.length).toFixed(2)} KB`,
        "CPU": `Min: ${Math.min(...cpuValues).toFixed(4)} ms ---- Max: ${Math.max(...cpuValues).toFixed(4)} ms ---- Avg: ${(cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length).toFixed(4)} ms`,
        "Memory_Used": `${(memValues.reduce((a, b) => a + b, 0) / memValues.length).toFixed(4)} KB`,
        "CPU_Time": `${(cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length).toFixed(4)} ms`
      };

      console.log(`${fnName} : `, results.summary);

      return results;
    } catch (error) {
      return {
        error: error.message
      };
    }
  }
}

module.exports = performanceMonitor;
