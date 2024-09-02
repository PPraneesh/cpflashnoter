  /* eslint-disable react/prop-types */


  import { Link } from "react-router-dom"; 

  function SavedQuestions({savedQuests}) {
    return (
      <>
        <div className="px-6 ">
          <h1 className="text-3xl py-4 text-white">Saved questions:</h1>
          {savedQuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {savedQuests.map((quest, index) => (
                <Link
                  to={`/home/question/${index}`}
                  state={savedQuests[index]}
                  key={index}
                  className="block"
                >
                  <div className="bg-white/10 text-white/70 rounded-lg duration-300 overflow-hidden border border-white/20">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 truncate">
                        {quest.name}
                      </h3>
                      <p className="text-white mb-4 line-clamp-2">
                        {quest.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded">
                          {quest.language || "N/A"}
                        </span>
                        <span className="text-sm text-white ">
                          {quest.subunits?.length || 0} subunit
                          {quest.subunits?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/20 px-6 py-4">
                      <p className="text-sm text-white  font-medium">Question:</p>
                      <p className="text-sm text-white  line-clamp-2">
                        {quest.question}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <h1 className="text-white">No saved quests : )</h1>
            </div>
          )}
        </div>
      </>
    );
  }

  export default SavedQuestions;
