import express from 'express';
import multer from 'multer';
import sharp from 'sharp';

import {User} from '../models/user.js'
import {auth} from '../middleware/auth.js'

const router = new express.Router();

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize:  1024 * 1024 // 1MB
    },
    fileFilter: async (req, file, cb) => {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG and PNG are allowed'));
        }
        cb(undefined, true);
    }
});

//
// Create a new user
//
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(error) {
        res.status(500).send(error);
    }
});

//
// Login a user
//
router.post('/users/login', async (req, res) => {
    try {
        // findByCredentials is a custom func in model
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (error) {
        res.status(400).send();
    }
});

//
// Logout a user
//
router.post('/users/logout', auth, async(req, res) => {
    try {
        // Iterate over the tokens and save those that do no match current session
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

//
// Remove all auth tokens ultimately logging all devices out for the logged in user
//
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

//
// Upload a user image
//
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // Modify avatar that is being uploaded
    const buffer = await sharp(req.file.buffer)
        .resize({
            width: 250,
            height: 250
        })
        .png()
        .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

//
// Delete a user image
//
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

//
// Fetch user's profile
//
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

//
// Update a user
//
router.patch('/users/me', auth, async (req, res) => {
    // Provide user with some info if their data doesn't
    // match what is in the document
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    });

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();

        res.send(req.user);
    } catch(error) {
        res.status(400).send(error);
    }
});

//
// Removes a user completely
// This also deletes all of their tasks too
//
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

//
// Fetch user avatar
// ** Currently stored as Base64 in the DB
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch(error) {
        res.status(404).send();
    }
});

export {router}