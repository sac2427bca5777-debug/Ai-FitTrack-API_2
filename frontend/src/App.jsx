import { useState } from 'react';
import Dashboard from './Dashboard';
import AddWorkout from './AddWorkout';
import WorkoutList from './WorkoutList';
import AIRecommendation from './AIRecommendation';
import Chatbot from './Chatbot';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    const body = isLogin
      ? {
          email,
          password,
        }
      : {
          name,
          email,
          password,
        };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log('Server response:', data);

      if (!response.ok) {
        alert(data.error || 'Something went wrong');
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
      }

      alert(
        isLogin
          ? 'Login successful!'
          : 'Registration successful!'
      );
    } catch (error) {
      console.error('Error:', error);
      alert('Unable to connect to the backend');
    }
  };

  // Logged-in page
  if (isLoggedIn) {
    return (
      <div className="app-container">

        <button
          onClick={() => {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>

        <Dashboard />

        <hr />

        <AddWorkout />

        <hr />

        <WorkoutList />

        <hr />

        <AIRecommendation />

        <hr />

        <Chatbot />

      </div>
    );
  }

  // Login / Register page
  return (
    <div className="login-page">

      <div className="login-card">

        <h1>AI FitTrack</h1>

        <p>Your personal AI fitness tracker</p>

        <h2>
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div>
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>
          )}

          <div>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          <button type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>

        </form>

        <p>
          {isLogin
            ? "Don't have an account?"
            : 'Already have an account?'}
        </p>

        <button
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? 'Create Account'
            : 'Go to Login'}
        </button>

      </div>

    </div>
  );
}

export default App;