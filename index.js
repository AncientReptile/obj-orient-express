const { json } = require('express');
const express = require('express')
const path = require('path');
const logger = require('./middleware/logger');
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')

const app = express();

const baseAPI = '/api'

const mongoConnectionStr = 'mongodb://127.0.0.1:27017'
const dbName = 'Appointment_System'
let db

// app.get('/', (req, res) => {
//     // res.send('<h1>Hello World</h1>')
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Init middleware
// app.use(logger);

// Body Parser Middleware
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });

// Setup MongoDB connection
MongoClient.connect(mongoConnectionStr, { useUnifiedTopology: true }, (err, client) => {
    if(err)
        return console.error(err)

    // console.log('Connected to db')

    db = client.db(dbName)
    console.log(`Connected MongoDB: ${mongoConnectionStr}`)
    console.log(`Database: ${dbName}`)

    module.exports = db
    app.use(baseAPI, require('./routes/api/appointment'))
    app.use(baseAPI, require('./routes/api/login'))
});
// app.use(baseAPI, require('./routes/api/appointment'))
// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// Members Api Routes
// app.use('/api/members', require('./routes/api/members'))



const PORT = process.env.PORT || 5000;

app.listen(PORT, 'localhost', () => console.log(`Server started on port ${PORT}`));