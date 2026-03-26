const { History, Request, Sinister, User } = require("../models");

const getAllHistories = async (req, res) => {
  const { request_id, sinister_id, user_id } = req.query;
  const where = {};
  if (request_id) where.request_id = request_id;
  if (sinister_id) where.sinister_id = sinister_id;
  if (user_id) where.user_id = user_id;
  const histories = await History.findAll({ where });
  res.status(200).json({ histories });
};

const getHistory = async (req, res) => {
  const history = await History.findByPk(req.params.id);
  if (!history) return res.status(404).json({ message: "History not found" });
  res.status(200).json({ history });
};

const createHistory = async (req, res) => {
  const { request_id, sinister_id, user_id } = req.body;

  // Check if referenced entities exist
  if (request_id) {
    const request = await Request.findByPk(request_id);
    if (!request) {
      return res.status(400).json({
        message:
          "Création de l'historique impossible : la demande n'existe pas",
      });
    }
  }

  if (sinister_id) {
    const sinister = await Sinister.findByPk(sinister_id);
    if (!sinister) {
      return res.status(400).json({
        message:
          "Création de l'historique impossible : le sinistre n'existe pas",
      });
    }
  }

  if (user_id) {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({
        message:
          "Création de l'historique impossible : l'utilisateur n'existe pas",
      });
    }
  }

  const history = await History.create(req.body);
  res.status(201).json({ history });
};

const getHistoryByRequest = async (req, res) => {
  const histories = await History.findAll({
    where: { request_id: req.params.id },
  });
  res.status(200).json({ histories });
};

const getHistoryBySinister = async (req, res) => {
  const histories = await History.findAll({
    where: { sinister_id: req.params.id },
  });
  res.status(200).json({ histories });
};

const getHistoryByUser = async (req, res) => {
  const histories = await History.findAll({
    where: { user_id: req.params.id },
  });
  res.status(200).json({ histories });
};

module.exports = {
  getAllHistories,
  getHistory,
  createHistory,
  getHistoryByRequest,
  getHistoryBySinister,
  getHistoryByUser,
};
