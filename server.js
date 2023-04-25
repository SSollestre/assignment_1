const express = require('express');
const app = express();

app.listen((3000), () => {
    console.log('Server is running on port 3000; http://localhost:3000');
});

app.get('/', (req, res) => {
    res.send('Homepage');
});

const checkAuth = (req, res, next) => {
    console.log("Auth Route")
    next();
};

app.use(checkAuth)

app.get('/authRoute', (req, res) => {
    res.send('How did you get here?')
})