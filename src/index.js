import app from './app.js';

const port = process.env.PORT;

// Start Listening
app.listen(port, () => {
    console.log('Server is up on port '+ port);
});
