const User = require('./model');

module.exports = {
  createUser: async (user) => {
    try {
      const { name, email, password, role } = user;
      // create new user
      const newUser = new User({
        name,
        email,
        password,
        role
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      return false;
    }
  },
  deleteUser: async (id) => {
    try {
      await User.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  },
  updateUser: async (update, id) => {
    try {
      await User.findOneAndUpdate({ _id: id }, { $set: update });
      const updated = await User.findById(id);
      return updated;
    } catch (error) {
      return false;
    }
  },
  getUser: async (id) => {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      return false;
    }
  }
};
