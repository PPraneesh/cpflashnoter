import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader/Loader";

export default function Output({ output }) {
  const { genNotes } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);

  return (
  <div className="">  
      <div className="bg-neutral-800 rounded-lg shadow-xl p-4 md:p-6 border border-neutral-700/30 hover:border-neutral-600/50 transition-all duration-200">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 mb-4 pb-4 border-b border-neutral-700/30 hover:border-neutral-600/50 transition-all">
          <h2 className="text-xl md:text-2xl font-bold text-white flex-grow">Generated Notes</h2>
          <div className="flex flex-wrap gap-2">
            <div className="bg-neutral-800 border border-neutral-700/30 hover:border-neutral-600/50 px-3 py-1 rounded-lg text-sm text-neutral-400">
              {userData?.generations?.count} generations left
            </div>
            <div className="bg-neutral-800 border border-neutral-700/30 hover:border-neutral-600/50 px-3 py-1 rounded-lg text-sm text-neutral-400">
              {userData?.saves?.quests} saves left
            </div>
          </div>
        </div>
        {genNotes ? (
          <Loader />
        ) : output ? (
          <div className="space-y-6 md:h-screen overflow-y-scroll">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">{output.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-4 py-2 bg-neutral-700/50 text-white text-sm rounded-lg border border-neutral-700/30">
                  {output.language}
                </span>
                {/* <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="px-4 py-2  text-white bg-blue-700 hover: rounded-lg transition-all duration-200 text-sm"
                >
                  Categories
                </button> */}
              </div>
    
                  <div>
                    <h1 className="text-lg">Categories</h1>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                      {output.categories?.map((cat, index) => (
                        <div
                          key={index}
                          className="w-fit px-3 py-1 bg-blue-500/20 text-blue-500 hover:text-blue-400 rounded-lg border border-blue-500/50"
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
              <p className="text-neutral-400 mb-6">{output.description}</p>
              <div className="space-y-6">
                {output.subunits?.map((subunit, index) => (
                  <div
                    key={index}
                    className="bg-neutral-700/50 p-4 md:p-6 border border-neutral-700/30 hover:border-neutral-600/50 rounded-lg shadow-lg"
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {subunit.name}
                    </h4>
                    <p className="text-neutral-400 mb-4">
                      {subunit.description}
                    </p>
                    <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-700/30 hover:border-neutral-600/50">
                      <pre className="text-white overflow-x-auto">
                        {subunit.content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 min-h-[30vh] md:min-h-[80vh] flex flex-col items-center justify-center ">
            <h1 className="text-xl text-white">
              Add question and code <br/>then click on generate notes button
            </h1>
          </div>
        )}
      </div>
  </div>
  );
}
