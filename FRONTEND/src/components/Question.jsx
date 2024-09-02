export default function Question({ question, setQuestion }) {
  return (
    <div className="bg-white/10 rounded-lg p-6 border border-white/20 ">
      <h2 className="text-white text-lg font-semibold mb-4">New Question</h2>
      <textarea 
        placeholder="Enter your question here..."
        className="bg-white/10 text-white w-full h-32 p-2 border border-white/20 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
        onChange={(e) => setQuestion(e.target.value)}
      />
    </div>
  );
}