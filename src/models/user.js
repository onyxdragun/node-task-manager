import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';
import jsonwebtoken from 'jsonwebtoken';

import {Task} from './task.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

//----------- Virtual Properties ----------------------------------------------

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//----------- Instance Methods ----------------------------------------------

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    // need access to this
    const user = this;
    const token = jsonwebtoken.sign({_id: user._id.toString()},'thisismynewcourse');

    // Save token to database
    user.tokens = user.tokens.concat({token: token});
    await user.save();

    return token;
}

//----------- Model Methods ----------------------------------------------

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email});

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

//----------- Middleware ----------------------------------------------

// Has the plaintext password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Remove all tasks when a user is removed
// document set true to ensure document (not query) is removed
userSchema.pre('deleteOne', {document: true}, async function(next) {
    const user = this;
    try {
        await Task.deleteMany({owner : user._id});
        next();
    } catch (error) {
        console.log(error);
    }
});

// Define a User model
const User = new mongoose.model('User', userSchema);

export {User}