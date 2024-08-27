import express from 'express';
import './db/mongoose.js';

import {router as userRouter} from './routers/user.js'
import {router as taskRouter} from './routers/task.js'

const app = express();

app.use(express.json());

// Routes for Express to respond to
app.use(userRouter);
app.use(taskRouter);

export {app}