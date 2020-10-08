const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');

const factory = require('../factories')

describe('Authentication', () => {

    beforeEach(async () => {
        await truncate();
    })

    it('should authenticate with valid credentials', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app).post('/sessions').send({
            email: user.email,
            password: '123123'
        });

        expect(response.status).toBe(200);
    })

    it('should not authenticate with invalid credentials', async () => {
        const user = await factory.create('User', {});

        const response = await request(app).post('/sessions').send({
            email: user.email,
            password: '123456'
        });

        expect(response.status).toBe(401);
    })

    it('should return jwt token when athenticated', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app).post('/sessions').send({
            email: user.email,
            password: '123123'
        });

        expect(response.body).toHaveProperty('token');
    });

    it('should not to access private routes without jwt', async () => {
        const response = await request(app).get('/dashboard');
        
        expect(response.status).toBe(401);
    });

    it('should not access routes with invalid token', async () => {
        const response = await request(app).get('/dashboard')
        .set('Authorization', 'Bearer 123123');
        
        expect(response.status).toBe(401);
    });

    it('should access routes with valid token', async () => {
        const user = await factory.create('User', {});

        const response = await request(app).get('/dashboard')
        .set('Authorization', `Bearer ${user.generateToken()}`);
        
        expect(response.status).toBe(200);
    });
})