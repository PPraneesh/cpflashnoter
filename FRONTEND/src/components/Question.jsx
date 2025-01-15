export default function Question({ question, setQuestion, personalisedNotes, setPersonalisedNotes }) {
  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700/30 hover:border-neutral-600/50 transition-all">
      <h2 className="text-white text-lg font-semibold mb-4">New Question</h2>
      <div className="flex items-center mb-4">
        <label className="text-neutral-400 mr-2">Generate Personalised Notes:</label>
        <button
          onClick={() => setPersonalisedNotes(!personalisedNotes)}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
            personalisedNotes ? 'bg-blue-500 hover:bg-blue-400' : 'bg-neutral-700'
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
        className="bg-neutral-700/50 text-white w-full h-32 p-3 border border-neutral-700/30 rounded-lg resize-none  placeholder-neutral-400 transition-all duration-200 outline-none focus:outline-neutral-500/50"
        onChange={(e) => setQuestion(e.target.value)}
      />
    </div>
  );
}