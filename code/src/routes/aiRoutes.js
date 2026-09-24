const express = require('express');

const {
  getWorkoutRecommendation,
  getFitnessInsights,
  chatWithAI,
} = require('../controllers/aiController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/workout-recommendation', getWorkoutRecommendation);

router.post('/fitness-insights', getFitnessInsights);

router.post('/chat', chatWithAI);

module.exports = router;