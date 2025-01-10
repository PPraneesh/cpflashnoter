import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { FaInfoCircle } from "react-icons/fa";

const Revision = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showingSolution, setShowingSolution] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [analytics, setAnalytics] = useState({
    switches: 0,
    usedHints: false,
    startTime: null,
    shownHints: []
  });
  const [confidence, setConfidence] = useState(0);
  
  const startTimeRef = useRef(null);
  const switchesRef = useRef(0);

  useEffect(() => {
    api.get('/rev')
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
        startTimeRef.current = Date.now();
        setAnalytics(prev => ({ ...prev, startTime: Date.now() }));
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const toggleSolution = () => {
    setShowingSolution(!showingSolution);
    switchesRef.current += 1;
    setAnalytics(prev => ({
      ...prev,
      switches: switchesRef.current
    }));
    if (showingSolution && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      resetAnalytics();
    }
  };

  const showNextHint = () => {
    const nextIndex = currentHintIndex + 1;
    setCurrentHintIndex(nextIndex);
    setAnalytics(prev => ({
      ...prev,
      usedHints: true,
      shownHints: [...prev.shownHints, nextIndex]
    }));
  };

  const submitRevision = () => {
    if (confidence === 0) {
      toast("Please rate your confidence before completing the revision.", { icon: <FaInfoCircle /> });
      return;
    }

    const revisionData = {
      questionId: currentQuestion.id,
      timeSpent: (Date.now() - analytics.startTime) / 1000, // Time in seconds
      switches: analytics.switches,
      usedHints: analytics.usedHints,
      confidence: confidence,
      category: currentQuestion.categories,
      shownHints: analytics.shownHints.length
    };

    api.post("/sch_next_rev", revisionData)
      .then((res) => toast.success(res.data.message || "Revision submitted successfully"))
      .catch((err) => console.error(err));
  };

  const resetAnalytics = () => {
    setAnalytics({
      switches: 0,
      usedHints: false,
      startTime: Date.now(),
      shownHints: []
    });
    setShowingSolution(false);
    setConfidence(0);
    setCurrentHintIndex(-1);
    switchesRef.current = 0;
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!currentQuestion) return <div className="text-center p-4">No questions available</div>;

  const getHintButtonText = () => {
    if (currentHintIndex === -1) return "Show First Hint";
    if (currentHintIndex === currentQuestion.hints.length - 2) return "Show Final Hint";
    if (currentHintIndex >= currentQuestion.hints.length - 1) return "No More Hints";
    return "Show Next Hint";
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h2>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.categories.map((category, index) => (
                <span key={index} className="px-2 py-1 bg-blue-500 rounded-full text-xs">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {/* Question/Solution Toggle */}
          <div className="mb-6">
            {showingSolution ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Solution</h3>
                </div>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{currentQuestion.code}</code>
                </pre>
              </>
            ) : (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap mb-4">{currentQuestion.question}</div>
              </div>
            )}
          </div>
                <button
                  onClick={toggleSolution}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
                >
                  {showingSolution ? "Back to question" :"Show Solution"}
                </button>

          {/* Hints Section */}
          <div className="mb-6">
            <div className="space-y-3">
              {currentQuestion.hints?.slice(0, currentHintIndex + 1).map((hint, index) => (
                <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <div className="text-sm text-yellow-800 font-medium mb-1">
                    Hint {index + 1}
                  </div>
                  <div className="text-sm">{hint}</div>
                </div>
              ))}
            </div>
            {currentHintIndex < (currentQuestion.hints?.length - 1) && (
              <button
                onClick={showNextHint}
                className="mt-3 w-full py-2 px-4 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
              >
                {getHintButtonText()}
              </button>
            )}
          </div>

          {/* Confidence Rating */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Rate your confidence</h3>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setConfidence(rating)}
                  className={`py-2 rounded text-sm ${
                    confidence === rating
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-gray-600">Switches</div>
              <div className="font-medium">{analytics.switches}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-gray-600">Hints</div>
              <div className="font-medium">{analytics.shownHints.length}/{currentQuestion.hints?.length || 0}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-gray-600">Time</div>
              <div className="font-medium">
                {Math.floor((Date.now() - analytics.startTime) / 1000)}s
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={submitRevision}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Check className="w-4 h-4 mr-1" />
              Complete & Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revision;