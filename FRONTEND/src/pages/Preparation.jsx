import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Code from "../components/Code";
import { Timer } from "lucide-react";
import { api } from '../api/axios';

export function AnalysisOverlay({ data, onClose }) {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/80 flex items-center justify-center px-4 py-4">
      <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-300"
        >
          ✕
        </button>
        <h2 className="text-white text-2xl mb-4">Preparation Analysis</h2>

        {/* Overall Assessment */}
        <div className="mb-6">
          <h3 className="text-white mb-2">Overall Assessment</h3>
          <div className="bg-neutral-700/50 p-4 rounded-xl mb-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-blue-500">
                  {data.overallAssessment.overallScore}
                </span>
                <span className="text-lg text-white mt-1">Overall Score</span>
                <span className="text-sm text-neutral-400">Out of 10</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-blue-500">
                  {data.overallAssessment.clarity}
                </span>
                <span className="text-lg text-white mt-1">Clarity</span>
                <span className="text-sm text-neutral-400">Out of 10</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-blue-500">
                  {data.overallAssessment.approach}
                </span>
                <span className="text-lg text-white mt-1">Approach</span>
                <span className="text-sm text-neutral-400">Out of 10</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-bold text-blue-500">
                  {data.overallAssessment.implementation}
                </span>
                <span className="text-lg text-white mt-1">Implementation</span>
                <span className="text-sm text-neutral-400">Out of 10</span>
              </div>
            </div>
            <p className="text-white mt-4">Summary: <span className="text-neutral-400">{data.overallAssessment.summary}</span></p>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="mb-6">
          <h3 className="text-white mb-2">Detailed Feedback</h3>
          <div className="bg-neutral-700/50 p-4 rounded-xl mb-2 text-white">
            <p className="text-xl">Strengths:</p>
            <ul className="list-disc list-inside mb-2 text-neutral-400">
              {data.detailedFeedback.strengths.length > 0 ? (data.detailedFeedback.strengths.map((item, idx) => (
                <li className="text-neutral-400" key={idx}>{item}</li>
              ))): <p className="text-neutral-400">None</p>}
            </ul>
            <p className="text-xl">Improvements:</p>
            <ul className="list-disc list-inside mb-2">
              {data.detailedFeedback.improvements.map((item, idx) => (
                <li className="text-neutral-400" key={idx}>{item}</li>
              ))}
            </ul>
            <p className="text-xl">Suggestions: </p>
            <span className="text-neutral-400">{data.detailedFeedback.suggestions}</span>
          </div>
        </div>

        {/* Time Management */}
        <div className="mb-6">
          <h3 className="text-white mb-2">Time Management</h3>
          <div className="bg-neutral-700/50 p-4 rounded-xl text-white">
            <p>{data.timeManagement.analysis}</p>
            <p>{data.timeManagement.recommendations}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <h3 className="text-white mb-2">Next Steps</h3>
          <div className="bg-neutral-700/50 p-4 rounded-xl text-white">
            {data.nextSteps.map((step, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-semibold">{step.action}</p>
                <p className="text-neutral-400">{step.reason}</p>
                <p className="text-neutral-400">{step.howTo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Preparation() {
  const { userData, userDataCp, category, setCategory } = useContext(UserContext);
  const [questionData, setQuestionData] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [problemRestatement, setProblemRestatement] = useState("");
  const [approach, setApproach] = useState("");
  const [pseudoCode, setPseudoCode] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEW

  // Timer logic
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setQuestionData(null);
    setShowButtons(false);
  };

  const handleStart = () => {
    const index = Math.floor(Math.random() * userDataCp.length);
    const question = userDataCp[index];
    setQuestionData(question);
    setIsRunning(true);
  };

  const handleDone = async () => {
    setIsLoading(true); // NEW
    setIsRunning(false);
    try {
      await api
        .post('/prep_analysis', {
          problemRestatement,
          approach,
          pseudoCode,
          timeSpent: time,
          question: questionData.question,
          actualCode: questionData.code,
        })
        .then((res) => {
          setAnalysisData(res.data.analysis);
          setShowAnalysis(true);
          setShowButtons(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error('Error getting analysis:', error);
    } finally {
      setIsLoading(false); // NEW
    }
  };

  const handleShowNotes = () => {
    setShowNotes(!showNotes);
  };

  const handleCloseAnalysis = () => {
    setShowAnalysis(false);
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-700/30">
        <h1 className="text-3xl font-bold">Get Prepped</h1>
        <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-3 flex items-center gap-2">
          <Timer className="w-6 h-6 text-blue-500 hover:text-blue-400 transition-all" />
          <span className="text-2xl font-mono">{formatTime(time)}</span>
        </div>
      </div>

      {/* Category Selection */}
      {!isRunning && (
        <div className="p-4 max-w-2xl mx-auto">
          <label className="block text-sm font-medium text-white mb-2">
            Which topic do you want to prepare?
          </label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-2 bg-neutral-800 border border-neutral-700/30 rounded-md text-white"
          >
            <option value="all">All categories</option>
            {Array.isArray(userData.categories) &&
              userData.categories.map((cat, index) => (
                <option key={index} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Start Button */}
      {category && !questionData && (
        <div className="text-center mb-8">
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg transition-all"
          >
            Start Interview Prep
          </button>
        </div>
      )}

      {/* Main Content */}
      {questionData && (
        <div className="flex flex-col lg:flex-row gap-6 p-4">
          {/* Left Column - Question Panel */}
          <div className="lg:w-2/5 bg-neutral-800 border border-neutral-700/30 rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold pb-4 text-center">
              {questionData.name}
            </h2>
            <div className="bg-neutral-700/50 border border-neutral-700/30 rounded-xl p-4">
              <p className="whitespace-pre-wrap text-lg">{questionData.question}</p>
            </div>
          </div>

          {/* Right Column - Steps */}
          <div className="lg:w-3/5 space-y-6">
            {/* Problem Restatement */}
            <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4 text-neutral-400">
                1. Clarify the Problem
              </h3>
              <textarea
                value={problemRestatement}
                onChange={(e) => setProblemRestatement(e.target.value)}
                placeholder="Restate the problem in your own words..."
                className="w-full h-32 bg-neutral-700/50 border border-neutral-700/30 rounded-xl p-4 text-white resize-none focus:outline-none"
              />
            </div>

            {/* Approach */}
            <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4 text-neutral-400">
                2. Plan Your Approach
              </h3>
              <textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="Describe your strategy..."
                className="w-full h-32 bg-neutral-700/50 border border-neutral-700/30 rounded-xl p-4 text-white resize-none focus:outline-none"
              />
            </div>

            {/* Pseudo Code */}
            <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4 text-neutral-400">
                3. Write Pseudo Code
              </h3>
              <Code
                code={pseudoCode}
                setCode={setPseudoCode}
                placeholder="Write your pseudo code here..."
                className="w-full h-48 bg-neutral-700/50 border border-neutral-700/30 rounded-xl p-4 text-white resize-none font-mono"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-between">
              {!showButtons ? (
                <button
                  onClick={handleDone}
                  className="w-full md:w-auto px-6 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg transition-all"
                  disabled={isLoading} // NEW
                >
                  {isLoading ? "Loading..." : "Complete Preparation"} {/* NEW */}
                </button>
              ) : (
                showButtons &&
                !showAnalysis && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowAnalysis(true)}
                      className="px-6 py-2 bg-blue-700 text-white hover:bg-blue-600 border border-neutral-700/30 rounded-lg transition-all"
                    >
                      Show Analysis
                    </button>
                    <button
                      onClick={handleShowNotes}
                      className="px-6 py-2 bg-purple-700 hover:bg-purple-600 border border-neutral-700/30 rounded-lg transition-all"
                    >
                      Show Solution Notes
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto border border-neutral-700/30">
            <div className="flex justify-between items-center p-4 border-b border-neutral-700/30">
              <h1 className="text-2xl font-bold text-white">Notes</h1>
              <button
                onClick={() => setShowNotes(false)}
                className="text-neutral-400 hover:text-neutral-300"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between pb-2">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {questionData.name}
                </h1>
              </div>
              <p className="text-white mb-4 whitespace-pre-wrap">{questionData.description}</p>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Question</h2>
                <p className="text-white bg-neutral-800 p-4 rounded-lg border border-neutral-700/30 whitespace-pre-wrap">
                  {questionData.question}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Code</h2>
                <div className="bg-neutral-700/50 p-4 rounded-lg border border-neutral-700/30">
                  <pre className="text-sm text-white overflow-x-auto">
                    {questionData.code}
                  </pre>
                </div>
              </div>

              <div className="mb-6">
                <span className="px-2 py-1 bg-neutral-800 border border-neutral-700/30 text-white font-medium rounded">
                  Language: {questionData.language}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Subunits</h2>
                {questionData.subunits?.map((subunit, index) => (
                  <div
                    key={index}
                    className="mb-4 bg-neutral-900 p-4 rounded-lg border border-neutral-700/30"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {subunit.name}
                    </h3>
                    <p className="text-white mb-2">{subunit.description}</p>
                    <div className="bg-neutral-700/50 p-4 rounded-lg">
                      <pre className="text-sm text-white overflow-x-auto">
                        {subunit.content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Overlay */}
      {showAnalysis && (
        <AnalysisOverlay 
          data={analysisData}
          onClose={handleCloseAnalysis}
        />
      )}
    {isLoading && (
      <div className="fixed inset-0 z-50 bg-neutral-900/80 flex items-center justify-center">
        <span className="text-white text-xl">Loading...</span>
      </div>
    )}
    </div>

  );
}
