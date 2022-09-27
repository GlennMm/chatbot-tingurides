require('dotenv').config();

const multiPlayerModeHandler = require('./mode-controllers/multiplayer');
const singlePlayerModeHandler = require('./mode-controllers/singleplayer');

const express = require('express');
const session = require('express-session');

const { connect } = require('mongoose')

const { serverErrorMsg } = require('./messages');
const {
  sendMessage,
  saveUserSession,
  broadcastMessage,
  sessionConfig
} = require('./utils');


const GameFactory = require('./games/GameFactory');
const SPGamesManager = require('./core/SPGamesManager');

const app = express();
const PORT = process.env.PORT || 3000;

const { ClientModel } = require('./games/db-models/tingurides.models')

// Parse incoming Twilio request
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session(sessionConfig));

app.set('view engine', 'pug')

// Custom properties attached on each request & response
app.use((req, res, next) => {
  req.user = req.session.user;
  res.sendMessage = sendMessage(res);
  req.saveUserSession = saveUserSession(req);
  req.broadcastMessage = broadcastMessage(req);
  next();
});

app.get('/', async (_, res) => {
  const drivers = await ClientModel.find({ type: 'driver' })
  return res.render('home', { drivers_count: drivers.length })
})

app.get('/drivers', async (req, res) => {
  const drivers = await ClientModel.find({ type: 'driver' })
  return res.render('drivers', { drivers })
})

app.get('/new-driver', (req, res) => {
  return res.render('new-driver', { data: { message: 'hello' } })
})

app.post('/new-driver', async (req, res) => {
  try {
    const { password, confirm_pass } = req.body
    if (password !== confirm_pass) {
      return res.render('new-driver', { message: 'Password are not similar.' })
    }
    const data = {
      ...req.body,
      type: 'driver'
    }
    const row = new ClientModel(data)
    await row.save()
    return res.redirect('/drivers')
  } catch (error) {
    return res.render('new-driver', { data: { err: true, message: 'Failed to create new driver. Try again later.' } })
  }
})


app.get('/driver/detail/:id', async (req, res) => {
  try {
    const driver = await ClientModel.findById(req.params.id)
    return res.render('view-driver', {
      driver,
      message: driver == null ? 'Driver not found.' : '',
      found: driver == null ? true : false

    })

  } catch (e) {
    return res.render('view-driver', {
      message: 'Driver not found.'
    })
  }
})

app.get('/driver/delete/:id', async (req, res) => {
  try {
    const driver = await ClientModel.findById(req.params.id)
    return res.render('delete-driver', { driver, found: driver != null ? true : false })
  } catch (e) {
    return res.redirect(`/drivers`)
  }
})

app.post('/driver/delete/:id', async (req, res) => {
  try {
    const driver = await ClientModel.findById(req.params.id)
    if (driver) {
      await ClientModel.deleteOne(driver)
    }
    return res.redirect(`/drivers`)
  } catch (e) {
    return res.redirect('/drivers')
  }
})

app.get('/driver/edit/:id', async (req, res) => {
  try {
    const driver = await ClientModel.findById(req.params.id)
    return res.render('edit-driver', { driver, found: driver != null ? true : false })
  } catch (e) {
    return res.redirect(`/drivers`)
  }
})

app.post('/driver/edit/:id', async (req, res) => {
  try {
    const driver = await ClientModel.findById(req.params.id)
    if (driver) {
      await ClientModel.updateOne({ _id: req.params.id }, { $set: req.body })
    }
    return res.redirect(`/drivers`)
  } catch (e) {
    return res.redirect('/drivers')
  }
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

      const user = await ClientModel.findOne({ phone_number: req.body.From })
      
      if (user != null) {
        const userSession = {
          phone: req.body.From,
          mode: 'single-player',
          username: user.fullname
        };
        req.user = userSession;
        req.session.save(err => {
          if (err) throw (err);
        })

        const game = GameFactory.createGame(0, req);

        if (game.init) await game.init();

        await SPGamesManager.createGame(game, req);

        game.data.user = { user, loggedIn: true }

        return res.sendMessage(game.loggedInMenu);

      } else {

        const userSession = {
          phone: req.body.From,
          mode: 'single-player',
          username: ''
        };

        await req.saveUserSession(userSession);
        req.session.user = userSession;
        req.user = userSession;
        req.session.save(err => {
          if (err) throw (err);
        })

        const game = GameFactory.createGame(0, req);

        if (game.init) await game.init();

        await SPGamesManager.createGame(game, req);

        return res.sendMessage(game.welcomeMessage);
      }

    }
  } catch (error) {
    console.log(error)
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
