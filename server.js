const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const Schema = mongoose.Schema;

app.use(session({ secret: 'secret key' }))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.useDb('Assignment1')
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB Atlas.")
})


app.listen((5000), () => {
    console.log('Server is running on port 5000; http://localhost:5000');
});


const users = [
    {
        username: 'admin',
        password: '123',
    },
    {
        username: 'user',
        password: 'pass1',
    }
]

// Homepage
app.get('/', (req, res) => {
    res.send(`
    <h3>Home</h3>
            <form action="./signup">
            <input type="submit" value="Sign Up" />
        </form>
        <form action="./login">
            <input type="submit" value="Log In" />
        </form>
`)
});


// User Model
const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Sign up page
app.get('/signup', (req, res) => {
    res.send(`<h3 style="margin-bottom:2px">Login</h3>
<form action="/SignUp" method="post">
    <input type="text" id="username" name="username" placeholder="username"><br>
    <input type="text" id="password" name="password" placeholder="password"><br>
    <input type="submit" id="submit" value="Sign Up">
</form>`)
});

// Write form data to database
app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);

    const newUser = new User({
        username,
        password
    })

    newUser.save().then(res.redirect('/'))
});




// app.get('/authFail', (req, res) => {
//     res.send(`Invalid username / password <br>
//         <form action="./">
//             <input type="submit" value="home" />
//         </form>`)
// })

// app.get('/login', (req, res) => {
//     res.send(`<h3 style="margin-bottom:2px">Login</h3>
// <form action="/login" method="post">
//     <input type="text" id="username" name="username" placeholder="username"><br>
//     <input type="text" id="password" name="password" placeholder="password"><br>
//     <input type="submit" id="submit" value="Log In">
// </form>`)
// })

// app.post(('/login'), (req, res) => {
//     if (users.find((user) => user.username === req.body.username && user.password === req.body.password)) {
//         req.session.AUTH = true;
//     }
//     else {
//         req.session.AUTH = false;
//     }
//     res.redirect('/authRoute');
// });

// const checkAuth = (req, res, next) => {
//     console.log("Auth Route")
//     if (!req.session.AUTH) {
//         console.log("Failed auth")
//         res.redirect('/authFail');
//     }
//     next();
// };

// app.use(checkAuth)

// app.get('/authRoute', (req, res) => {
//     res.send(`<form action="./Admin">
//     <input type="submit" value="Admin" />
// </form>

//  <form action="./User">
//     <input type="submit" value="Login" />
//  </form>`)
// });
