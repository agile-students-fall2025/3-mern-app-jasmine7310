require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// image is in front-end public folder
const path = require('path')
app.use('/static', express.static(path.join(__dirname, '../frontend/public')))


// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/aboutus', async (req, res) => {
  try{
    res.json({
      myName: "Jasmine Fan",
      aboutParagraph: ["Hi! I'm Jasmine! I'm currently a senior majoring in Computer Science.",
                      " I have four minors: Web Programming and Applications, Digital Art and Design, Chinese, and Interactive Media Arts.",
                      " The only reason I have so many is because over the summer, IMA had opened up their minor to every school in NYU, as IMA was my past major, I obviously already fulfilled all the requirements for the minor.",
                      " Another fun fact about me is that I have a pet chicken named Noir— unsuprisingly, my favorite animals are also birds.",
                      " Currently, I'm aiming to become a Full Stack developer— I love building software but hate research.",
                      " In my free time, I love to draw, go to bookstores, or talk a walk around New York with no destination in mind.",
                      `\nI also really enjoy fighting games such as GBVSR, Street Fighter 6, and Guilty Gear, but I haven't been playing recently due to graduate school applications coming up.`,
                      " Also, I'm from California! A lot of people I meet over here are from the Bay Area, however I'm from a place close to LA.",
                      " Really looking forward to getting into the meat of this class!"],
      myImage: "http://localhost:7002/static/IMG_4855.jpg"
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to serve about us',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
