const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

// Load test env variables
require('dotenv').config({ path: '.env.test' });

// 1. Setup Database before tests run
beforeAll(async () => {
    // Connect to TEST DB (Ensure your .env.test is correct)
    // Create the users table for the test
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
});

// 2. Clean up after every test
afterEach(async () => {
    await db.query('DELETE FROM users');
});

// 3. Close connection after all tests
afterAll(async () => {
    await db.end();
});

describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'TestUser',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe('test@example.com');
    });

    it('should block invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'BadUser',
                email: 'not-an-email',
                password: '123'
            });

        expect(res.statusCode).toEqual(400);
    });
});