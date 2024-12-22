/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { VscEye } from "react-icons/vsc";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
// import { useState } from "react";

function SavedQuestions({short}) {
  // const [initialLoad, setInitialLoad] = useState(false);
const initialLoad = false;
  const {userDataCp} = useContext(UserContext);
  const questionsToDisplay = short
    ? userDataCp?.slice().reverse().slice(0, 3)
    : userDataCp?.slice().reverse();

  const handleLinkClick = (event) => {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      toast.error("Don't do that");
    }
  };

  return (
    <>
      <div className="px-6 pb-8">
        <h1 className="text-3xl py-4 text-white">Saved questions:</h1>
        {initialLoad ? <div className="text-lg text-white">Fetching the questions...</div>:<div>
        {userDataCp.length>0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {questionsToDisplay?.map((quest, index) => (
                <div
                  key={index}
                  className="bg-[#0d1117] text-white/70 rounded-lg duration-300 overflow-hidden border border-white/20"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 truncate">
                      {quest.name}
                    </h3>
                    <p className="text-white mb-4 line-clamp-2">
                      {quest.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 bg-[#151b23] border border-white/20 text-white text-xs font-medium rounded">
                        {quest.language || "N/A"}
                      </span>
                      <span className="text-sm text-white ">
                        {quest.subunits?.length || 0} subunit
                        {quest.subunits?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#151b23] px-6 py-4 flex items-center align-middle">
                    <div className="mr-4">
                      <p className="text-sm text-white  font-medium">
                        Question:
                      </p>
                      <p className="text-sm text-white line-clamp-2">
                        {quest.question}
                      </p>
                    </div>
                    <Link
                      to={`/home/questions/${index}`}
                      state={userDataCp[index]}
                      className="text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border border-[#247ce889] py-1 px-2 rounded-md w-fit"
                      onClick={handleLinkClick}
                      onAuxClick={handleLinkClick}
                    >
                      <VscEye size={24} />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div>
            <h1 className="text-white">No saved quests : )</h1>
          </div>
        )}
        </div>}
        {!short &&<Link to="/home#generate">
           <h1 className="mt-8 p-2 rounded-md text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-0 mx-auto block w-fit">
                    Generate new notes
                  </h1>
        </Link>}
      </div>
    </>
  );
}

export default SavedQuestions;
