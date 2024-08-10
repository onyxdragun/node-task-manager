import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
    {
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
    }
);

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Define a User model
const User = new mongoose.model('User', userSchema);

export {User}