const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const register = async (req, res, next) => {
  try {
    const { username, email, password, region } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Поля username, email и password обязательны' });
    }
    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Этот email уже используется' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password_hash, region });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Поля email и password обязательны' });
    }
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
