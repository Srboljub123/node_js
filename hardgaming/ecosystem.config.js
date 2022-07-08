module.exports = {
  apps : [{
    name: "HardGaming",
    script: "./server.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
    watch: true
  }]
}