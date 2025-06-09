import React from 'react';
import ProposeTopicForm from './components/ProposeTopicForm';
import PollResults from './components/PollResults';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-roboto">
      {/* Header */}
      <header className="bg-red-600 text-white py-6 shadow-md">
        <h1 className="text-center text-4xl font-poppins font-bold">CareDuel</h1>
        <p className="text-center text-sm mt-1">Where causes clash for a better world 🌍</p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Module 3: Propose a Topic */}
        <section className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black-700">Propose a New Duel Topic</h2>
          <ProposeTopicForm />
        </section>

        {/* Module 4: View Poll Results */}
        <section className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black-700">Live Poll Results</h2>
          <PollResults />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-center py-4 text-sm text-white-500 border-t mt-12">
        &copy; {new Date().getFullYear()} CareDuel.com. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
