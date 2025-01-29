module.exports = {
    apps: [{
      name: "kaotika-battle-server",
      script: "index.ts",
      instances: "max",
      exec_mode: "cluster",
      interpreter: "node",
      interpreter_args: "-r ts-node/register",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    }]
  };