function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Необходима авторизация' })
  }
  next()
}

function requireUser(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Необходима авторизация' })
  }
  if (req.session.role !== 'user') {
    return res.status(403).json({ error: 'Доступ запрещён' })
  }
  next()
}

function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Необходима авторизация' })
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещён' })
  }
  next()
}

module.exports = { requireAuth, requireUser, requireAdmin }
