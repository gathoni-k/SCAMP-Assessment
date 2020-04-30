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
      let deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) throw new Error('could not delete');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};
