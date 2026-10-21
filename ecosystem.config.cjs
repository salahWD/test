// PM2 process definition for the standalone Next.js server on the shared VPS.
// Started by the deploy workflow with:
//   APP_NAME=itsawrapshack PORT=3060 pm2 startOrReload ecosystem.config.cjs --update-env
//
// Secrets are NOT passed through here: the standalone server loads
// <deploy dir>/.env.local itself at boot (dotenv format). Injecting them via
// PM2 with empty-string fallbacks would mask that loading — never add them.
//
// fork + 1 instance is a hard requirement, not just politeness to the shared
// box: the CMS is a single-writer SQLite database with an in-process content
// snapshot. Never switch this to cluster mode.
module.exports = {
  apps: [
    {
      name: process.env.APP_NAME || "itsawrapshack",
      // server.js sits at the root of the standalone bundle (this dir).
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      // sharp serves double duty here (upload re-encode + next/image
      // optimizer); cold-cache bursts spike well past idle.
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
        // nginx is the only public entry point
        HOSTNAME: "127.0.0.1",
        PORT: process.env.PORT || "3060",
      },
    },
  ],
};
