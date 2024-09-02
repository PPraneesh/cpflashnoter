import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Code from "../components/Code";
import Question from "../components/Question";
import Output from "../components/Output";
import SavedQuestions from "../components/SavedQuestions";
import toast from "react-hot-toast";
import { LoadingContext } from "../context/LoadingContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { saveCp, setSaveCp, genNotes, setGenNotes } = useContext(LoadingContext);
  const [savedQuests, setSavedQuests] = useState([]);
  const server_url = import.meta.env.VITE_SERVER_URL;

  function getUserCp(email) {
    axios
      .post(`${server_url}/get_cp`, {
        email: email,
      })
      .then((response) => {
        console.log(response);
        setSavedQuests(response.data);
      })
      .catch(() => {
        console.error("Couldn't get saved questions");
      });
  }
  useEffect(() => {
    getUserCp(user.email);
  }, [user.email]);

  const [question, setQuestion] = useState("Paste your question here...");
  const [code, setCode] = useState("// type your code...");
  const [output, setOutput] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    setSaveCp(true)
    try {
      await axios
        .post(`${server_url}/add_cp`, {
          question,
          code,
          output,
          email: user.email,
        })
        .then((response) => {
          if (response.data.status) {
            toast.success("saved your notes : )");
            getUserCp(user.email);
          } else {
            toast.error(response.data.reason);
          }
        })
        .catch(() => {
          toast.error("failed to save : /");
        });
    } catch (error) {
      console.error("Save error:", error);
    }
    setSaveCp(false)
  };

  const handleGeneration = async (e) => {
    e.preventDefault();
    setGenNotes(true)
    try {
      await axios
        .post(`${server_url}/process_code`, {
          question,
          code,
          email: user.email,
        })
        .then((response) => {
          if (response.data.status) {
            console.log("Process response:", response.data.result);
            setOutput(response.data.result);
            toast.success("generated successfully");
          } else {
            toast.error(response.data.reason); //reason
          }
        });
    } catch (error) {
      toast.error("some error occured");
      console.error("Process error:", error);
    }
    setGenNotes(false)
  };

  return (
    <div className="bg-black">
      <SavedQuestions savedQuests={savedQuests} />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <Question question={question} setQuestion={setQuestion} />
          <Code code={code} setCode={setCode} />
          <div className="flex gap-4">
            <button onClick={handleGeneration} className="button" disabled={genNotes}>
              { genNotes ? "Generating... ":"Generate Notes"}
            </button>
            <button onClick={save} className="button" disabled={saveCp}>
              Save CP
            </button>
          </div>
        </div>
        <Output output={output} />
      </div>
    </div>
  );
}
