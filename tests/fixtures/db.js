import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';

import {User} from '../../src/models/user.js';
import {Task} from '../../src/models/task.js';

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Alastair',
    email: 'alastair@example.com',
    password: '123456789',
    tokens: [{
        token: jsonwebtoken.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Winter',
    email: 'winter@example.com',
    password: 'redfishbluefish123',
    tokens: [{
        token: jsonwebtoken.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: userOneId
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    owner: userOneId
};
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: false,
    owner: userTwoId
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

export {userOneId, userTwoId,userOne, userTwo, setupDatabase, taskOne, taskTwo, taskThree}