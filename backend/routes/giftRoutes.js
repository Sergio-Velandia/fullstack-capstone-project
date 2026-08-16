const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db');
const logger = require('../logger');

// Obtener todos los artículos disponibles
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const gifts = await collection.find({}).toArray();

    res.json(gifts);
  } catch (e) {
    logger.error('Error al obtener los artículos', e);
    next(e);
  }
});

// Obtener un artículo específico por ID
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const id = req.params.id;

    const gift = await collection.findOne({ id: id });

    if (!gift) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json(gift);
  } catch (e) {
    logger.error('Error al obtener el artículo', e);
    next(e);
  }
});

module.exports = router;
