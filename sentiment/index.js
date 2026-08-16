const express = require('express');
const natural = require('natural');
const router = express.Router();
const connectToDatabase = require('../backend/db');

const TfIdf = natural.TfIdf;

// Recomienda artículos similares en función de la descripción usando TF-IDF
router.get('/recommend/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    const gifts = await collection.find({}).toArray();
    const targetGift = gifts.find((g) => g.id === req.params.id);

    if (!targetGift) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    const tfidf = new TfIdf();
    gifts.forEach((gift) => {
      tfidf.addDocument(gift.description || '');
    });

    const targetIndex = gifts.findIndex((g) => g.id === req.params.id);
    const scores = [];

    tfidf.tfidfs(targetGift.description || '', (i, measure) => {
      if (i !== targetIndex) {
        scores.push({ gift: gifts[i], score: measure });
      }
    });

    scores.sort((a, b) => b.score - a.score);
    const recommendations = scores.slice(0, 3).map((s) => s.gift);

    res.json(recommendations);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
