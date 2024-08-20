import express from 'express';
import {Task} from '../models/task.js';
import {auth} from '../middleware/auth.js';

const router = new express.Router();

//
// Create a task for a logged in user
//
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

//
// Fetch tasks for a logged in user
//
// GET /tasks?completed=false || true
// GET /tasks?limit=X&skip=X  <-- for Pagination
// GET /tasks?sortBy=createAt&orderBy=asc (1) || dsc (-1)
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        sort[req.query.sortBy] = req.query.orderBy === 'asc' ? 1 : -1;
    }

    try {
        // Alternative to fetch all tasks for a user
        //const tasks = await Task.find({owner: req.user._id});
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.send(req.user.tasks);
    } catch(error) {
        res.status(500).send();
    }
});

//
// Fetch a specific task by a user
//
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    
    try {
        const task = await Task.findOne({_id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch(error) {
        res.status(500).send();
    }
});

//
// Update a user's task
//
router.patch('/tasks/:id', auth, async (req, res) => {
    // Provide user with some info if their data doesn't
    // match what is in the document
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    });

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        await task.save();
        res.send(task);
    } catch(error) {
        res.status(400).send(error);
    }
});

//
// Delete a task for a logged in user
//
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if(!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch(error) {
        res.status(500).send();
    }   
});

export {router}