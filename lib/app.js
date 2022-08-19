require('dotenv').config();

const multiPlayerModeHandler = require('./mode-controllers/multiplayer');
const singlePlayerModeHandler = require('./mode-controllers/singleplayer');

const express = require('express');
const session = require('express-session');

const { connect } = require('mongoose')

const { singlePlayerWelcomeMsg, serverErrorMsg, getRootMenu } = require('./messages');
const {
  sendMessage,
  saveUserSession,
  broadcastMessage,
  sessionConfig
} = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming Twilio request
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session(sessionConfig));

// Custom properties attached on each request & response
app.use((req, res, next) => {
  req.user = req.session.user;
  res.sendMessage = sendMessage(res);
  req.saveUserSession = saveUserSession(req);
  req.broadcastMessage = broadcastMessage(req);
  next();
});

app.get('/', (_, res) => {
  return res.json({ message: 'The Zim Whatsapp Games is running.' })
})

// The main endpoint where messages arrive
app.post('/', async (req, res) => {
  const user = req.session.user || {};

  try {
    if (user.mode === 'single-player') {
      singlePlayerModeHandler(req, res);
    } else if (user.mode === 'multi-player') {
      multiPlayerModeHandler(req, res);
    } else {
      const userSession = {
        phone: req.body.From,
        mode: 'single-player',
        username: ''
      };
      await req.saveUserSession(userSession);
      const singlePlayerHome = getRootMenu(userSession)
      res.sendMessage(singlePlayerHome);
      // res.sendMessage(singlePlayerWelcomeMsg);
    }
  } catch (error) {
    res.sendMessage(serverErrorMsg);
  }
});
connect(process.env.DB_URL, {}, (err) => {
  if (err) {
    console.log(err)
    return process.exit(1)
  }
  console.log('connected...')
  return app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})
