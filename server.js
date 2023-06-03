require('dotenv').config();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const express = require('express');
const path = require('path');
const app = express();
const { logger } = require('./middleware/logEvent');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection')
const PORT = process.env.PORT || 3500;
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials')

// Connect to mongodb
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credential check
// and fetch cookies credential requirements
app.use(credentials);

// Cross Origin Resoure Sharing
// Remove localhost and liveserver url in production
app.use(cors(corsOptions));

// Built in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }))

// built in middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// Serve Static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Router
app.use('/', require('./Routes/root'));
app.use('/subdir', require('./Routes/subdir'));
app.use('/register', require('./Routes/register'));
app.use('/auth', require('./Routes/auth'));
app.use('/refresh', require('./Routes/refresh'))
app.use('/logout', require('./Routes/logout'))

app.use(verifyJWT)
app.use('/employees', require('./Routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 not found' })
    } else {
        res.type('txt').send('404 not found')
    }
})

app.use(errorHandler)

// Only 
mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})


