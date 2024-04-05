require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middlewares');
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173',credentials:true }));
app.use('/api',router);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); //connect to base mongodb
    app.listen(PORT, () => {
      console.log('Server is started port: ', PORT);
    });
  } catch (e) {
    console.log(e);
  }
};
start();
