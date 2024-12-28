import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";

import Code from "../components/Code";
import Question from "../components/Question";
import Output from "../components/Output";
import SavedQuestions from "../components/SavedQuestions";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";

export default function Home() {
  const [genCount, setGenCount] = useState(0);
  const { userData, setUserData } = useContext(UserContext);
  const location = useLocation();
  const { saveCp, setSaveCp, genNotes, setGenNotes } = useContext(LoadingContext);
  const server_url = import.meta.env.VITE_SERVER_URL;

  
  // handles element scroll to view
  useEffect(() => {
    if (location.hash === "#generate") {
      document.getElementById("generate")?.scrollIntoView();
    }
  }, [location]);

  useEffect(() => {
    if (userData?.email) {
      axios.post(`${server_url}/get_user_data`, { email: userData?.email })
      .then((response) => {
        if (response.data.status) {
          setUserData(response.data.userData);
          localStorage.setItem("userData", JSON.stringify(response.data.userData));
        }else{
          toast.error(response.data.reason);
        }
      })
      .catch((error) => {
        console.error("User data fetch error:", error);
        toast.error("Couldn't fetch user data");
      });
    }
  }, [userData?.email]);

  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("// type your code...");
  const [output, setOutput] = useState(null);
  const [personalisedNotes, setPersonalisedNotes] = useState(true);
  // save the notes to the database and update the saved questions by calling getUserData

  const save = async (e) => {
    e.preventDefault(); 
    if (genCount > 0) {
      setSaveCp(true);
      try {
        await axios
          .post(`${server_url}/save_cp`, {
            question,
            code,
            output,
            email: userData?.email,
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

  // handles the generation of notes by calling the server and updating the output and userData

  const handleGeneration = async (e) => {
    e.preventDefault();
    if (question != "" && code != "// type your code...") {
      setGenCount(genCount + 1);
      setGenNotes(true);

      try {
        await axios
          .post(`${server_url}/process_code`, {
            question,
            code,
            email: userData?.email,
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
    <div>
      <SavedQuestions short={true} />
      <Link
        to="/home/questions"
        className="button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-0 mx-auto block w-fit"
      >
        <button>Show all questions</button>
      </Link>
      <div id="generate"></div>
      <h1
        onClick={() => toast("scroll down", { icon: <FaInfoCircle /> })}
        className="text-xl ml-6 w-fit mt-4 border border-white/30 p-2 rounded-md"
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
              className="button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-0"
              disabled={genNotes}
            >
              {genNotes ? "Generating... " : "Generate Notes"}
            </button>
            <button
              onClick={save}
              className="button bg-[#113023b7] text-[#1c9f5b]  hover:bg-[#113023f3]"
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
