module.exports = {
    apps: [
        {
            name: 'learnpharmacy-prod',
            script: 'server.js',
            instances: 'max', // Takes advantage of all CPU cores
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000
            }
        }
    ]
};
