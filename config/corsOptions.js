const allowedOrigins = require('./allowedOrigins')
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            //Remove origin in production. This is used when origin is undefined
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionSuccessStatus: 200
}

module.exports = corsOptions;