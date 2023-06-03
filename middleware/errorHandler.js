const { logEvents } = require('./logEvent');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}\t${err.message}`, 'errorLog.txt');
    console.error(err);
    res.status(500).send(err.message)
}

module.exports = errorHandler;