import express from 'express';
import './db/mongoose.js';

import {router as userRouter} from './routers/user.js'
import {router as taskRouter} from './routers/task.js'

const app = express();
const port = process.env.PORT || 3000;


import path from 'path';
import multer from 'multer';
import * as FileType from 'file-type';

const upload = multer({
    dest: 'images',
    limits: {
        fieldSize: 1000000 // 1MB
    },
    fileFilter(req, file, cb) {
        // cb(new Error('File must be a PDF'));
        // cb(undefined, true);
        console.log(file.mimetype);

        if (file.mimetype !== 'image/jpeg') {
            return cb(new Error('File is not a PDF'));
        }

        cb(undefined, true);
    }
});

app.post('/upload', upload.single('upload'), async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), req.file.path);
        const fileType = await FileType.fileTypeFromFile(filePath);
        console.log(fileType);
    } catch(error) {
        console.log(error);
    }

    res.send();
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});


app.use(express.json());

// Routes for Express to respond to
app.use(userRouter);
app.use(taskRouter);

// Start Listening
app.listen(port, () => {
    console.log('Server is up on port '+ port);
});