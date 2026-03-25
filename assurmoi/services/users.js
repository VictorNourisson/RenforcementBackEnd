const { User } = require("../models");

const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({
    users,
  });
};

const getUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.status(200).json({
    user,
  });
};

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    user,
  });
};

const updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  await user.update(req.body);
  res.status(200).json({
    message: "Successfully updated",
    user,
  });
};

const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  await user.destroy();
  res.status(200).json({
    message: "Successfully deleted",
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
