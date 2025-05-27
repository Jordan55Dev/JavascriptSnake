const express = require('express');
const router = express.Router();
const Score = require('../models/score');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/submit', async (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') return res.status(400).send("Invalid data");

    const newScore = new Score({ name, score });
    await newScore.save();
    res.status(201).send("Score saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1, date: 1 }).limit(10);
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.use((req, res) => {
  res.status(404).render('error', {
    errorMessage: 'Page not found (404)'
  });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    errorMessage: 'Internal server error (500)'
  });
});

module.exports = router;
