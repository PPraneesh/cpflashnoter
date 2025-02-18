import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SharedQuestionPage = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { cp_id } = useParams();
  const [questionData, setQuestionData] = useState();
  useEffect(() => {
    axios
      .post(`${SERVER_URL}/get_public_cp`, {
        cp_id,
      })
      .then((response) => {
        if (response.data.status) {
          setQuestionData(response.data.cp);
        } else {
          toast.error("couldn't fetch the question");
          console.log(response.data.reason);
        }
      })
      .catch(() => {
        toast.error("couldn't fetch question");
      });
  }, [SERVER_URL, cp_id]);

  return (
    <div className="bg-neutral-900 min-h-screen pt-16">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{questionData?.name}</h1>

        <p className="text-neutral-400 mb-4">{questionData?.description}</p>

        {questionData?.categories && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {questionData.categories.map((cat, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/40"
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Question</h2>
          <p className="text-neutral-400 bg-neutral-800 p-4 rounded-lg border border-neutral-700/30 hover:border-neutral-600/50 transition-all">
            {questionData?.question}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Code</h2>
          <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700/30 hover:border-neutral-600/50 transition-all">
            <pre className="text-sm text-neutral-400 overflow-x-auto">{questionData?.code}</pre>
          </div>
        </div>

        <div className="mb-6">
          <span className="px-2 py-1 bg-neutral-800 border border-neutral-700/30 hover:border-neutral-600/50 transition-all text-neutral-400 font-medium rounded">
            Language: {questionData?.language}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Subunits</h2>
          {questionData?.subunits.map((subunit, index) => (
            <div
              key={index}
              className="mb-4 bg-neutral-700/50 p-4 rounded-lg border border-neutral-700/30 hover:border-neutral-600/50 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {subunit.name}
              </h3>
              <p className="text-neutral-400 mb-2">{subunit.description}</p>
              <div className="bg-neutral-800 p-4 rounded-lg">
                <pre className="text-sm text-neutral-400 overflow-x-auto">
                  {subunit.content}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {questionData?.flowExplanation && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Code Flow</h2>
            <div className="bg-neutral-700/40 p-6 border border-neutral-600/40 hover:border-neutral-500/50 rounded-lg shadow-lg">
              <div className="whitespace-pre-line text-neutral-300">
                {questionData.flowExplanation}
              </div>
            </div>
          </div>
        )}

        {questionData?.conceptApplication && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Concept Application</h2>
            <div className="bg-neutral-700/40 p-6 border border-neutral-600/40 hover:border-neutral-500/50 rounded-lg shadow-lg">
              <div className="whitespace-pre-line text-neutral-300">
                {questionData.conceptApplication}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedQuestionPage