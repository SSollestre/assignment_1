const express = require('express');
const app = express();
const session = require('express-session');

app.listen((5000), () => {
    console.log('Server is running on port 5000; http://localhost:5000');
});

const users = [
    {
        username: 'admin',
        password: '123'
    },
    {
        username: 'user',
        password: 'pass1'
    }
]

app.use(session({
    secret: 'secret key'
}))


app.get('/', (req, res) => {
    res.send(`<h3>Home</h3>
        <form action="./login">
            <input type="submit" value="login" />
        </form>`)
});

app.get('/authFail', (req, res) => {
    res.send(`Invalid username / password <br>
        <form action="./">
            <input type="submit" value="home" />
        </form>`)
})

app.get('/login', (req, res) => {
    res.send(`<h3 style="margin-bottom:2px">Login</h3>
<form action="/login" method="post">
    <input type="text" id="username" name="username" placeholder="username"><br>
    <input type="text" id="password" name="password" placeholder="password"><br>
    <input type="submit" id="submit" value="login">
</form>`)
})


app.use(express.urlencoded({ extended: false }))

app.post(('/login'), (req, res) => {
    if (users.find((user) => user.username === req.body.username && user.password === req.body.password)) {
        req.session.AUTH = true;
    }
    else {
        req.session.AUTH = false;
    }
    res.redirect('/authRoute');
});

const checkAuth = (req, res, next) => {
    console.log("Auth Route")
    if (!req.session.AUTH) {
        console.log("Failed auth")
        res.redirect('/authFail');
    }
    next();
};

app.use(checkAuth)

app.get('/authRoute', (req, res) => {
    res.send('How did you get here?')
})