module.exports = {
  apps: [
    {
        name: "node-folder",
        script: "./app.js",

        // ✅ CLUSTER MODE FOR BETTER PERFORMANCE
        // exec_mode: "cluster", // Cluster mode is usually not safe if your backend uses: Socket.IO
        instances: 1,
        
        // ✅ MEMORY MANAGEMENT - Critical for production
        // Restart app if memory exceeds 500MB (prevents long-term slowdown)
        max_memory_restart: '500M',

        // ✅ AUTO RESTART SETTINGS
        autorestart: true,
        max_restarts: 10,          // Max restart attempts
        min_uptime: '10s',         // Min time before restart counts as failed
      
        // ✅ GRACEFUL SHUTDOWN
        kill_timeout: 10000,

        // ✅ ERROR & OUTPUT LOGGING
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        time: true,

        // ✅ RESTART STRATEGY - Exponential Backoff
        // PM2 will wait longer after repeated crashes.
        exp_backoff_restart_delay: 2000,
     
        // ✅ ENVIRONMENT VARIABLES
        env: {
            NODE_ENV: 'production'
        },
    }
  ]
};
