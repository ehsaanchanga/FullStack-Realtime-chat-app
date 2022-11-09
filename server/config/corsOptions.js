const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://www.google.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
