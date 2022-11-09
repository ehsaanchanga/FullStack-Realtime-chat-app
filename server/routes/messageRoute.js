const router = require('express').Router();
const {
  getAllMessages,
  addMessage,
} = require('../controllers/messageController');

router.post('/add-message', addMessage);
router.post('/get-all-messages', getAllMessages);

module.exports = router;
