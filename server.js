require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/plants', require('./routes/plantsRoutes'));
app.use('/api/shares', require('./routes/sharesRoutes'));
app.use('/api/reports', require('./routes/reportsRoutes'));

app.use(express.static(path.join(__dirname, 'client')));
app.get('/{*splat}', (req, res) => res.sendFile(path.join(__dirname, 'client/index.html')));

app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
