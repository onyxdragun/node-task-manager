import request from 'supertest';

import { app } from '../src/app.js';
import { Task } from '../src/models/task.js'
import * as db from './fixtures/db.js'

beforeEach(db.setupDatabase);

test('Should create task for user', async () => {
    let response;
    try {
        response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${db.userOne.tokens[0].token}`)
            .send({
                description: 'From my test'
            })
            .expect(201);
    } catch (error) {
        console.log(error);
    }
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

// User one should have 2 tasks
test('Request all tasks for user one', async() => {
    let response;
    try {
        response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${db.userOne.tokens[0].token}`)
            .send()
            .expect(200);
    } catch (error) {
        console.log(error);
    }
    expect(response.body.length).toEqual(2);
});

test('Attempt to delete tasks of User One with User Two', async () => {
    let response;
    try {
        response = await request(app)
            .delete('/tasks/' + db.taskOne._id)
            .set('Authorization', `Bearer ${db.userTwo.tokens[0].token}`)
            .send()
            .expect(404)
    } catch (error) {
        console.log(error);
    }
    const task = Task.findById(db.taskOne._id);
    expect(task).not.toBeNull();
});