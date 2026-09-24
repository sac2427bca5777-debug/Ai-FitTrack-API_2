import { useState } from 'react';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    const userMessage = message;

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: 'You',
        text: userMessage,
      },
    ]);

    setMessage('');
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        'http://localhost:5000/api/ai/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      console.log('Chatbot response:', data);

      if (!response.ok) {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            sender: 'AI',
            text: data.error || 'Failed to get AI response',
          },
        ]);
        return;
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: 'AI',
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: 'AI',
          text: 'Unable to connect to the backend.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chatbot-section">

      <div className="chatbot-card">

        <div className="chatbot-header">
          <h2>AI Fitness Assistant</h2>
          <p>
            Ask questions about workouts, fitness and exercise.
          </p>
        </div>

        <div className="chat-messages">

          {messages.length === 0 ? (
            <div className="chat-empty">
              <p>
                Ask me anything about your fitness and workouts.
              </p>
              <small>
                Example: What workout is good for a beginner?
              </small>
            </div>
          ) : (
            messages.map((chat, index) => (
              <div
                key={index}
                className={
                  chat.sender === 'You'
                    ? 'chat-message user-message'
                    : 'chat-message ai-message'
                }
              >
                <strong>{chat.sender}</strong>
                <p>{chat.text}</p>
              </div>
            ))
          )}

        </div>

        <form
          className="chat-form"
          onSubmit={handleSend}
        >

          <input
            type="text"
            placeholder="Ask a fitness question..."
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>

        </form>

      </div>

    </section>
  );
}

export default Chatbot;