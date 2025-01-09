import { useContext, useState } from "react";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader/Loader";

export default function Output({ output }) {
  const { genNotes } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-4 md:p-6 border border-gray-700/50 transition-all duration-200">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 mb-4 pb-4 border-b border-gray-700/50">
        <h2 className="text-xl md:text-2xl font-bold text-gray-200 flex-grow">Generated Notes</h2>
        <div className="flex flex-wrap gap-2">
          <div className="bg-gray-900/50 border border-gray-700/50 px-3 py-1 rounded-lg text-sm text-gray-300">
            {userData?.generations?.count} generations left
          </div>
          <div className="bg-gray-900/50 border border-gray-700/50 px-3 py-1 rounded-lg text-sm text-gray-300">
            {userData?.saves?.quests} saves left
          </div>
        </div>
      </div>

      {genNotes ? (
        <Loader />
      ) : output ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">
              {output.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-900/50 border border-gray-700/50 text-gray-200 text-sm rounded-lg">
                {output.language}
              </span>
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20 text-sm"
              >
                Categories
              </button>
            </div>

            {showCategories && (
              <div className="absolute mt-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-lg p-4 shadow-xl z-10">
                <div className="flex flex-col gap-2">
                  {output.categories?.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/50"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-gray-300 mb-6">{output.description}</p>

            <div className="space-y-6">
              {output.subunits?.map((subunit, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 border border-gray-700/50 rounded-lg shadow-lg"
                >
                  <h4 className="text-lg font-semibold text-gray-200 mb-2">
                    {subunit.name}
                  </h4>
                  <p className="text-gray-300 mb-4">
                    {subunit.description}
                  </p>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <pre className="text-gray-200 overflow-x-auto">
                      {subunit.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h1 className="text-xl font-semibold text-gray-200">
            Add question and code then click on generate notes button
          </h1>
        </div>
      )}
    </div>
  );
}