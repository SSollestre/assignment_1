const express = require('express');
const app = express();

app.listen((5000), () => {
    console.log('Server is running on port 5000; http://localhost:5000');
});

app.get('/', (req, res) => {
    res.send(`<h3>Homepage</h3>
        <form action="./login/">
            <input type="submit" value="login" />
        </form>`)
});

app.get('/login', (req, res) => {
    res.send(`<h3>Login</h3>
<form>
    <label for="username">Username</label><br>
    <input type="text" id="username" name="username"><br>
    <label for="password">Password</label><br>
    <input type="text" id="password" name="password">
</form>`)
})

const checkAuth = (req, res, next) => {
    console.log("Auth Route")
    next();
};

app.use(checkAuth)

app.get('/authRoute', (req, res) => {
    res.send('How did you get here?')
})