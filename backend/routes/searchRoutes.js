const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    let query = {};

    // Filtrar por nombre (búsqueda de texto)
    if (req.query.name && req.query.name.trim() !== '') {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    // Filtrar por categoría
    if (req.query.category && req.query.category.trim() !== '') {
      query.category = req.query.category;
    }

    // Filtrar por condición
    if (req.query.condition && req.query.condition.trim() !== '') {
      query.condition = req.query.condition;
    }

    // Filtrar por edad máxima en años
    if (req.query.age_years) {
      query.age_years = { $lte: parseInt(req.query.age_years) };
    }

    const gifts = await collection.find(query).toArray();

    res.json(gifts);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
