const User = require('../model/User');

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'username and password required' })
    }
    // Check for duplicate username in DB
    const duplicate = await User.findOne({ username: user });
    if (duplicate) {
        return res.sendStatus(409);
    }
    try {
        // encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // store user
        const newUser = await User.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(newUser)

        res.status(201).json({ 'success': `new users ${user} created` })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleNewUser };