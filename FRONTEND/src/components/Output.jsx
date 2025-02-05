import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader/Loader";

export default function Output({ output }) {
  const { genNotes } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);
  console.log(output);
  return (
    <div className="container mx-auto px-4">  
      <div className="bg-neutral-800 rounded-lg shadow-xl p-4 md:p-6 border border-neutral-700/30 hover:border-neutral-600/50 transition-all duration-200">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 mb-4 pb-4 border-b border-neutral-700/30 hover:border-neutral-600/50 transition-all">
          <h2 className="text-xl md:text-2xl font-bold text-white flex-grow">Generated Notes</h2>
          <div className="flex flex-wrap gap-2">
            <div className="bg-neutral-700 border border-neutral-600 px-4 py-2 rounded-lg text-sm text-white">
              {userData?.generations?.count} generations left
            </div>
            <div className="bg-neutral-700 border border-neutral-600 px-4 py-2 rounded-lg text-sm text-white">
              {userData?.saves?.quests} saves left
            </div>
          </div>
        </div>
        {genNotes ? (
          <Loader />
        ) : output ? (
          <div className="space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{output.name}</h3>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-neutral-700 text-white text-sm rounded-lg border border-neutral-600">
                  {output.language}
                </span>
              </div>

              <div className="mb-6">
                <h1 className="text-xl font-semibold text-white mb-3">Categories</h1>
                <div className="flex flex-wrap gap-2">
                  {output.categories?.map((cat, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/40"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
              <div className="my-4">
                <h1 className="text-xl font-semibold text-white mb-3">Description</h1>
                <div className="whitespace-pre-line text-neutral-300">{output.description}</div>
              </div>

              <div className="space-y-4">
                <h1 className="text-xl font-semibold text-white">Subunits</h1>
                {output.subunits?.map((subunit, index) => (
                  <div
                    key={index}
                    className="bg-neutral-700/40 p-6 border border-neutral-600/40 hover:border-neutral-500/50 rounded-lg shadow-lg"
                  >
                    <h4 className="text-lg font-semibold text-white mb-3">
                      {subunit.name}
                    </h4>
                    <div className="whitespace-pre-line text-neutral-300">
                      {subunit.description}
                    </div>
                    <div className="bg-neutral-800/80 rounded-lg p-4 border border-neutral-700/40">
                      <pre className="text-neutral-300 overflow-x-auto whitespace-pre-wrap">
                        {subunit.content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6 mt-8">
                <div className="bg-neutral-700/40 p-6 border border-neutral-600/40 hover:border-neutral-500/50 rounded-lg shadow-lg">
                  <h1 className="text-lg font-semibold text-white mb-3 ">Code flow</h1>
                  
                  <div className="whitespace-pre-line text-neutral-300">{output?.flowExplanation}</div>
                
                </div>
              </div>
              <div className="mt-8">
              <div className="bg-neutral-700/40 p-6 border border-neutral-600/40 hover:border-neutral-500/50 rounded-lg shadow-lg">
              <h1 className="text-lg font-semibold text-white mb-3">Concept Application</h1>
           
                <div className="whitespace-pre-line text-neutral-300">{output?.conceptApplication}
                </div>
              </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 min-h-[30vh] md:min-h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-xl text-neutral-300">
              Add question and code <br/>then click on generate notes button
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
