import  { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, PlusCircle } from 'lucide-react';
import { QuestionCard } from '../components/QuestionCard';
import { api } from '../api/axios';

function Revision() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradientProgress, setGradientProgress] = useState({ direction: null, progress: 0 });
  const startTimeRef = useRef(null);
  const questionTimesRef = useRef({});

  useEffect(() => {
    api.get('/rev')
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
        startTimeRef.current = Date.now();
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      startTimeRef.current = Date.now();
    }
  }, [currentIndex, loading, questions]);

  const handleDragProgress = (direction, progress) => {
    setGradientProgress({ direction, progress });
  };

  const handleSwipe = (direction) => {
    const endTime = Date.now();
    const timeSpent = (endTime - startTimeRef.current) / 1000;
    const currentQuestion = questions[currentIndex];
    
    questionTimesRef.current[currentQuestion.id] = timeSpent;
    
    console.log(`Time spent on question "${currentQuestion.name}": ${timeSpent.toFixed(2)} seconds`);
    console.log(`Direction swiped: ${direction}`);
    
    setGradientProgress({ direction, progress: 1 });
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setGradientProgress({ direction: null, progress: 0 });
    }, 300);
  };

  useEffect(() => {
    if (currentIndex === questions.length && Object.keys(questionTimesRef.current).length > 0) {
      const totalTime = Object.values(questionTimesRef.current).reduce((a, b) => a + b, 0);
      const averageTime = totalTime / Object.keys(questionTimesRef.current).length;
      
      console.log('--- Revision Session Summary ---');
      console.log(`Total time: ${totalTime.toFixed(2)} seconds`);
      console.log(`Average time per question: ${averageTime.toFixed(2)} seconds`);
      console.log('Detailed breakdown:');
      Object.entries(questionTimesRef.current).forEach(([questionId, time]) => {
        const question = questions.find(q => q.id === questionId);
        console.log(`- ${question.name}: ${time.toFixed(2)} seconds`);
      });
    }
  }, [currentIndex, questions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-red-500/20">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700/50">
          <p className="text-gray-300">No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute inset-0 pointer-events-none z-10">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-emerald-500"
            style={{
              opacity: gradientProgress.direction === 'right' ? gradientProgress.progress * 0.3 : 0,
              transition: gradientProgress.direction ? 'none' : 'opacity 0.3s ease-out'
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-red-500"
            style={{
              opacity: gradientProgress.direction === 'left' ? gradientProgress.progress * 0.3 : 0,
              transition: gradientProgress.direction ? 'none' : 'opacity 0.3s ease-out'
            }}
          />
        </div>

        <div className="relative z-20">
          {currentIndex < questions.length ? (
            <QuestionCard
              key={questions[currentIndex].id}
              question={questions[currentIndex]}
              nextQuestion={questions[currentIndex + 1]}
              onSwipe={handleSwipe}
              onDragProgress={handleDragProgress}
            />
          ) : (
            <div className="h-[60vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-y-auto m-8 border border-gray-700/50">
              <div className="text-center p-8 max-w-md mx-auto">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-200 mb-2">Revision Complete!</h2>
                <p className="text-gray-300 mb-6">
                  You{"'"}ve completed your revision for today. Come back tomorrow to reinforce your learning.
                </p>
                <div className="space-y-4">
                  <Link 
                    to="/add-question"
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Add More Questions
                  </Link>
                  <button 
                    onClick={() => window.location.reload()}
                    className="block w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700/50"
                  >
                    Restart Revision
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Revision;