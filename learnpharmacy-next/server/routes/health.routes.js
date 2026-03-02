const express = require('express');
const router = express.Router();
const pool = require('../db');
const os = require('os');

/**
 * Basic health check
 * GET /api/health
 */
router.get('/', async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        environment: process.env.NODE_ENV || 'development'
    };

    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        healthcheck.message = error.message;
        res.status(503).json(healthcheck);
    }
});

/**
 * Detailed health check (database, memory, etc.)
 * GET /api/health/detailed
 */
router.get('/detailed', async (req, res) => {
    const checks = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        status: 'healthy'
    };

    // Check database connection
    try {
        await pool.query('SELECT 1');
        checks.database = { status: 'connected' };
    } catch (error) {
        checks.database = { status: 'error', message: error.message };
        checks.status = 'unhealthy';
    }

    // System info
    checks.system = {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        loadAverage: os.loadavg()
    };

    // Process info
    checks.process = {
        memoryUsage: {
            rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
        },
        uptime: `${(process.uptime() / 60 / 60).toFixed(2)} hours`,
        pid: process.pid,
        version: process.version
    };

    const statusCode = checks.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(checks);
});

/**
 * Database health check
 * GET /api/health/database
 */
router.get('/database', async (req, res) => {
    try {
        const start = Date.now();
        const [result] = await pool.query('SELECT VERSION() as version, NOW() as time');
        const duration = Date.now() - start;

        res.json({
            status: 'connected',
            version: result[0].version,
            serverTime: result[0].time,
            responseTime: `${duration}ms`
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * Liveness probe (for Kubernetes/Docker)
 * GET /api/health/live
 */
router.get('/live', (req, res) => {
    res.status(200).send('OK');
});

/**
 * Readiness probe (for Kubernetes/Docker)
 * GET /api/health/ready
 */
router.get('/ready', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).send('READY');
    } catch (error) {
        res.status(503).send('NOT READY');
    }
});

module.exports = router;
