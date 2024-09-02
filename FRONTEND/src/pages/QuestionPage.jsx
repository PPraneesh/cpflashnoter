import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

const Question = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questionData = location.state;

  const { name, description, question, code, language, subunits } =
    questionData;

  return (
    <div >
        <button
          className="button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] flex items-center m-4 fixed bottom-0 right-0 border border-[#247ce889]"
          onClick={() => {
            navigate("/home");
          }}
        >
          <FaChevronLeft />
          <span className="whitespace-pre">{`  home`}</span>
        </button>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{name}</h1>
        <p className="text-white mb-4">{description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Question</h2>
          <p className="text-white bg-[#151b23] p-4 rounded-lg border border-white/20">
            {question}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Code</h2>
          <div className="bg-[#151b23] p-4 rounded-lg border border-white/20">
            <pre className="text-sm text-white overflow-x-auto ">{code}</pre>
          </div>
        </div>

        <div className="mb-6">
          <span className="px-2 py-1 bg-[#151b23] border border-white/20 text-white font-medium rounded">
            Language: {language}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Subunits</h2>
          {subunits.map((subunit, index) => (
            <div
              key={index}
              className="mb-4 bg-[#0d1117] p-4 rounded-lg border border-white/20"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {subunit.name}
              </h3>
              <p className="text-white mb-2">{subunit.description}</p>
              <div className="bg-[#151b23] p-4 rounded-lg ">
                <pre className="text-sm text-white overflow-x-auto">
                  {subunit.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question;
