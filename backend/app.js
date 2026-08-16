const express = require('express');
const cors = require('cors');
const path = require('path');
const pinoLogger = require('./logger');

const connectToDatabase = require('./db');
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectToDatabase()
  .then(() => {
    pinoLogger.info('Conectado a la base de datos MongoDB');
  })
  .catch((e) => console.error('Error de conexión a la base de datos', e));

app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Inside the server');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

const PORT = process.env.PORT || 3060;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
