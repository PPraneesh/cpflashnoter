import React, { useContext } from "react";
import { XCircle } from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile({ userData, onClose }) {
  const { logOut } = useContext(AuthContext);
  const { setUserData } = useContext(UserContext);

  const makePrivate = async (questionId) => {
    try {
      const response = await api.put("/delete_public_cp", {
        cp_id: questionId,
      });
      
      if (response.data.status) {
        setUserData(response.data.userDataStats);
        toast.success("Public link deleted successfully");
      } else {
        toast.error("Couldn't delete");
        console.log(response.data.reason);
      }
    } catch (error) {
      console.log(error);
      toast.error("Couldn't delete", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl border border-gray-700/50 
        w-full max-w-md mx-auto relative max-h-[calc(100vh-2rem)] flex flex-col">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-200 
            transition-colors duration-200 z-10"
        >
          <XCircle size={24} />
        </button>

        {/* Header Section - Fixed */}
        <div className="p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <img
              src={userData?.photo}
              alt={userData?.name}
              className="w-16 h-16 rounded-full shadow-lg border-2 border-gray-700/50 flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-200 truncate">{userData?.name}</h1>
              <p className="text-sm text-gray-400 truncate">{userData?.email}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base text-gray-300 font-medium">Generation Stats</h2>
              <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Generations left</span>
                  <span className="text-blue-400 font-medium">{userData?.generations?.count}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Revives at</span>
                  <span className="text-gray-300">
                    {new Date(userData?.generations?.last_gen).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm sm:text-base text-gray-300 font-medium">Save Stats</h2>
              <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Saves left</span>
                  <span className="text-emerald-400 font-medium">{userData?.saves?.quests}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Revives at</span>
                  <span className="text-gray-300">
                    {new Date(userData?.saves?.last_save).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {userData?.publicLinks?.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm sm:text-base text-gray-300 font-medium">Shared Links</h2>
                <div className="space-y-2">
                  {userData.publicLinks.map((link) => (
                    <div 
                      key={link.cp_id} 
                      className="bg-gray-900/50 rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row 
                        justify-between items-start sm:items-center gap-2"
                    >
                      <span className="text-xs sm:text-sm text-gray-300 truncate max-w-[200px]">
                        {link.name}
                      </span>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Link
                          to="#"
                          className="flex-1 sm:flex-none px-3 py-1 text-xs bg-blue-600/20 text-blue-400 
                            hover:bg-blue-600/30 border border-blue-500/50 rounded-lg 
                            transition-all duration-200 text-center"
                          onClick={() => toast("it'll work very soon", { icon: <FaInfoCircle /> })}
                        >
                          Open
                        </Link>
                        <button
                          onClick={() => makePrivate(link.cp_id)}
                          className="flex-1 sm:flex-none px-3 py-1 text-xs bg-red-600/20 text-red-400 
                            hover:bg-red-600/30 border border-red-500/50 rounded-lg 
                            transition-all duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {userData?.userPreferences && (
              <div className="space-y-2">
                <h2 className="text-sm sm:text-base text-gray-300 font-medium">Preferences</h2>
                <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                  {Object.entries(userData.userPreferences).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-400">{key}</span>
                      <span className="text-xs sm:text-sm text-gray-300">{value.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section - Fixed */}
        <div className="p-4 sm:p-6 border-t border-gray-700/50">
          <button
            onClick={() => {
              onClose();
              logOut();
            }}
            className="w-full px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 
              border border-red-500/50 rounded-lg transition-all duration-200 
              shadow-lg shadow-red-500/20 font-medium text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

Profile.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    photo: PropTypes.string,
    generations: PropTypes.shape({
      count: PropTypes.number,
      last_gen: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    saves: PropTypes.shape({
      quests: PropTypes.number,
      last_save: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    publicLinks: PropTypes.arrayOf(
      PropTypes.shape({
        cp_id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    userPreferences: PropTypes.object,
  }),
  onClose: PropTypes.func.isRequired
};