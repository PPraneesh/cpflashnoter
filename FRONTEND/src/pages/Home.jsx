import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import Code from "../components/Code";
import Question from "../components/Question";
import Output from "../components/Output";
import SavedQuestions from "../components/SavedQuestions";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";
import { api } from "../api/axios";

export default function Home() {
  const location = useLocation();
  const [genCount, setGenCount] = useState(0);
  const { setUserData } = useContext(UserContext);
  const { saveCp, setSaveCp, genNotes, setGenNotes } = useContext(LoadingContext);

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
              console.log(response.data)
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
    if (question != "" && code != "// type your code...") {
      setGenCount(genCount + 1);
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
              console.log(response.data.result)
              setUserData(response.data.userDataStats);
              localStorage.setItem("userData", JSON.stringify(response.data.userDataStats));
              toast.success("generated successfully");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <SavedQuestions short={true} />
      <Link
        to="/home/questions"
        className="button bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 shadow-lg shadow-blue-500/20 rounded-lg px-4 py-2 mx-auto block w-fit transition-all duration-200"
      >
        Show all questions
      </Link>
      <div id="generate"></div>
      <h1
        onClick={() => toast("scroll down", { icon: <FaInfoCircle /> })}
        className="text-xl ml-6 w-fit mt-4 text-gray-200 border border-gray-700/50 p-2 rounded-lg bg-gray-800/50"
      >
        Generate new notes
      </h1>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <Question question={question} setQuestion={setQuestion} personalisedNotes={personalisedNotes} setPersonalisedNotes={setPersonalisedNotes} />
          <Code code={code} setCode={setCode} />
          <div className="flex gap-4">
            <button
              onClick={handleGeneration}
              className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 shadow-lg shadow-blue-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
              disabled={genNotes}
            >
              {genNotes ? "Generating... " : "Generate Notes"}
            </button>
            <button
              onClick={save}
              className="px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/50 shadow-lg shadow-emerald-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
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