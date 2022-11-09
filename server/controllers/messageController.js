const messageMode = require('../models/messageMode');

module.exports.getAllMessages = async (req, res) => {
  try {
    const { from, to } = req.body;
    const messages = await messageMode
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projectMessage = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    return res.status(200).json(projectMessage);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;

    const data = await messageMode.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data)
      return res.status(201).json({ message: 'Message sent successfully' });
    return res.status(500).json({ message: 'Message not sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
