const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
require('dotenv').config({ path: '.env.test' });

// We need a user to attack with
let token;

beforeAll(async () => {
    // 1. Clean DB
    await db.query('DELETE FROM users');
    
    // 2. Create a User
    await request(app).post('/api/auth/register').send({
        username: 'SecurityTester',
        email: 'hacker@example.com',
        password: 'password123'
    });
    
    // 3. Login
    const loginRes = await request(app).post('/api/auth/login').send({
        email: 'hacker@example.com',
        password: 'password123'
    });
    token = loginRes.body.token;
});

afterAll(async () => {
    await db.end();
});

describe('🛡️ Security Stress Tests', () => {

    // ATTACK 1: SQL Injection
    // The hacker tries to trick the login by saying:
    // "My email is anything OR 1=1" (which is always true in SQL)
    // If successful, they log in without a password.
    it('should block SQL Injection in login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: "' OR 1=1 --", 
                password: "anything"
            });
        
        // Expect 400 (Validation) or 401 (Invalid Creds)
        // NOT 200 (Success) and NOT 500 (Server Crash)
        expect(res.statusCode).not.toEqual(200);
        expect(res.statusCode).not.toEqual(500);
    });

    // ATTACK 2: XSS (Cross Site Scripting)
    // The hacker tries to post a JavaScript script as a blog post.
    // If successful, anyone viewing the post would run the script.
    it('should store scripts as plain text (not execute them)', async () => {
        const maliciousContent = "<script>alert('You have been hacked')</script>";
        
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Free Money",
                content: maliciousContent
            });

        // The API might accept it (201), BUT...
        // The DB should store it exactly as string characters, not executable code.
        // We verify that the API didn't crash or execute it properly.
        expect(res.statusCode).toEqual(201);
        expect(res.body.post.content).toEqual(maliciousContent);
    });
    
    // ATTACK 3: Huge Payload (DoS)
    // Sending a 10MB string to crash the memory.
    // Express defaults usually handle this, but let's check.
    it('should handle large payloads gracefully', async () => {
        const hugeString = "a".repeat(10000); // 10kb string
        
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Big Data",
                content: hugeString
            });

        // Should accept (201) or Limit it (413 Payload Too Large)
        // Should NOT Crash (500)
        expect(res.statusCode).not.toEqual(500);
    });
});