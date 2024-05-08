import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false
}));

function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    } else {
      return res.status(401).send('Unauthorized');
    }
  }

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (username === "pinki" && password === "pinki@123") {
      req.session.user = { username };
      console.log(req.session);
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });

  app.get('/profile',requireLogin, (req, res) => {
    if (req.session.user) {
      res.send(`Welcome, ${req.session.user.username}! This is your profile.`);
    } else {
      res.status(401).send('You need to log in to access this page');
    }
  });

  app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logout successful');
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
