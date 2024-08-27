import request from 'supertest';

import { app } from '../src/app.js';
import { User } from '../src/models/user.js';
import {userOneId, userOne, setupDatabase} from './fixtures/db.js'

beforeEach(setupDatabase);

test('Should create a new user', async () => {
    let response;
    try {
        response = await request(app)
        .post('/users')
        .send({
            name: 'Tyler',
            email: 'tyler@example.com',
            password: '123456789'
        })
        .expect(201);
    } catch (error) {
        console.log(error);
    }

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user : {
            name: 'Tyler',
            email: 'tyler@example.com'
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('123456789');
});

test('Should login existing user', async() => {
    let response;
    try {
        response = await request(app)
            .post('/users/login')
            .send({
                email: userOne.email,
                password: userOne.password
            })
            .expect(200);
    } catch(error) {
        console.log(error);
    }
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login non-existent user', async() => {
    try {
        await request(app)
        .post('/users/login')
        .send({
            email: 'nobody@example.com',
            password: '123456789'
        })
        .expect(400);  
    } catch (error) {
        console.log(error);
    }
});

test('Should get profile for and authenticated user', async() => {
    try {
        await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);
    } catch(error) {  
        console.log(error);
    }
});

test('Should not get profile for an unauthenticated user', async() => {
    try {
        await request(app)
            .get('/users/me')
            .send()
            .expect(401);
    } catch(error) {
        console.log(error);
    }
});

test('Should delete an account of an authenticated user', async() => {
    let response;
    try {
        await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);
    } catch(error) {
        console.log(error);
    }
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete an account of an unauthenticated user', async() => {
    try {
        await request(app)
            .delete('/users/me')
            .send()
            .expect(401);
    } catch(error) {
        console.log(error);
    }
});

test('Should upload avatar image', async () => {
    try {
        await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar','tests/fixtures/avatar-icon-images-4.jpg')
            .expect(200);
    } catch (error) {
        console.log(error);
    }
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async() => {
    try {
        await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'Robyn'
            })
            .expect(200);
    } catch (error) {
        console.log(error);
    }
    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Robyn');
});

test('Should not update invalid user fields', async () => {
    try {
        await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                address: '123 Anywhere'
            })
            .expect(400);
    } catch (error) {
        console.log(error);
    }
});