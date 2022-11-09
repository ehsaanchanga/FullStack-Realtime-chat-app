const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.status(409).json({
        message: `Username ${username} already exist`,
        status: false,
      });

    const emailCheck = await User.findOne({ email });

    if (emailCheck)
      return res.status(400).json({
        message: `Email ${username} already exist`,
        status: false,
      });
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    delete user.password;

    return res
      .status(201)
      .json({ message: 'User created successfully', status: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({
        message: `Username or password not valid`,
        status: false,
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({
        message: `Username or password not valid`,
        status: false,
      });

    delete user.password;

    return res
      .status(200)
      .json({ message: 'Login successfull', status: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

module.exports.setAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findById(userId);

    userData.isAvatarImageSet = true;
    userData.avatarImage = avatarImage;

    const updatedData = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });
    res
      .status(200)
      .json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

module.exports.getAllUsers = async (req, res) => {
  let id = req.params.id;

  try {
    const users = await User.find({ _id: { $ne: id } }).select([
      'email',
      'username',
      'avatarImage',
      '_id',
    ]);

    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
