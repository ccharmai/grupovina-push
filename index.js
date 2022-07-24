// creating an express application
const express = require('express')
const app = express()

// making the .env file available in the application
require('dotenv').config({ path: `${__dirname}/.env` })

// standard express query parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// adding a template engine to the application. variables controller will now be available in the html file
app.set('views', './views')
app.set('view engine', 'hbs')

// files from the static folder will be accessible from outside
app.use('/', express.static(`${__dirname}/static`))

//
const webpush = require('web-push')
webpush.setVapidDetails(`mailto:${process.env.EMAIL}`, process.env.PUBLIC_KEY, process.env.PRIVATE_KEY)

// connecting a simple database
// I strongly do not recommend using such a database in production solutions, as there is a blocking of threads
const sqlite3 = require("sqlite3")
const dbPath = `${__dirname}/database.db`
const db = new sqlite3.Database(dbPath)

// let's create a table of Grupovina's users
db.run('CREATE TABLE IF NOT EXISTS Users ( id INTEGER PRIMARY KEY AUTOINCREMENT, endpoint TEXT, p256dh VARCHAR(250), auth VARCHAR(250))')

// give the main page and transfer the public key from the .env file to it
app.get('/', (req, res) => {
  return res.render('index', { publicKey: process.env.PUBLIC_KEY })
})

// it works when a new user has subscribed to us
app.post('/subscribe', (req, res) => {
  db.all('SELECT * FROM Users WHERE endpoint = $1', [req.body.endpoint], (err, row) => {
    if (row.length === 0) db.run(`INSERT INTO Users (endpoint, p256dh, auth) VALUES ("${req.body.endpoint}", "${req.body.keys.p256dh}", "${req.body.keys.auth}")`)
  })
  res.json({ success: true })
})

// sends a message to all subscribers
app.post('/global', (req, res) => {
  db.all('SELECT * FROM Users ORDER BY id', [], (err, rows) => {
    rows.forEach(user => sendExamplePush(user))
  })
  res.json({ success: true })
})


// sends a message to a specific subscriber
const sendExamplePush = (user) => {
  const payload = {
    title: 'Grupovina',
    body: 'Enjoy',
    url: 'https://grupovina.rs/',
  }

  const subscription = {
    endpoint: user.endpoint,
    keys: {
      p256dh: user.p256dh,
      auth: user.auth,
    },
  }

  webpush.sendNotification(subscription, JSON.stringify(payload))
}

app.listen(8000)
