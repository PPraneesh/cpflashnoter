import { useContext } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { VscEye } from "react-icons/vsc";
import { UserContext } from "../context/UserContext"


function SavedQuestions() {
  const { userData, userDataCp, setCategory, category, initialLoad } = useContext(UserContext);

  console.log(userDataCp)
  const handleLinkClick = (event) => {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      toast.error("Don't do that");
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence <= 2) return 'text-red-500';
    if (confidence === 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="px-4 md:px-6 pb-8 bg-neutral-900">
      <div className="flex items-center justify-between my-6">
        <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
        Your Notes
        </h1>
        <p className="text-neutral-400">Access and manage your DSA notes collection</p>
        </div>
        <div className="md:mr-8">
          <select
            className="w-full md:w-auto bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            name="category"
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            defaultValue={category}
          >
            <option value="all">All Topics</option>
            {Array.isArray(userData.categories) &&
              userData?.categories?.map((cat, index) => (
                <option key={index} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
          </select>
        </div>
      </div>

      {initialLoad ? (
        <div className="text-lg text-white">Fetching the questions...</div>
      ) : (
        <div>
          {userDataCp?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDataCp?.map((quest, index) => (
                <div
                  key={index}
                  className="bg-neutral-800 rounded-xl border border-neutral-700/30 overflow-hidden hover:border-neutral-600/50 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2 truncate">
                      {quest.name}
                    </h3>
                    <span className="px-3 py-1 bg-neutral-700/50 text-white text-sm rounded-3xl border border-neutral-700/30">
                        {quest.categories && quest.categories[0]}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                      {quest.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-neutral-700/50 text-white text-sm rounded-lg border border-neutral-700/30">
                        {quest.language || "N/A"}
                      </span>
                      <span className={`px-3 py-1 bg-neutral-700/50 text-sm rounded-lg border border-neutral-700/30 ${quest.revObj.confidence ? getConfidenceColor(quest.revObj.confidence) : "text-white"}`}>
                      Confidence: {quest.revObj.confidence ? quest.revObj.confidence : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-700/50 px-6 py-4 flex items-center justify-between border-t border-neutral-700/30">
                    <div className="flex-1 mr-4">
                      <p className="text-sm font-medium text-white mb-1">
                        Question:
                      </p>
                      <p className="text-sm text-neutral-400 line-clamp-2">
                        {quest.question}
                      </p>
                    </div>
                    <Link
                      to={`/home/questions/${quest.id}`}
                      className="p-2 hover:bg-blue-900/40 text-blue-500 border border-blue-500/50 hover:text-blue-400 rounded-lg transition-all"
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
            <div className="text-center p-8 bg-neutral-800 rounded-xl border border-neutral-700/30">
              <h1 className="text-xl font-medium text-white">
                No saved questions at all,<br/>  Generate and save your notes!
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SavedQuestions;