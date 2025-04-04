import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CountUp from "react-countup";
// Import icons individually to reduce bundle size
import { LuCalendar } from "react-icons/lu";
import { RiLoaderLine } from "react-icons/ri";
import { HiOutlineExternalLink } from "react-icons/hi";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { useLocation } from "react-router-dom";

const scrollToElement = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const Analytics = ({ short = false }) => {
  const { userAnalytics } = useContext(UserContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getLast30Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push({
        date: new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0],
        count: 0,
      });
    }
    return dates;
  };
  const { hash } = useLocation();

  useEffect(() => {
    if (hash && hash !== "#") {
      setTimeout(() => {
        scrollToElement(hash.substring(1));
      }, 100);
    }
  }, [hash]);

  if (userAnalytics === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <RiLoaderLine className="w-8 h-8 animate-spin text-[#ffffff8e]" />
      </div>
    );
  }

  const getConfidenceColor = (confidence) => {
    if (confidence <= 2) return "text-red-500";
    if (confidence === 3) return "text-yellow-500";
    return "text-green-500";
  };

  const activityData = getLast30Days().map((day) => ({
    ...day,
    count: userAnalytics.dailyStats[day.date]?.count || 0,
  }));

  return (
    <div
      className={`bg-neutral-900 rounded-lg space-y-6${
        short ? " pt-6" : " p-6"
      }`}
    >
      <div className="flex flex-col justify-between md:items-center md:flex-row gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-white">
            Quick Analytics
          </h3>
          <p className="text-neutral-400">Your learning progress at a glance</p>
        </div>
        {short && (
          <Link
            to="/analytics"
            className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors w-[100%] h-fit md:w-auto flex justify-center"
          >
            <p className="text-center">View Full Analytics</p>
          </Link>
        )}
      </div>
      <div className="sm:col-span-2 lg:col-span-3 rounded-xl hover:border-neutral-600 transition-all">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-blue-500">
                <CountUp end={userAnalytics.overallStats.totalQuestions} />
              </span>
              <span className="text-lg text-white mb-1">Total Notes</span>
              <span className="text-sm text-neutral-400">Notes</span>
            </div>
          </div>
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-purple-700">
                <CountUp end={userAnalytics.categoryDistributions.length} />
              </span>
              <span className="text-lg text-white mb-1">Topics</span>
              <span className="text-sm text-neutral-400">Total</span>
            </div>
          </div>
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-green-500">
                <CountUp
                  end={userAnalytics.overallStats.averageConfidence}
                  decimals={1}
                />
              </span>
              <span className="text-lg text-white mb-1">Avg. Confidence</span>
              <span className="text-sm text-neutral-400">Overall</span>
            </div>
          </div>
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-yellow-500">
                <CountUp end={userAnalytics.overallStats.totalRevisions} />
              </span>
              <span className="text-lg text-white mb-1">Total Revisions</span>
              <span className="text-sm text-neutral-400">Overall</span>
            </div>
          </div>
        </div>
      </div>

      {!short && (
        <>
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
              Topic Wise Notes Distribution
            </h3>
            <div className="space-y-4">
              {userAnalytics.categoryDistributions &&
              userAnalytics.categoryDistributions.length > 0 ? (
                (() => {
                  const total = userAnalytics.categoryDistributions.reduce(
                    (acc, obj) => acc + obj.count,
                    0
                  );
                  return userAnalytics.categoryDistributions.map((cat) => {
                    const percent = total
                      ? Math.round((cat.count / total) * 100)
                      : 0;
                    return (
                      <div key={cat.categoryName}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-neutral-400">
                            {cat.categoryName}
                          </span>
                          <span className="text-sm font-medium text-white">
                            {percent}%
                          </span>
                        </div>
                        <div className="h-2 bg-neutral-700 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()
              ) : (
                <div className="text-neutral-400">
                  No data available, Start{" "}
                  <Link
                    to="/generation"
                    className="text-blue-500 hover:underline"
                  >
                    generating
                  </Link>{" "}
                  notes and{" "}
                  <Link to="/rev" className="text-blue-500 hover:underline">
                    revising
                  </Link>{" "}
                  them
                </div>
              )}
            </div>
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
              Last Week Revision Activity
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {activityData.map((day) => (
                <div
                  key={day.date}
                  className={`h-14 w-full rounded flex items-center justify-center text-white ${
                    day.count > 0
                      ? "text-xs border border-green-700"
                      : "border border-neutral-700 hover:border-neutral-600 transition-all"
                  }`}
                  style={{
                    backgroundColor:
                      day.count === 0
                        ? "rgb(64,64 ,64,0.3)"
                        : `rgba(34,197,94 , ${day.count / 12})`,
                  }}
                  title={`${formatDate(day.date)}: ${day.count} revisions`}
                >
                  {day.count}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-blue-400 mb-2">
                  <CountUp
                    end={userAnalytics.overallStats.totalTimeSpent / 60}
                    decimals={2}
                  />
                </span>
                <span className="text-lg text-white mb-1">
                  Total Time Spent in min
                </span>
                <span className="text-sm text-neutral-400">for revising</span>
              </div>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-purple-700 mb-2">
                  <CountUp end={userAnalytics.overallStats.totalQuestions} />
                </span>
                <span className="text-lg text-white mb-1">Total Questions</span>
                <span className="text-sm text-neutral-400">Revised</span>
              </div>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-blue-400 mb-2">
                  <CountUp end={userAnalytics.streaks.currentStreak} />
                </span>
                <span className="text-lg text-white mb-1">Current Streak</span>
                <span className="text-sm text-neutral-400">Keep going!</span>
              </div>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-yellow-500 mb-2">
                  <CountUp end={userAnalytics.streaks.longestStreak} />
                </span>
                <span className="text-lg text-white mb-1">Longest Streak</span>
                <span className="text-sm text-neutral-400">Longest yet!</span>
              </div>
            </div>
          </div>

          <div
            className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg"
            id="recent-questions"
          >
            <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
              Recent Questions
            </h3>
            <div className="space-y-2">
              {userAnalytics.recentQuestions &&
              userAnalytics.recentQuestions.length > 0 ? (
                userAnalytics.recentQuestions.map((question) => (
                  <div
                    key={question.questionId}
                    className="bg-neutral-700/30 border border-neutral-600/50 p-3 rounded transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/home/questions/${question.questionId}`}
                        className="block"
                      >
                        <span className="text-white hover:underline hover:underline-offset-2">
                          {question.name}{" "}
                          <HiOutlineExternalLink className="inline" />
                        </span>
                      </Link>
                      <span
                        className={`${getConfidenceColor(question.confidence)}`}
                      >
                        Confidence: {question.confidence}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-400 mt-1 flex items-center gap-1">
                      <LuCalendar className="w-4 h-4" />
                      Last revised: {formatDate(question.lastRevised)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-neutral-400">
                  No data available, Start{" "}
                  <Link
                    to="/generation"
                    className="text-blue-500 hover:underline"
                  >
                    generating
                  </Link>{" "}
                  notes and{" "}
                  <Link to="/rev" className="text-blue-500 hover:underline">
                    revising
                  </Link>{" "}
                  them
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
