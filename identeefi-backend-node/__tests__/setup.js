// Set test environment variables before any module loads
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.JWT_EXPIRES_IN = '1h';
process.env.BCRYPT_SALT_ROUNDS = '4'; // Low rounds for fast tests
process.env.PGHOST = 'localhost';
process.env.PGUSER = 'postgres';
process.env.PGPASSWORD = 'postgres';
process.env.PGDATABASE = 'postgres_test';
process.env.PGPORT = '5432';
