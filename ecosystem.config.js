module.exports = {
  apps: [
    {
      name: "basedVC",
      script: './index.js',
      instances: "1",
      autorestart: true,
      output: './out.log',
      error: './error.log',
      log: './combined.outerr.log',
      env: {
        NODE_ENV: 'production', // Set NODE_ENV to production
      },
    }
  ]
};
