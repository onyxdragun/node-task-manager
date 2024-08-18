import express from 'express';
import './db/mongoose.js';

import {router as userRouter} from './routers/user.js'
import {router as taskRouter} from './routers/task.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// middleware 
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled');
//     } else {
//         next();
//     }
// });

// app.use((req, res, next) => {
//     res.status(503).send('Web Site Maintanence Underway. Try again later!');
// });

// Routes for Express to respond to
app.use(userRouter);
app.use(taskRouter);

// Start Listening
app.listen(port, () => {
    console.log('Server is up on port '+ port);
});

const myFunction = async () => {
    // const token = jsonwebtoken.sign({_id: 'abc123'}, 'thisismynewcourse', {expiresIn: '0s'});
    // console.log(token);

    // const data = jsonwebtoken.verify(token, 'thisismynewcourse');
    // console.log(data);
}

myFunction();