const shareModel = require('../models/shareModel');
const plantModel = require('../models/plantModel');
const historyModel = require('../models/historyModel');
const pool = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const requests = await shareModel.getAllForUser(req.user.id);
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const request = await shareModel.getById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Запрос на обмен не найден' });
    const wantedPlant = await plantModel.getById(request.wanted_plant_id);
    const isParticipant = request.requester_id === req.user.id ||
      (wantedPlant && wantedPlant.user_id === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'Нет доступа' });
    res.json(request);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { offered_plant_id, wanted_plant_id, message } = req.body;
    if (!offered_plant_id || !wanted_plant_id) {
      return res.status(400).json({ message: 'Поля offered_plant_id и wanted_plant_id обязательны' });
    }
    const offeredPlant = await plantModel.getById(offered_plant_id);
    if (!offeredPlant) return res.status(404).json({ message: 'Предлагаемое растение не найдено' });
    if (offeredPlant.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Вы не являетесь владельцем предлагаемого растения' });
    }
    const wantedPlant = await plantModel.getById(wanted_plant_id);
    if (!wantedPlant) return res.status(404).json({ message: 'Желаемое растение не найдено' });
    if (wantedPlant.user_id === req.user.id) {
      return res.status(400).json({ message: 'Нельзя создать запрос на обмен со своим же растением' });
    }
    if (!offeredPlant.is_available || !wantedPlant.is_available) {
      return res.status(400).json({ message: 'Оба растения должны быть доступны для обмена' });
    }
    const request = await shareModel.create({
      requester_id: req.user.id,
      offered_plant_id,
      wanted_plant_id,
      message,
    });
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

const accept = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const request = await shareModel.getById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Запрос на обмен не найден' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Запрос уже не является ожидающим' });
    }
    const wantedPlant = await plantModel.getById(request.wanted_plant_id);
    if (!wantedPlant || wantedPlant.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Принять обмен может только владелец желаемого растения' });
    }

    await client.query('BEGIN');
    await client.query(
      'UPDATE share_requests SET status = $1, updated_at = NOW() WHERE id = $2',
      ['accepted', request.id]
    );
    await client.query('UPDATE plants SET is_available = false WHERE id = $1', [request.offered_plant_id]);
    await client.query('UPDATE plants SET is_available = false WHERE id = $1', [request.wanted_plant_id]);
    const { rows: histRows } = await client.query(
      'INSERT INTO share_history (share_request_id, plant1_id, plant2_id, user1_id, user2_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [request.id, request.offered_plant_id, request.wanted_plant_id, request.requester_id, req.user.id]
    );
    await client.query('COMMIT');
    res.json({ message: 'Обмен принят', history: histRows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

const reject = async (req, res, next) => {
  try {
    const request = await shareModel.getById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Запрос на обмен не найден' });
    const wantedPlant = await plantModel.getById(request.wanted_plant_id);
    const isParticipant = request.requester_id === req.user.id ||
      (wantedPlant && wantedPlant.user_id === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'Нет доступа' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Запрос уже не является ожидающим' });
    }
    const updated = await shareModel.updateStatus(req.params.id, 'rejected');
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const request = await shareModel.getById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Запрос на обмен не найден' });
    if (request.requester_id !== req.user.id) return res.status(403).json({ message: 'Нет доступа' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Можно удалить только ожидающий запрос' });
    }
    await shareModel.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await historyModel.getByUserId(req.user.id);
    res.json(history);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, accept, reject, delete: remove, getHistory };
