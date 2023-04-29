const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const Schema = mongoose.Schema;

app.use(session({ secret: process.env.SESSION_KEY }))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.static(`public`));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.useDb('Assignment1')
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB Atlas.")
})


app.listen((5000), () => {
    console.log('Server is running on port 5000; http://localhost:5000');
});


// Homepage
app.get('/', (req, res) => {
    if (!req.session.AUTH) {
        console.log("Unauthorized Homepage");
        res.send(`
    <h3>Welcome!</h3>
            <form action="./signup">
            <input type="submit" value="Sign Up" />
        </form>
        <form action="./login">
            <input type="submit" value="Log In" />
        </form>
`)
    } else {
        console.log("Authorized Homepage");
        res.send(`
    <h3> Welcome, ${req.session.USERNAME}!</h3>
        <form action="./authRoute">
        <input type="submit" value="Members Area" />
        </form>
    <form action="./signOut" method="post">
        <input type="submit" value="Sign Out" />
    </form>
    `)
    }

});


// User Model
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Sign Up Page
app.get('/signup', (req, res) => {
    res.send(`
    <h3 style = "margin-bottom:2px"> Login</h3 >
        <form action="/SignUp" method="post">
        <input type="text" id="name" name="name" placeholder="name"><br>
        <input type="text" id="email" name="email" placeholder="email"><br>
        <input type="text" id="password" name="password" placeholder="password"><br>
                    <input type="submit" id="submit" value="Sign Up">
                    </form>
                    `)
});

// // Write form data to database
app.post('/signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({
        name,
        email,
        password
    })

    newUser.save().then(res.redirect('/'))
});

// Log In Page
app.get('/login', (req, res) => {
    res.send(`<h3 style="margin-bottom:2px">Login</h3>
<form action="/login" method="post">
    <input type="text" id="email" name="email" placeholder="email"><br>
    <input type="text" id="password" name="password" placeholder="password"><br>
    <input type="submit" id="submit" value="Log In">
</form>`)
})


// // Find Matching User
app.post(('/login'), (req, res) => {
    User.find(({ email: req.body.email, password: req.body.password })).exec().then((users) => {

        if (users.length === 0) {
            console.log("Unauth")
            req.session.AUTH = false;
        } else {
            console.log("Auth")
            req.session.AUTH = true;
            req.session.USERNAME = users[0].name;
        }
        res.redirect('/authRoute');
    })

});

// Checks if the user is authenticated.
const checkAuth = (req, res, next) => {
    if (!req.session.AUTH) {
        return res.redirect('/authFail');
    }
    next();
};

// On failed authentication
app.get('/authFail', (req, res) => {
    res.send(`Invalid username / password <br>
        <form action="./">
            <input type="submit" value="home" />
        </form>`)
})

// Auth route only allowed for authenticated users
app.get('/authRoute', checkAuth, (req, res) => {
    const imageNumber = Math.floor(Math.random() * 3) + 1;
    res.send(`
                    <img src="/images/a1img${imageNumber}.png">
                        <h3> Authenticated user </h3>
                        <form action="./">
                            <input type="submit" value="Home" />
                        </form>
                        <form action="./signOut" method="post">
                            <input type="submit" value="Sign Out" />
                        </form>
                        `)
});

app.post('/signOut', (req, res) => {
    req.session.AUTH = false;
    res.redirect('./')
})
