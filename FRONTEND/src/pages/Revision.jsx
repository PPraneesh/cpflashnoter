import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, PlusCircle } from 'lucide-react';
import { QuestionCard } from '../components/QuestionCard';
import { api } from '../api/axios';

function Revision() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/rev')
      .then(res => {
        console.log(res)
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

const handleSwipe = (direction) => {
    console.log(direction === 'right' ? 'right' : 'left');
    // Always increment the index, even for the last card
    setCurrentIndex(prev => prev + 1);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-600">No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {currentIndex < questions.length && (
        <QuestionCard
          key={questions[currentIndex].id}
          question={questions[currentIndex]}
          onSwipe={handleSwipe}
        />
      )}
      {currentIndex >= questions.length && (
        <div className="h-[60vh] bg-white rounded-2xl shadow-2xl overflow-y-auto m-8 ">
          <div className="text-center p-8 max-w-md">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Revision Complete!</h2>
            <p className="text-gray-600 mb-6">
              You{"'"}ve completed your revision for today. Come back tomorrow to reinforce your learning.
            </p>
            <div className="space-y-4">
              <Link 
                to="/add-question"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Add More Questions
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Restart Revision
              </button>
            </div>
          </div>
          </div>
      )}
    </div>
  );
}

export default Revision;