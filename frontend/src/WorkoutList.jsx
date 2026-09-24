import { useEffect, useState } from 'react';

function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');
  const [editingWorkout, setEditingWorkout] = useState(null);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://localhost:5000/api/workouts/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to delete workout');
        return;
      }

      setWorkouts((previousWorkouts) =>
        previousWorkouts.filter(
          (workout) => workout._id !== id
        )
      );
    } catch (error) {
      console.error('Delete workout error:', error);
      setError('Unable to connect to the backend');
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://localhost:5000/api/workouts/${editingWorkout._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            workoutName: editingWorkout.workoutName,
            duration: editingWorkout.duration,
            caloriesBurned: editingWorkout.caloriesBurned,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update workout');
        return;
      }

      setWorkouts((previousWorkouts) =>
        previousWorkouts.map((workout) =>
          workout._id === editingWorkout._id
            ? data.data
            : workout
        )
      );

      setEditingWorkout(null);
      setError('');
    } catch (error) {
      console.error('Update workout error:', error);
      setError('Unable to connect to the backend');
    }
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(
          'http://localhost:5000/api/workouts',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load workouts');
          return;
        }

        setWorkouts(data.data);
      } catch (error) {
        console.error('Workout list error:', error);
        setError('Unable to connect to the backend');
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <section className="workouts-section">

      <div className="workouts-header">
        <h2>My Workouts</h2>
        <p>View and manage your workout history.</p>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {workouts.length === 0 ? (
        <div className="empty-workouts">
          <h3>No workouts found</h3>
          <p>Add your first workout to start tracking your progress.</p>
        </div>
      ) : (
        <div className="workout-grid">

          {workouts.map((workout) => (
            <div
              className="workout-card"
              key={workout._id}
            >

              <h3>{workout.workoutName}</h3>

              <span className="workout-category">
                {workout.category}
              </span>

              <div className="workout-details">
                <p>
                  <strong>Duration:</strong>{' '}
                  {workout.duration} minutes
                </p>

                <p>
                  <strong>Calories:</strong>{' '}
                  {workout.caloriesBurned} kcal
                </p>
              </div>

              <div className="workout-actions">

                <button
                  onClick={() =>
                    setEditingWorkout(workout)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(workout._id)
                  }
                >
                  Delete
                </button>

              </div>

              {editingWorkout?._id === workout._id && (
                <div className="edit-box">

                  <h4>Edit Workout</h4>

                  <input
                    type="text"
                    value={editingWorkout.workoutName}
                    onChange={(event) =>
                      setEditingWorkout({
                        ...editingWorkout,
                        workoutName: event.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    value={editingWorkout.duration}
                    onChange={(event) =>
                      setEditingWorkout({
                        ...editingWorkout,
                        duration: Number(event.target.value),
                      })
                    }
                  />

                  <input
                    type="number"
                    value={editingWorkout.caloriesBurned}
                    onChange={(event) =>
                      setEditingWorkout({
                        ...editingWorkout,
                        caloriesBurned: Number(event.target.value),
                      })
                    }
                  />

                  <button onClick={handleUpdate}>
                    Save Changes
                  </button>

                  <button
                    className="cancel-button"
                    onClick={() =>
                      setEditingWorkout(null)
                    }
                  >
                    Cancel
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default WorkoutList;