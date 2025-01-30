import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import Code from "../components/Code";
import Question from "../components/Question";
import Output from "../components/Output";
import toast from "react-hot-toast";
import { api } from "../api/axios";

export default function Generation() {
  const location = useLocation();
  const [genCount, setGenCount] = useState(0);
  const { setUserData, saveActionState, setSaveActionState } = useContext(UserContext);
  const { saveCp, setSaveCp, genNotes, setGenNotes } = useContext(LoadingContext);
  const navigate = useNavigate()
  useEffect(() => {
    if (location.hash === "#generate") {
      document.getElementById("generate")?.scrollIntoView();
    }
  }, [location]);

  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("// Paste your code here \n// click on Generate Notes");
  const [output, setOutput] = useState(null);
  const [personalisedNotes, setPersonalisedNotes] = useState(false);

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
              setSaveActionState(!saveActionState)
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
    <div className="bg-neutral-900">
        <div className="px-6 pt-6 ">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Generate Notes
          </h1>
          <p className="text-neutral-400">
          Paste your question and code to generate notes
          </p>
        </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <Question
            question={question}
            setQuestion={setQuestion}
            personalisedNotes={personalisedNotes}
            setPersonalisedNotes={setPersonalisedNotes}
          />
          <Code code={code} setCode={setCode} />
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGeneration}
              className="rounded-lg px-4 py-2 bg-blue-800 hover:bg-blue-700 border border-neutral-700/30 hover:border-neutral-600/50 transition-all disabled:opacity-50"
              disabled={genNotes}
            >
              {genNotes ? "Generating... " : output ? "Regenerate Notes" : "Generate Notes"}
            </button>
            <button
              onClick={save}
              className="rounded-lg px-4 py-2 bg-green-600 hover:bg-green-500/90 border border-neutral-700/30 hover:border-neutral-600/50 transition-all disabled:opacity-50"
              disabled={saveCp}
            >
              {saveCp ? "saving.." : "Save"}
            </button>
          </div>
        </div>
        <Output output={output} />
      </div>
    </div>
  );
}