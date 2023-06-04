const User = require('../model/User')

const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401)
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser)
        return res.sendStatus(403);

    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username)
                return res.sendStatus(403);

            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_SECRET_TOKEN,
                { expiresIn: '300s' }
            );
            res.json({ accessToken })
        }
    )
}

module.exports = { handleRefreshToken }