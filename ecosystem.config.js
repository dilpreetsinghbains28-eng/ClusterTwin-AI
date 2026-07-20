module.exports = {
  apps: [
    {
      name: 'clustertwin-api',
      script: './backend/server.js',
      instances: 'max', // Run in cluster mode across all CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'clustertwin-simulator',
      script: './backend/simulators/iotSimulator.js',
      instances: 1, // Must be single instance to avoid duplicating Physics Engine calculations
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
