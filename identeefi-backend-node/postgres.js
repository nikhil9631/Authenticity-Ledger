require('dotenv').config();

if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not configured. Set it in the backend .env file before starting the server.');
    process.exit(1);
}

const app = require('./src/app');
const { close: closePool } = require('./src/config/database');

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
function shutdown(signal) {
    console.log(`\n${signal} received — shutting down gracefully`);
    server.close(async () => {
        console.log('HTTP server closed');
        try {
            await closePool();
            console.log('Database pool closed');
        } catch (err) {
            console.error('Error closing database pool:', err.message);
        }
        process.exit(0);
    });

    // Force exit after 10 seconds if graceful shutdown stalls
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
