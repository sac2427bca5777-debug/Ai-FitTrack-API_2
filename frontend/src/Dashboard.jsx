import { useEffect, useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(
          'http://localhost:5000/api/workouts/dashboard',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log('Dashboard response:', data);

        if (!response.ok) {
          setError(data.error || 'Failed to load dashboard');
          return;
        }

        setStats(data.data);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError('Unable to connect to the backend');
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return (
      <section className="dashboard-section">
        <h1>AI FitTrack Dashboard</h1>
        <p>{error}</p>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="dashboard-section">
        <h1>AI FitTrack Dashboard</h1>
        <p>Loading dashboard...</p>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <div>
          <h1>AI FitTrack</h1>
          <p>Your fitness progress at a glance</p>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Workouts</h3>
          <strong>{stats.totalWorkouts}</strong>
          <p>Workouts completed</p>
        </div>

        <div className="stat-card">
          <h3>Total Duration</h3>
          <strong>{stats.totalDuration}</strong>
          <p>Minutes exercised</p>
        </div>

        <div className="stat-card">
          <h3>Calories Burned</h3>
          <strong>{stats.totalCalories}</strong>
          <p>Calories burned</p>
        </div>

        <div className="stat-card">
          <h3>Average Duration</h3>
          <strong>{stats.averageDuration}</strong>
          <p>Minutes per workout</p>
        </div>

      </div>

      <div className="category-card">
        <h3>Most Frequent Workout</h3>
        <strong>
          {stats.mostFrequentCategory || 'No workouts yet'}
        </strong>
      </div>
    </section>
  );
}

export default Dashboard;