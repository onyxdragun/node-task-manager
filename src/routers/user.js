import express from 'express';
import {User} from '../models/user.js'
import {auth} from '../middleware/auth.js'

const router = new express.Router();

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

// Remove all auth tokens ultimately logging all devices out for the logged in user
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// Fetch user's profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// Update a user
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

// Removes a user completely
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

export {router}