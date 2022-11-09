const mongoose = require('mongoose');

const Connection_url = process.env.MONGO_URL;

const connectDb = async () => {
  try {
    await mongoose.connect(Connection_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
