const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    port: parseInt(process.env.PGPORT, 10) || 5432,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'postgres',
    max: parseInt(process.env.PG_POOL_MAX, 10) || 20,
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT, 10) || 30000,
    connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT, 10) || 2000
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});

async function close() {
    await pool.end();
}

// pool.query() has the same interface as client.query(),
// so all existing services work without changes.
module.exports = pool;
module.exports.close = close;
