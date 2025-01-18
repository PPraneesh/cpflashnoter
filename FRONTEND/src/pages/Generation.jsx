import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import Code from "../components/Code";
import Question from "../components/Question";
import Output from "../components/Output";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";
import { api } from "../api/axios";

export default function Generation() {
  const location = useLocation();
  const [genCount, setGenCount] = useState(0);
  const { setUserData } = useContext(UserContext);
  const { saveCp, setSaveCp, genNotes, setGenNotes } = useContext(LoadingContext);
  const navigate = useNavigate()
  useEffect(() => {
    if (location.hash === "#generate") {
      document.getElementById("generate")?.scrollIntoView();
    }
  }, [location]);

  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("// type your code...");
  const [output, setOutput] = useState(null);
  const [personalisedNotes, setPersonalisedNotes] = useState(true);

  const save = async (e) => {
    e.preventDefault();
    if (genCount > 0) {
      setSaveCp(true);
      try {
        await api
          .post("/save_cp", {
            question,
            code,
            output,
          })
          .then((response) => {
            if (response.data.status) {
              toast.success("saved your notes : )");
              setUserData(response.data.userData);
              navigate('/home/questions')
            } else {
              toast.error(response.data.reason);
            }
          })
          .catch(() => {
            toast.error("failed to save : /");
          });
      } catch (error) {
        console.error("Save error:", error);
        toast.error("couldn't save : /");
      }
      setSaveCp(false);
    } else {
      toast.error("first generate notes");
    }
  };

  const handleGeneration = async (e) => {
    e.preventDefault();
    if (question !== "" && code !== "// type your code...") {
      setGenNotes(true);

      try {
        await api
          .post(`/process_code`, {
            question,
            code,
            personalisedNotes: personalisedNotes
          })
          .then((response) => {
            if (response.data.status) {
              setOutput(response.data.result);
              setUserData(response.data.userDataStats);
              localStorage.setItem("userData", JSON.stringify(response.data.userDataStats));
              toast.success("generated successfully");
              setGenCount(genCount + 1);
            } else {
              toast.error(response.data.reason);
            }
          });
      } catch (error) {
        toast.error("some error occured");
        console.error("Process error:", error);
      }
      setGenNotes(false);
    } else {
      toast.error("Paste your question and code before generating");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <h1
        onClick={() => toast("scroll down", { icon: <FaInfoCircle /> })}
        className="text-xl ml-6 w-fit mt-4 text-white border border-neutral-700/30 hover:border-neutral-600/50 transition-all p-2 rounded-lg bg-neutral-700/50"
      >
        Generate new notes
      </h1>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <Question
            question={question}
            setQuestion={setQuestion}
            personalisedNotes={personalisedNotes}
            setPersonalisedNotes={setPersonalisedNotes}
          />
          <Code code={code} setCode={setCode} />
          <div className="flex gap-4">
            <button
              onClick={handleGeneration}
              className="rounded-lg px-4 py-2 bg-neutral-800 text-blue-500 hover:text-blue-400 border border-neutral-700/30 hover:border-neutral-600/50 transition-all disabled:opacity-50"
              disabled={genNotes}
            >
              {genNotes ? "Generating... " : "Generate Notes"}
            </button>
            <button
              onClick={save}
              className="rounded-lg px-4 py-2 bg-neutral-800 text-green-500 hover:text-green-400 border border-neutral-700/30 hover:border-neutral-600/50 transition-all disabled:opacity-50"
              disabled={saveCp}
            >
              {saveCp ? "saving.." : "Save it"}
            </button>
          </div>
        </div>
        <Output output={output} />
      </div>
    </div>
  );
}