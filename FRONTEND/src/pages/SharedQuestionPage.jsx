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
    <div>
      <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-2">{questionData?.name}</h1>

          <p className="text-white mb-4">{questionData?.description}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Question</h2>
            <p className="text-white bg-[#151b23] p-4 rounded-lg border border-white/20">
              {questionData?.question}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Code</h2>
            <div className="bg-[#151b23] p-4 rounded-lg border border-white/20">
              <pre className="text-sm text-white overflow-x-auto ">{questionData?.code}</pre>
            </div>
          </div>

          <div className="mb-6">
            <span className="px-2 py-1 bg-[#151b23] border border-white/20 text-white font-medium rounded">
              Language: {questionData?.language}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Subunits</h2>
            {questionData?.subunits.map((subunit, index) => (
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

export default SharedQuestionPage;