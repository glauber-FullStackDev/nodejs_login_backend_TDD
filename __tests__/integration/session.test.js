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
});

describe('Password', () => {

    beforeEach(async () => {
        await truncate();
    })

    it('Should send code to email if email exist', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app).post('/sessions/change-password').send({
            email: user.email,
            origem: 'APP'
        });

        expect(response.body.message).toBe('sended email');
    })

    it('should not send code if email not exist', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })
        

        const response = await request(app).post('/sessions/change-password').send({
            email: 'glauber.edif@gmail.com',
            origem: 'APP'
        });

        expect(response.status).toBe(400);
    })

    it('should receive code and new password and change password', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response1 = await request(app).post('/sessions/change-password').send({
            email: user.email,
            origem: 'APP'
        });

        const response = await request(app).post('/sessions/change-password/confirm').send({
            code: '123456',
            password: '123456789'
        }).set('Authorization', `Bearer ${user.generateToken()}`);

        expect(response.status).toBe(400);
    })

    it('should receive token in header authorization', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app).post('/sessions/change-password/confirm').send({
            code: '123456',
            password: '123456789'
        });

        expect(response.status).toBe(401);
    })

    it('should receive invalid code and return error', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response1 = await request(app).post('/sessions/change-password').send({
            email: user.email,
            origem: 'APP'
        });

        const response2 = await request(app).post('/sessions/change-password/confirm').send({
            code: '123456',
            password: '123456789'
        }).set('Authorization', `Bearer ${user.generateToken()}`);

        expect(response2.body).toHaveProperty('message', 'Invalid code');
    })

    it('should receive valid code and change password', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response1 = await request(app).post('/sessions/change-password').send({
            __test__: 'Ga909713@',
            email: user.email,
            origem: 'APP'
        });

        const response2 = await request(app).post('/sessions/change-password/confirm').send({
            code: '12345678',
            password: 'ga909713'
        }).set('Authorization', `Bearer ${user.generateToken()}`);


        expect(response2.body).toHaveProperty('message', 'Password Changed');
    })

    it('should receive password and conect session after change password', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response1 = await request(app).post('/sessions/change-password').send({
            __test__: 'Ga909713@',
            email: user.email,
            origem: 'APP'
        });

        const response2 = await request(app).post('/sessions/change-password/confirm').send({
            code: '12345678',
            password: 'ga909713'
        }).set('Authorization', `Bearer ${user.generateToken()}`);

        const response3 = await request(app).post('/sessions').send({
            email: user.email,
            password: 'ga909713'
        });

        expect(response3.body).toHaveProperty('token');
    })


})

describe('Register', () => {
    it('should receive name, email and password and register new account', () => {
        const response = await request(app).post('/register/add').send({
            name: 'Glauber de Souza Silva',
            email: 'glauber.edif@gmail.com',
            password: '12345678'
        });

        expect(response.status).toBe(200);
    });
});