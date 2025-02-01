import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import BuyPremium from "../components/BuyPremium";
const Revision = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [traverseIndex, setTraverseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showingSolution, setShowingSolution] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [analytics, setAnalytics] = useState({
    switches: 0,
    usedHints: false,
    startTime: null,
    shownHints: [],
  });
  const [confidence, setConfidence] = useState(0);

  const startTimeRef = useRef(null);
  const switchesRef = useRef(0);
  useEffect(() => {
    api
      .get("/rev")
      .then((res) => {
        if (res.data.status) {
          setQuestions(res.data.questions);
          setLoading(false);
          startTimeRef.current = Date.now();
          setAnalytics((prev) => ({ ...prev, startTime: Date.now() }));
        } else {
          setError(res.data.reason);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const toggleSolution = () => {
    setShowingSolution(!showingSolution);
    switchesRef.current += 1;
    setAnalytics((prev) => ({
      ...prev,
      switches: switchesRef.current,
    }));
    if (showingSolution && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      resetAnalytics();
    }
  };

  const showNextHint = () => {
    const nextIndex = currentHintIndex + 1;
    setCurrentHintIndex(nextIndex);
    setAnalytics((prev) => ({
      ...prev,
      usedHints: true,
      shownHints: [...prev.shownHints, nextIndex],
    }));
  };

  const submitRevision = () => {
    if (confidence === 0) {
      toast("Please rate your confidence before completing the revision.", {
        icon: <FaInfoCircle />,
      });
      return;
    }

    const revisionData = {
      questionId: currentQuestion.id,
      timeSpent: (Date.now() - analytics.startTime) / 1000,
      switches: analytics.switches,
      usedHints: analytics.usedHints,
      confidence: confidence,
      category: currentQuestion.categories,
      shownHints: analytics.shownHints.length,
    };

    api
      .post("/sch_next_rev", revisionData)
      .then((res) =>
        toast.success(res.data.message || "Revision submitted successfully")
      )
      .catch((err) => console.error(err));
    setCurrentQuestionIndex((prev) => prev + 1);
    setTraverseIndex((prev) => prev + 1);
    setConfidence(0);
    resetAnalytics();
  };

  const resetAnalytics = () => {
    setAnalytics({
      switches: 0,
      usedHints: false,
      startTime: Date.now(),
      shownHints: [],
    });
    setShowingSolution(false);
    setConfidence(0);
    setCurrentHintIndex(-1);
    switchesRef.current = 0;
  };

  if (loading) {
    return (<>
       <div className="px-4 md:px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Revision
          </h1>
          <p className="text-neutral-400">
          Concepts that have been practiced so far
          </p>
        </div>
      <div className="bg-neutral-900 h-[50vh] flex items-center justify-center text-white">
        Loading...
      </div>
      </>
    );
  }
  if (error) {
    return (
      <>
          <div className="px-4 md:px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Revision
          </h1>
          <p className="text-neutral-400">
          Concepts that have been practiced so far
          </p>
        </div>
      <div className="bg-neutral-900 h-[50vh] flex items-center justify-center p-4 text-red-400">
        {error}
      </div>
      </>
    );
  }
  if (!currentQuestion) {
    return (
      <div className="px-4 md:px-6 py-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Revision
          </h1>
          <p className="text-neutral-400">
          Concepts that have been practiced so far
          </p>
        </div>
        <div className="bg-neutral-900 min-h-[80vh] flex flex-col items-center justify-center p-4 text-neutral-400 whitespace-break-spaces">
          No questions left for today, check out{" "}
          <Link
            className="block text-blue-500 hover:underline"
            to="/analytics#recent-questions"
          >
            {"recent revisions"}
          </Link>
          <BuyPremium />
        </div>
      </div>
    );
  }

  // Helper for hint button text
  const getHintButtonText = () => {
    if (currentHintIndex === -1) return "Show First Hint";
    if (currentHintIndex === currentQuestion.hints.length - 2)
      return "Show Final Hint";
    if (currentHintIndex >= currentQuestion.hints.length - 1)
      return "No More Hints";
    return "Show Next Hint";
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Revision
          </h1>
          <p className="text-neutral-400">
          Concepts that have been practiced so far
          </p>
        </div>
        <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-6 space-y-4">
          {/* Question Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-lg font-medium mb-2 md:mb-0">
              Question {currentQuestionIndex + 1}
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm border border-neutral-700/30 text-neutral-400"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Question / Solution */}
          <div className="bg-neutral-700/50 border border-neutral-700/30 rounded-xl p-4">
            {showingSolution ? (
              <div className="space-y-2">
                <h3 className="text-sm text-neutral-400 font-medium">
                  Solution
                </h3>
                <pre className="text-sm overflow-x-auto">
                  <code>{currentQuestion.code}</code>
                </pre>
              </div>
            ) : (
              <div className="text-sm whitespace-break-spaces">
                {currentQuestion.question}
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSolution}
            className="px-4 py-2 bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 rounded-lg text-sm transition-all"
          >
            {showingSolution ? "Back to question" : "Show Solution"}
          </button>

          {/* Hint System */}
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <div className="text-sm text-blue-400">Need help?</div>
                <div className="text-sm text-white">
                  Use a hint to refresh your memory
                </div>
              </div>
            </div>
            <button
              onClick={showNextHint}
              disabled={currentHintIndex >= currentQuestion.hints?.length - 1}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
            >
              {`${getHintButtonText()} (${
                (currentQuestion.hints?.length || 0) - (currentHintIndex + 1)
              } left)`}
            </button>
          </div>

          {/* Display Revealed Hints */}
          {!!(currentHintIndex + 1) && (
            <div className="space-y-3">
              {currentQuestion.hints
                ?.slice(0, currentHintIndex + 1)
                .map((hint, index) => (
                  <div
                    key={index}
                    className="bg-neutral-700/50 border border-neutral-700/30 rounded-xl p-3 text-sm text-yellow-400"
                  >
                    <strong>Hint {index + 1}:</strong> {hint}
                  </div>
                ))}
            </div>
          )}

          {currentQuestionIndex == traverseIndex && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-400">
                Rate your confidence
              </label>
              <div className="flex space-x-4">
                {[1, 2].map((value) => (
                  <button
                    key={value}
                    className={`px-4 py-2 rounded-lg border border-red-500/30 text-red-400 
                    hover:bg-red-500/10 ${
                      confidence === value
                        ? "bg-red-500/30 hover:bg-red-500/20"
                        : ""
                    }`}
                    onClick={() => setConfidence(value)}
                  >
                    {value}
                  </button>
                ))}
                <button
                  className={`px-4 py-2 rounded-lg border border-yellow-500/30 text-yellow-400 
                  hover:bg-yellow-500/10 ${
                    confidence === 3
                      ? "bg-yellow-500/30 hover:bg-yellow-500/20"
                      : ""
                  }`}
                  onClick={() => setConfidence(3)}
                >
                  3
                </button>
                {[4, 5].map((value) => (
                  <button
                    key={value}
                    className={`px-4 py-2 rounded-lg border border-green-500/30 text-green-400 
                    hover:bg-green-500/10 ${
                      confidence === value
                        ? "bg-green-500/30 hover:bg-green-500/20"
                        : ""
                    }`}
                    onClick={() => setConfidence(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Stats */}
        {currentQuestionIndex == traverseIndex && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Switches */}
            <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-4">
              <div className="text-sm text-neutral-400">Switches</div>
              <div className="text-2xl font-bold">{analytics.switches}</div>
            </div>
            {/* Hints */}
            <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-4">
              <div className="text-sm text-neutral-400">Hints Used</div>
              <div className="text-2xl font-bold">
                {analytics.shownHints.length}/
                {currentQuestion.hints?.length || 0}
              </div>
            </div>
            {/* Time */}
            <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-4">
              <div className="text-sm text-neutral-400">Time (s)</div>
              <div className="text-2xl font-bold">
                {Math.floor((Date.now() - analytics.startTime) / 1000)}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center ">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex((prev) => prev - 1);
                resetAnalytics();
              } else {
                toast("There are no previous questions", {
                  icon: <FaInfoCircle />,
                });
              }
            }}
            className={`px-4 py-2 text-neutral-400 flex items-center border border-neutral-700/30  transition-all rounded-lg cursor-pointer  ${
              currentQuestionIndex > 0
                ? "hover:border-neutral-600/50 bg-neutral-800 hover:bg-neutral-700/50"
                : "bg-neutral-800/50 "
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <button
            onClick={submitRevision}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
          >
            <Check className="w-4 h-4 mr-2" />
            Submit Answer
          </button>

          <button
            onClick={() => {
              if (currentQuestionIndex < traverseIndex) {
                setCurrentQuestionIndex((prev) => prev + 1);
                resetAnalytics();
              } else {
                toast("complete the revision of the current question", {
                  icon: <FaInfoCircle />,
                });
              }
            }}
            className={`px-4 py-2 text-neutral-400 flex items-center border border-neutral-700/30  transition-all rounded-lg cursor-pointer ${
              currentQuestionIndex < traverseIndex
                ? "hover:border-neutral-600/50 bg-neutral-800 hover:bg-neutral-700/50"
                : "bg-neutral-800/50 "
            }`}
            // disabled={currentQuestionIndex === traverseIndex}
          >
            Next
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Revision;
