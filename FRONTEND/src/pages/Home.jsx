import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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
  const { user } = useContext(AuthContext);
  const { userData, setUserData } = useContext(UserContext);
  const location = useLocation();
  const { saveCp, setSaveCp, genNotes, setGenNotes } = useContext(LoadingContext);
  const server_url = import.meta.env.VITE_SERVER_URL;

  // this function handles the retrieval of saved questions also sets the userData in the userContext
  function getUserCp(email) {
    axios
      .post(`${server_url}/get_cp`, {
        email: email,
      })
      .then((response) => {
        if (response.data.status) {
          const tempUserData = {
            userData: response.data.userData,
            cp: response.data.cp,
          };
          setUserData(tempUserData);
          localStorage.setItem("userData", JSON.stringify(tempUserData));
        } else {
          toast.error("some error, please logout and login");
        }
      })
      .catch(() => {
        toast.error("couldn't retrieve saved questions");
        console.error("Couldn't get saved questions");
      });
  }


  //for adsense
  useEffect(() => {
    getUserCp("parshipraneesh8@gmail.com")
  },[])
  //for adsense uncomment below

  // useEffect(() => {
  //   getUserCp(user?.email);
  // }, [user?.email]);

  // handles element scroll to view
  
  useEffect(() => {
    if (location.hash === "#generate") {
      document.getElementById("generate")?.scrollIntoView();
    }
  }, [location]);

  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("// type your code...");
  const [output, setOutput] = useState(null);

  // save the notes to the database and update the saved questions by calling getUserCp

  const save = async (e) => {
    e.preventDefault();
    if (genCount > 0) {
      setSaveCp(true);
      try {
        await axios
          .post(`${server_url}/add_cp`, {
            question,
            code,
            output,
            email: userData?.userData.email,
          })
          .then((response) => {
            if (response.data.status) {
              toast.success("saved your notes : )");
              getUserCp(userData?.userData?.email);
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
            email: userData?.userData?.email,
          })
          .then((response) => {
            if (response.data.status) {
              console.log("Process response:", response.data.result);
              setOutput(response.data.result);
              const tempUserData = {
                userData: response.data.userData,
                cp: userData.cp,
              };
              setUserData(tempUserData);
              localStorage.setItem("userData", JSON.stringify(tempUserData));
    
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
          <Question question={question} setQuestion={setQuestion} />
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
