import { useLocation } from "react-router-dom";

const Question = () => {
  const location = useLocation();
  const questionData = location.state;

  const { name, description, question, code, language, subunits } = questionData;

  return (
    <div className="bg-cactus-50 shadow-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-cactus-900 mb-2">{name}</h1>
        <p className="text-cactus-600 mb-4">{description}</p>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-cactus-900 mb-2">Question</h2>
          <p className="text-cactus-700 bg-cactus-100 p-4 rounded-lg border border-cactus-400">{question}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-cactus-900 mb-2">Code</h2>
          <div className="bg-cactus-100 p-4 rounded-lg border border-cactus-400">
            <pre className="text-sm text-cactus-800 overflow-x-auto ">{code}</pre>
          </div>
        </div>
        
        <div className="mb-6">
          <span className="inline-block bg-cactus-100 text-cactus-800 text-xs font-semibold px-2 py-1 rounded-md">
            Language: {language}
          </span>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-cactus-900 mb-2">Subunits</h2>
          {subunits.map((subunit, index) => (
            <div key={index} className="mb-4 bg-cactus-50 p-4 rounded-lg border border-cactus-400">
              <h3 className="text-lg font-semibold text-cactus-900 mb-2">{subunit.name}</h3>
              <p className="text-cactus-600 mb-2">{subunit.description}</p>
              <div className="bg-cactus-100 p-4 rounded-lg ">
                <pre className="text-sm text-cactus-800 overflow-x-auto">{subunit.content}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question;
