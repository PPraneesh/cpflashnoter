export default function Question({ question, setQuestion, personalisedNotes, setPersonalisedNotes }) {
    return (
      <div className="bg-[#0d1117] rounded-lg p-6 border border-white/20 ">
      <h2 className="text-white text-lg font-semibold mb-4">New Question</h2>
      <div className="flex items-center mb-4">
        <label className="text-white mr-2">Generate Personalised Notes:</label>
        <button
        onClick={() => setPersonalisedNotes(!personalisedNotes)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
          personalisedNotes ? 'bg-blue-600' : 'bg-gray-600'
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
        className="bg-[#151b23] text-white w-full h-32 p-2 border border-white/20 rounded-md resize-none focus:outline-none focus:ring-2 focus:#29548c focus:border-transparent"
        onChange={(e) => setQuestion(e.target.value)}
      />
      </div>
    );
  }