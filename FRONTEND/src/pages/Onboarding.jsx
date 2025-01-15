import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const questions = [
  {
    id: 1,
    text: "When you read code explanations, do you prefer:",
    options: [
      "Short, direct explanations of what each part does",
      "Detailed explanations with reasoning behind each decision",
    ],
  },
  {
    id: 2,
    text: "What level of detail helps you understand code best:",
    options: [
      "High-level overview first, then details",
      "Step-by-step breakdown of each line",
      "Focus on key logic points only",
    ],
  },
  {
    id: 3,
    text: "How do you prefer complex logic to be explained:",
    options: ["Using everyday analogies", "Through pure technical terms"],
  },
  {
    id: 4,
    text: "When learning new code concepts, what's most helpful:",
    options: [
      "Understanding the edge cases first",
      "Starting with the core functionality",
    ],
  },
  {
    id: 5,
    text: "What aspects of code do you focus on most:",
    options: [
      "Time complexity and optimization",
      "Code readability and structure",
      "Implementation tricks and techniques",
    ],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleOptionSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    api
      .post(`/onboarding`, {
        userPreferences: answers,
      })
      .then((res) => {
        if (res.data.status) {
          navigate("/home");
          toast.success("Onboarding completed :)");
        } else {
          toast.error("Error completing onboarding :(");
        }
      });
  };

  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[currentQuestionData.id] !== undefined;

  return (
    <div className="bg-neutral-900 text-white min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-center">Personalize Your Learning Experience</h1>
        <p>Answer the following questions, to help us understand how your notes should be</p>
        <div className="bg-neutral-800 rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Question {currentQuestion + 1}/{questions.length}</h2>
              <div className="w-32 h-2 bg-neutral-700/30 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-lg text-neutral-400">{currentQuestionData.text}</p>

            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border border-neutral-700/30 transition-all hover:border-neutral-600/50 ${
                    answers[currentQuestionData.id] === option
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-700/50 text-neutral-400 hover:bg-neutral-600/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700/30 transition-all hover:border-neutral-600/50 ${
                currentQuestion === 0
                  ? "text-neutral-400 cursor-not-allowed opacity-50"
                  : "hover:bg-neutral-700/50"
              }`}
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed}
                className={`px-6 py-2 rounded-lg border border-neutral-700/30 transition-all hover:border-neutral-600/50 ${
                  canProceed
                    ? "bg-green-500/70 hover:bg-green-500 text-white"
                    : "bg-neutral-700/50 text-neutral-400 cursor-not-allowed opacity-50"
                }`}
              >
                Complete
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700/30 transition-all hover:border-neutral-600/50 ${
                  canProceed
                    ? "bg-blue-500/70 hover:bg-blue-500 text-white"
                    : "bg-neutral-700/50 text-neutral-400 cursor-not-allowed opacity-50"
                }`}
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
