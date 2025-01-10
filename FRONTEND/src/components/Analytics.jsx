import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Book, Clock, Award, Brain, Loader2 } from 'lucide-react';
import { api } from '../api/axios';


const formatTime = (seconds) => {
  if (!seconds) return '0m';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


const Analytics = ({ short = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-900 to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-6 bg-gradient-to-br from-gray-900 to-gray-800">
        Error loading analytics: {error}
      </div>
    );
  }

  // Transform data for charts
  const dailyActivityData = Object.entries(data?.dailyStats || {})
    .slice(-30) // Last 30 days
    .map(([date, stats]) => ({
      date: formatDate(date),
      revisions: stats.count,
      timeSpent: Math.round(stats.timeSpent / 60), // Convert to minutes
      confidence: stats.averageConfidence
    }));

  // Safely handle categoryStats for the BarChart
  const categoryData = data?.categoryStats?.length
    ? data.categoryStats
    : null;

  if (short) {
    return (
      <div className="space-y-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            icon={<Award className="w-6 h-6 text-emerald-400" />}
            title="Streak"
            value={data?.streaks?.currentStreak || 0}
          />
          <StatCard
            icon={<Brain className="w-6 h-6 text-blue-400" />}
            title="Confidence"
            value={(data?.overallStats?.averageConfidence || 0).toFixed(1)}
          />
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700/50">
          <div className="h-48">
            <ResponsiveContainer>
              <LineChart data={dailyActivityData}>
                <XAxis dataKey="date" stroke="#CBD5E1" />
                <YAxis stroke="#CBD5E1" />
                <Tooltip />
                <Line type="monotone" dataKey="revisions" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 rounded-lg shadow-xl border border-gray-700/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Book className="w-6 h-6 text-blue-400" />}
          title="Total Revisions"
          value={data?.overallStats?.totalRevisions || 0}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-emerald-400" />}
          title="Total Time"
          value={data?.overallStats?.totalTimeSpent || 0}
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-emerald-400" />}
          title="Current Streak"
          value={data?.streaks?.currentStreak || 0}
        />
        <StatCard
          icon={<Brain className="w-6 h-6 text-blue-400" />}
          title="Avg Confidence"
          value={(data?.overallStats?.averageConfidence || 0).toFixed(1)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700/50">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Daily Activity</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={dailyActivityData}>
                <XAxis dataKey="date" stroke="#CBD5E1" />
                <YAxis stroke="#CBD5E1" />
                <Tooltip />
                <Line type="monotone" dataKey="revisions" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700/50">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Categories</h3>
          <div className="h-64">
            {categoryData ? (
              <ResponsiveContainer>
                <BarChart data={categoryData}>
                  <XAxis dataKey="category" stroke="#CBD5E1" />
                  <YAxis stroke="#CBD5E1" />
                  <Tooltip />
                  <Bar dataKey="totalRevisions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400">No category data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700/50">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Recent Questions</h3>
        <RecentQuestions questions={data?.recentQuestions || []} />
      </div>
    </div>
  );
};

const QuestionCard = ({ question }) => {
  const lastRevisedDate = new Date(question.lastRevised);
  
  return (
      <div className="border-b border-gray-700/50 last:border-b-0 py-3">
          <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="font-semibold text-gray-200">{question.questionId}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                          {question.categories.map((category, index) => (
                              <span 
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                  {category}
                              </span>
                          ))}
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-sm text-gray-400">
                          {lastRevisedDate.toLocaleDateString()} 
                      </p>
                      <div className="flex items-center justify-end space-x-2 mt-1">
                          <span className="text-sm text-gray-400">
                              Time: {formatTime(question.timeSpent)}
                          </span>
                          <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                          i < question.confidence ? 'bg-emerald-400' : 'bg-gray-200'
                                      }`}
                                  />
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                  <span>Switches: {question.switches}</span>
                  <span>Hints: {question.shownHints}</span>
                  <span>Revision #{question.revisionCount}</span>
              </div>
          </div>
      </div>
  );
};

// Update the Recent Questions section in Analytics component:
const RecentQuestions = ({ questions }) => (
  <div className="space-y-4">
      {questions.map(question => (
          <QuestionCard 
              key={question.questionId}
              question={question}
          />
      ))}
  </div>
);


const StatCard = ({ icon, title, value }) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700/50">
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <p className="text-sm text-gray-300">{title}</p>
        <p className="text-xl font-bold text-gray-200">
          {title.includes('Time') ? formatTime(value) : value}
        </p>
      </div>
    </div>
  </div>
);



export default Analytics;
