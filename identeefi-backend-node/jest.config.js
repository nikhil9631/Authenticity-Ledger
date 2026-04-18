module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/database.js'
    ],
    setupFiles: ['<rootDir>/__tests__/setup.js']
};
