const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exception/api-error');
const tokenModel = require('../models/token-model');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email }); //ishem polbzovatelya
    if (candidate) {
      throw ApiError.BadRequest(`User with this ${email} exist `);
    }
    const hashPassword = await bcrypt.hash(password, 3); //hash parolb
    const activationLink = uuid.v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    }); //sozdaem polbzovatelya i ssilky dlya acitavate
    const link = `${process.env.API_URL}/api/activate/${activationLink}`;

    await mailService.sendActivation(email, link); //send link in mail

    const userDto = new UserDto(user); //id ,email,isActivated
    const tokens = tokenService.generateToken({ ...userDto }); //generate token
    await tokenService.saveToken(userDto.id, tokens.refreshToken); //sohranyaem v bazy danih

    return {
      ...tokens,
      user: userDto,
      // link:link
    };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Dont correct link activation');
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('User didnt find in base ');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Dont correct password');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
