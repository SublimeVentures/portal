module.exports = {
  apps: [
    {
      name: "ThreeVC",
      script: 'index.js',
      instances: "1",
      autorestart: true,
      merge_logs: false,
    }
  ],

  deploy: {
    development: {
      // "preinstall": "npm I -g pm2",
      "start": "pm2-runtime start index.js -i 1",
      'post-deploy': 'pm2 reload ecosystem.config.js --name ThreeVC',
      'pre-setup': '',
    },
  }
};
