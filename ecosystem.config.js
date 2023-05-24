module.exports = {
  apps: [
    {
      name: "ThreeVC",
      script: './index.js',
      instances: "1",
      autorestart: true,
      output: './out.log',
      error: './error.log',
      log: './combined.outerr.log',
    }
  ]
};
