const User = require('../model/User');
const bcrypt = require('bcrypt')

const getAllUser = async (req, res) => {
    const users = await User.find();
    if (!users)
        return res.status(204).json({ message: "No user found" })
    res.json(users);
}

const updateUser = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ message: 'ID required' })
    const foundUser = await User.findOne({ _id: req.body.id });
    if (req.body.username)
        foundUser.username = req.body.username;
    if (req.body.roles)
        foundUser.roles = req.body.roles;
    if (req.body.password) {
        const hashedPwd = await bcrypt.hash(req.body.password, 10)
        foundUser.password = hashedPwd;
    }

    const result = await foundUser.save();
    res.json(result)
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id)
        res.status(400).json({ message: "ID required" });

    const foundUser = await User.findOne({ _id: req.body.id })
    if (!foundUser)
        return res.status(400).json({ message: `User with ID ${req.body.id} not found` })
    const result = await User.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    const foundUser = await User.findOne({ _id: req.params.id })
    if (!foundUser)
        return res.status(400).json({ message: `No user with ID ${req.params.id}` })
    res.json(foundUser)
}

module.exports = { getAllUser, updateUser, deleteUser, getUser };