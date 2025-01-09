import { useContext } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { VscEye } from "react-icons/vsc";
import { UserContext } from "../context/UserContext"


function SavedQuestions({ short }) {
  const { userData, userDataCp, setCategory, category, initialLoad } = useContext(UserContext);
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
    <div className="px-4 md:px-6 pb-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-200 py-4">
        Saved questions
      </h1>

      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-200 mb-2">
          Search by category:
        </h2>
        <select
          className="w-full md:w-auto bg-gray-900/50 text-gray-200 p-3 rounded-lg border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
          name="category"
          id="category"
          onChange={(e) => setCategory(e.target.value)}
          defaultValue={category}
        >
          <option value="all">All</option>
          {Array.isArray(userData.categories) &&
            userData?.categories?.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
        </select>
      </div>

      {initialLoad ? (
        <div className="text-lg text-gray-200">Fetching the questions...</div>
      ) : (
        <div>
          {userDataCp?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questionsToDisplay?.map((quest, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/50 shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl hover:border-gray-600/50"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-200 mb-2 truncate">
                      {quest.name}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {quest.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-gray-900/50 text-gray-200 text-sm rounded-lg border border-gray-700/50">
                        {quest.language || "N/A"}
                      </span>
                      <span className="text-sm text-gray-300">
                        {quest.subunits?.length || 0} subunit
                        {quest.subunits?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 px-6 py-4 flex items-center justify-between border-t border-gray-700/50">
                    <div className="flex-1 mr-4">
                      <p className="text-sm font-medium text-gray-200 mb-1">
                        Question:
                      </p>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {quest.question}
                      </p>
                    </div>
                    <Link
                      to={`/home/questions/${quest.id}`}
                      state={quest}
                      className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
                      onClick={handleLinkClick}
                      onAuxClick={handleLinkClick}
                    >
                      <VscEye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/50 shadow-xl">
              <h1 className="text-xl font-medium text-gray-200">
                No saved questions in {category}
              </h1>
            </div>
          )}
        </div>
      )}

      {!short && (
        <Link
          to="/home#generate"
          className="mt-8 px-6 py-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20 mx-auto block w-fit"
        >
          Generate new notes
        </Link>
      )}
    </div>
  );
}

export default SavedQuestions;