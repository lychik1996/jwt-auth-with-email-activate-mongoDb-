const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    }); //danie kotorie mi peredaem v token , secret key, vremya zini
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }
  async saveToken(userId, refreshToken) {
    let tokenData = await tokenModel.findOne({ user: userId });

    if (!tokenData) {
        // Якщо дані про токен не існують, створіть новий токен
        tokenData = await tokenModel.create({ user: userId, refreshToken });
    } else {
        // Якщо дані про токен існують, оновіть існуючий токен
        tokenData.refreshToken = refreshToken;
        await tokenData.save();
    }
    
    return tokenData;
  }
  async removeToken(refreshToken) {
    const tokenDate = await tokenModel.deleteOne({ refreshToken });
    return tokenDate;
  }
  async findToken(refreshToken) {
    const tokenDate = await tokenModel.findOne({ refreshToken });
    return tokenDate;
  }
}

module.exports = new TokenService();
