import { useState } from 'react';

function AIRecommendation() {
  const [age, setAge] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        'http://localhost:5000/api/ai/workout-recommendation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            age: Number(age),
            fitnessGoal,
            experience,
          }),
        }
      );

      const data = await response.json();

      console.log('AI Recommendation response:', data);

      if (!response.ok) {
        setError(
          data.error || 'Failed to generate recommendation'
        );
        return;
      }

      setRecommendation(data.recommendation);
      setError('');
    } catch (error) {
      console.error('AI recommendation error:', error);
      setError('Unable to connect to the backend');
    }
  };

  return (
    <section className="ai-section">

      <div className="ai-card">

        <div className="ai-header">
          <h2>AI Workout Recommendation</h2>
          <p>
            Get a personalized workout plan using AI.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div>
            <label>Age</label>

            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(event) =>
                setAge(event.target.value)
              }
              min="1"
              required
            />
          </div>

          <div>
            <label>Fitness Goal</label>

            <input
              type="text"
              placeholder="Example: Weight loss"
              value={fitnessGoal}
              onChange={(event) =>
                setFitnessGoal(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label>Experience Level</label>

            <select
              value={experience}
              onChange={(event) =>
                setExperience(event.target.value)
              }
              required
            >
              <option value="">
                Select experience
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>

          <button type="submit">
            Generate AI Recommendation
          </button>

        </form>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {recommendation && (
          <div className="ai-result">

            <h3>Your Personalized Recommendation</h3>

            <p>{recommendation}</p>

          </div>
        )}

      </div>

    </section>
  );
}

export default AIRecommendation;