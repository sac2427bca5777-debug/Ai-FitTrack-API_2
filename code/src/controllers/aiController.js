const geminiService = require('../services/geminiService');
const Workout = require('../models/Workout');

// @desc    Get AI workout recommendation
// @route   POST /api/ai/workout-recommendation
// @access  Private
const getWorkoutRecommendation = async (req, res, next) => {
  try {
    const { age, fitnessGoal, experience } = req.body;

    // Validate inputs
    if (age === undefined || !fitnessGoal || !experience) {
      return res.status(400).json({
        success: false,
        error: 'Please provide age, fitnessGoal, and experience',
      });
    }

    // Call service to get recommendation from Gemini AI
    const recommendation = await geminiService.generateWorkoutRecommendation(
      age,
      fitnessGoal,
      experience
    );

    res.status(200).json({
      recommendation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI fitness insights
// @route   POST /api/ai/fitness-insights
// @access  Private
const getFitnessInsights = async (req, res, next) => {
  try {
    // Get all workouts of the logged-in user
    const workouts = await Workout.find({
      user: req.user._id,
    });

    // Calculate total workouts
    const totalWorkouts = workouts.length;

    // Calculate total duration
    const totalDuration = workouts.reduce(
      (total, workout) => total + workout.duration,
      0
    );

    // Calculate total calories
    const totalCaloriesBurned = workouts.reduce(
      (total, workout) => total + workout.caloriesBurned,
      0
    );

    // Calculate average duration
    const averageDuration =
      totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

    // Call Gemini AI
    const insight = await geminiService.generateFitnessInsights(
      totalWorkouts,
      averageDuration,
      totalCaloriesBurned
    );

    res.status(200).json({
      insight,
    });
  } catch (error) {
    next(error);
  }
};
const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message',
      });
    }

    const response = await geminiService.generateChatResponse(
      message
    );

    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkoutRecommendation,
  getFitnessInsights,
  chatWithAI,
};