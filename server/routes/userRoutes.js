const router = require('express').Router();
const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.post('/set-avatar/:id', setAvatar);
router.get('/all-users/:id', getAllUsers);

module.exports = router;
