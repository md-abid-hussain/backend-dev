const User = require('../model/User')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    try {
        const { user, pwd } = req.body;
        if (!user || !pwd) {
            return res.status(400).json({ "message": "Username and password require" })
        }

        const foundUser = await User.findOne({ username: user });
        if (!foundUser)
            return res.sendStatus(401) // Unauthorize

        // Evaluating Password
        const match = await bcrypt.compare(pwd, foundUser.password)
        if (match) {
            const roles = Object.values(foundUser.roles).filter(Boolean)
            // Creating JWT

            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_SECRET_TOKEN,
                { expiresIn: '300s' }
            )

            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_SECRET_TOKEN,
                { expiresIn: '1d' }
            )

            // Saving refresh token for current user
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();

            // Remove sameSite and secure option while testing with thunder client
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken, roles })
        } else {
            res.sendStatus(401)
        }
    } catch (err) {
        console.error(err.message)
    }
}

module.exports = { handleLogin };