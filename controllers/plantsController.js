const plantModel = require('../models/plantModel');

const getAll = async (req, res, next) => {
  try {
    const { type, region } = req.query;
    const plants = await plantModel.getAll({ type, region });
    res.json(plants);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const plant = await plantModel.getById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Растение не найдено' });
    res.json(plant);
  } catch (err) {
    next(err);
  }
};

const getMyPlants = async (req, res, next) => {
  try {
    const plants = await plantModel.getByUserId(req.user.id);
    res.json(plants);
  } catch (err) {
    next(err);
  }
};

const getCompatible = async (req, res, next) => {
  try {
    const plants = await plantModel.getCompatible(req.user.id);
    res.json(plants);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, type, description, region } = req.body;
    if (!name) return res.status(400).json({ message: 'Поле name обязательно' });
    const plant = await plantModel.create({
      user_id: req.user.id,
      name, type, description, region,
    });
    res.status(201).json(plant);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const plant = await plantModel.getById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Растение не найдено' });
    if (plant.user_id !== req.user.id) return res.status(403).json({ message: 'Нет доступа' });
    const updated = await plantModel.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const plant = await plantModel.getById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Растение не найдено' });
    if (plant.user_id !== req.user.id) return res.status(403).json({ message: 'Нет доступа' });
    await plantModel.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, getMyPlants, getCompatible, create, update, delete: remove };
