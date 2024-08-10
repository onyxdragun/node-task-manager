import express from 'express';
import {User} from '../models/user.js'

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch(error) {
        res.status(500).send(error);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(error) {
        res.status(404).send();
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch(error) {
        res.status(500).send();
    }
});

// Update a user
router.patch('/users/:id', async (req, res) => {
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
        const user = await User.findById(req.params.id);

        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch(error) {
        res.status(400).send(error);
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

export {router}