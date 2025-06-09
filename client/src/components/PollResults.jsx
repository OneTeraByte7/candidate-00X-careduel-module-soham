import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function PollResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fill, setFill] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch('/data/results.json');
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Failed to fetch results', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setFill(true), 100);
    return () => clearTimeout(timeout);
  }, [results]);

  const totalVotes = results.reduce((acc, cur) => acc + cur.votes, 0);

  const chartData = {
    labels: results.map((r) => r.topic),
    datasets: [
      {
        label: 'Votes',
        data: results.map((r) => r.votes),
        backgroundColor: '#3949AB', // accent color
        borderRadius: 4,
      },
    ],
  };

  return (
    <div
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md"
      style={{ fontFamily: 'Roboto, sans-serif' }}
    >
      <h2 className="text-primary font-poppins text-2xl mb-4">Polling Results</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-6 space-y-4">
            {results.map(({ topic, votes }) => {
              const percent = totalVotes ? (votes / totalVotes) * 100 : 0;
              return (
                <div key={topic}>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>{topic}</span>
                    <span>{votes} votes ({percent.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-5 overflow-hidden">
                    <div
                      className={`bg-accent h-5 rounded transition-all duration-700 ease-out`}
                      style={{
                        width: fill ? `${percent}%` : '0%',
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <Bar
            data={chartData}
            options={{
              responsive: true,
              animation: {
                duration: 1000,
                easing: 'easeOutQuart',
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />

          <button
            onClick={() => {
              setFill(false);
              fetchResults();
            }}
            className="mt-6 px-4 py-2 font-semibold rounded border border-accent text-accent hover:bg-accent hover:text-white transition"
          >
            Refresh
          </button>
        </>
      )}
    </div>
  );
}
