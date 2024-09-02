/* eslint-disable react/prop-types */
import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";
import Loader from "./Loader/Loader"
export default function Output({ output }) {
  const { genNotes } = useContext(LoadingContext);

  return (
    <div className="bg-[#0d1117] rounded-lg shadow-lg p-6 border border-white/20">
      <h2 className="text-white text-lg font-semibold mb-4">Generated Notes</h2>
      {genNotes ? (
        <Loader/>
      ) : (
        <>
          {" "}
          {output ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-white text-md font-medium py-1">
                  {output.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-[#151b23] border border-white/20 text-white text-xs font-medium rounded">
                    {output.language}
                  </span>
                </div>
                <p className="text-sm text-white">{output.description}</p>
                <div className="space-y-4 mt-4">
                  {output.subunits?.map((subunit, index) => (
                    <div key={index} className="bg-[#0d1117] p-4 border border-white/20 rounded-md">
                      <h4 className="text-white text-md font-medium">
                        {subunit.name}
                      </h4>
                      <p className="text-sm text-white mb-2">
                        {subunit.description}
                      </p>
                      <div className="bg-[#151b23] rounded-lg p-4">
                        <pre>
                          <code className="text-white text-sm whitespace-pre">
                            {subunit.content}
                          </code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-white text-xl">
              Add question and code then click on generate notes button
            </h1>
          )}
        </>
      )}
    </div>
  );
}
