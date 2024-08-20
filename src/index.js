import express from 'express';
import './db/mongoose.js';

import {router as userRouter} from './routers/user.js'
import {router as taskRouter} from './routers/task.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes for Express to respond to
app.use(userRouter);
app.use(taskRouter);

// Start Listening
app.listen(port, () => {
    console.log('Server is up on port '+ port);
});