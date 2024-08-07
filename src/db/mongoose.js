import mongoose from 'mongoose';
import validator from 'validator';

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

// Define a User model
const User = new mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }      
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) { 
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    }
});

const Task = new mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

async function run() {
    try {
        // Create a new User
        // const newUser = new User({
        //     name: '   Tyler  ',
        //     email: 'tyler@dynamicSHARK.com',
        //     password: '1234567'
        // });

        // const result = await newUser.save();

        //Create a new Task
        const newTask = new Task({
            description: 'Learning Full-Stack Development'
        });

        const result = await newTask.save();
        console.log(result);
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed');
    }
}

run();

