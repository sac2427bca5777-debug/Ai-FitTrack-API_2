import { useState } from 'react';

function AddWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [category, setCategory] = useState('Cardio');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        'http://localhost:5000/api/workouts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            workoutName,
            category,
            duration: Number(duration),
            caloriesBurned: Number(caloriesBurned),
          }),
        }
      );

      const data = await response.json();

      console.log('Add workout response:', data);

      if (!response.ok) {
        setMessage(data.error || 'Failed to add workout');
        return;
      }

      setMessage('Workout added successfully!');

      setWorkoutName('');
      setDuration('');
      setCaloriesBurned('');
    } catch (error) {
      console.error('Add workout error:', error);
      setMessage('Unable to connect to the backend');
    }
  };

  return (
    <section className="workout-section">
      <div className="section-card">
        <h2>Add New Workout</h2>
        <p className="section-description">
          Record your workout and track your progress.
        </p>

        <form onSubmit={handleSubmit}>

          <div>
            <label>Workout Name</label>
            <input
              type="text"
              placeholder="Example: Morning Run"
              value={workoutName}
              onChange={(event) =>
                setWorkoutName(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="Cardio">Cardio</option>
              <option value="Strength Training">
                Strength Training
              </option>
              <option value="Yoga">Yoga</option>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Walking">Walking</option>
            </select>
          </div>

          <div>
            <label>Duration (minutes)</label>
            <input
              type="number"
              placeholder="Example: 30"
              value={duration}
              onChange={(event) =>
                setDuration(event.target.value)
              }
              min="1"
              required
            />
          </div>

          <div>
            <label>Calories Burned</label>
            <input
              type="number"
              placeholder="Example: 250"
              value={caloriesBurned}
              onChange={(event) =>
                setCaloriesBurned(event.target.value)
              }
              min="0"
              required
            />
          </div>

          <button type="submit">
            Add Workout
          </button>

        </form>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

export default AddWorkout;