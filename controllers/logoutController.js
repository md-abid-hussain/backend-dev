const User = require('../model/User')

const handleLogout = async (req, res) => {
    // On client, also delete the access tokens

    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content
    }

    const refreshToken = cookies.jwt;
    // Is refresh toke in db
    const foundUser = User.findOne({ refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.sendStatus(204);
    }

    // Delete the refresh token in db

    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }) // Secure :true - only serves in https

    res.sendStatus(204);
}

module.exports = { handleLogout }