const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const Todos = require('./models/todos')
const db = mongoose.connection
const todosData = require('./utilities/data')
const todosController = require ('./controllers/todos.js')
const cors=  require ('cors')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')


// Environmental Varibles
const app = express()
const mongoURI = process.env.MONGO_URI
const PORT = process.env.PORT || 3001

// Connecting to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true},
   () => console.log('MongoDB connection establish') );
mongoose.set("strictQuery", true);

// Error / Disconnection
db.on('error', err => console.log(err.message + ' is Mongod not running?'))
db.on('disconnected', () => console.log('mongo disconnected'))

// Middleware
app.use(express.urlencoded({ extended: false }))// extended: false - does not allow nested objects in query strings
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json()); //use .json(), not .urlencoded()
app.use(express.static('public')) // we need to tell express to use the public directory for static files... this way our app will find index.html as the route of the application! We can then attach React to that file!
app.use(cors())

// Routes
app.use('/todos', todosController);


// Seeding the db
app.get('/seed', async (req, res) => {
    await Todos.deleteMany({});
    await Todos.insertMany(todosData);
    res.send('done!');
  });

app.listen(PORT, () => {
    console.log(`This message means nothing ${PORT}`);
  });