module.exports = {
  apps: [
    {
      name: "ThreeVC",
      script: 'index.js',
      instances: "1",
      autorestart: true,
      merge_logs: false,
    }
  ]
};
