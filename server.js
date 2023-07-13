const express = require('express');
const engine = require('express-handlebars');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');

const connectDB = require('./server/database/connection');
const { clear } = require('console');

const app = express();

const PORT = 3500

app.use(cors())

app.set('view engine', 'html') 

// mongodb connection
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// load routers
app.use('/', require('./server/routes/router'))

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
