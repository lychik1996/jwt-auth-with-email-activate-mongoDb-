module.exports = class UserDto {
  email;
  id;
  isActivated;
  constructor(model) {
    this.email = model.email;
    this.id = model._id; //mongo nado _ po default
    this.isActivated = model.isActivated;
  }
}; //data transfer object
