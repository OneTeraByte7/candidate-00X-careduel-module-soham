import React, { useState } from 'react';

export default function ProposeTopicForm() {
  const [topic, setTopic] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/suggest-topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setTopic('');
        setUserEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to server' });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow-md"
      style={{ fontFamily: 'Roboto, sans-serif' }}
    >
      <h2 className="text-primary font-poppins text-2xl mb-4">Propose a Topic</h2>

      <label className="block mb-2 font-semibold" htmlFor="topic">Topic</label>
      <input
        id="topic"
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        required
      />

      <label className="block mb-2 font-semibold" htmlFor="email">Your Email</label>
      <input
        id="email"
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 font-semibold rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>


      {message && (
        <p className={`mt-4 ${message.type === 'success' ? 'text-green-600' : 'text-primary'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
