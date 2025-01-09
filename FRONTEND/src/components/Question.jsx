export default function Question({ question, setQuestion, personalisedNotes, setPersonalisedNotes }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700/50">
      <h2 className="text-gray-200 text-lg font-semibold mb-4">New Question</h2>
      <div className="flex items-center mb-4">
        <label className="text-gray-300 mr-2">Generate Personalised Notes:</label>
        <button
          onClick={() => setPersonalisedNotes(!personalisedNotes)}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
            personalisedNotes ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-gray-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
              personalisedNotes ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      <textarea 
        placeholder="Enter your question here..."
        value={question}
        className="bg-gray-900/50 text-gray-200 w-full h-32 p-3 border border-gray-700/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500 transition-all duration-200"
        onChange={(e) => setQuestion(e.target.value)}
      />
    </div>
  );
}