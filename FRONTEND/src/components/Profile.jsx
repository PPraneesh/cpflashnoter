/* eslint-disable react/prop-types */
import { useContext } from "react";
import { XCircle } from "lucide-react";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import BuyPremium from "./BuyPremium";

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
        toast.success("Public link removed");
      } else {
        toast.error("Couldn't remove link");
      }
    } catch {
      toast.error("Couldn't remove link");
    }
  };

  const formatSeconds = (seconds) =>
    new Date(seconds * 1000).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 bg-neutral-900 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-lg border border-neutral-700/30 hover:border-neutral-600/50 transition-all w-full max-w-4xl mx-auto relative max-h-[calc(100vh-4rem)] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-300 transition-colors z-10"
        >
          <XCircle size={24} />
        </button>

        <div className="p-4 border-b border-neutral-700/30">
          <div className="flex items-center space-x-4">
            <img
              src={userData?.photo}
              alt={userData?.name}
              className="w-16 h-16 rounded-full border-2 border-neutral-700/30 flex-shrink-0"
            />
            <div>
              <h1 className="text-white text-lg font-semibold truncate">
                {userData?.name}
              </h1>
              <p className="text-neutral-400 text-sm truncate">
                {userData?.email}
              </p>
            </div>
          </div>
        </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
            {userData?.tier === "premium"
              ? "Premium Plan"
              : userData?.tier === "free"
              ? "Free Plan"
              : "Expired Plan"}
                </h2>
                <p className="text-sm text-neutral-400">
            {userData?.tier === "premium"
              ? "Active subscription"
              : userData?.tier === "free"
              ? "Free plan"
              : "Subscription expired"}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
            userData?.tier === "premium"
              ? "bg-blue-500/20 text-blue-400"
              : userData?.tier === "free"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
                }`}
              >
                {userData?.tier === "premium"
            ? "Current Plan"
            : userData?.tier === "free"
            ? "Free Plan"
            : "Expired"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-neutral-700/30 rounded-lg">
                <span className="text-neutral-300">Start Date</span>
                <span className="text-white">
            {userData?.tier === "premium"
              ? formatSeconds(userData?.premium?.startDate._seconds)
              : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-700/30 rounded-lg">
                <span className="text-neutral-300">End Date</span>
                <span className="text-white">
            {userData?.tier === "premium"
              ? formatSeconds(userData?.premium?.endDate._seconds)
              : userData?.tier === "free"
              ? formatSeconds(userData?.freeTier?.endDate._seconds)
              : "--"}
                </span>
              </div>
            </div>
          <BuyPremium />

            {/* Generation & Saves */}
          <div className="bg-neutral-700/50 p-3 rounded-md border border-neutral-700/30 hover:border-neutral-600/50 transition-all space-y-2">
            <div className="flex justify-between text-sm text-white">
              <span>Generations left</span>
              <span className="text-blue-500">
                {userData?.generations?.count}
              </span>
            </div>
            <div className="flex justify-between text-sm text-white">
              <span>Last updated</span>
              <span className="text-neutral-400">
                {userData?.generations?.lastGen
                  ? formatSeconds(userData.generations.lastGen/1000)
                  : "--"}
              </span>
            </div>
            <div className="flex justify-between text-sm text-white mt-3">
              <span>Saves left</span>
              <span className="text-green-500">{userData?.saves?.quests}</span>
            </div>
            <div className="flex justify-between text-sm text-white">
              <span>Last updated</span>
              <span className="text-neutral-400">
                {userData?.saves?.lastSave
                  ? formatSeconds(userData.saves.lastSave/1000)
                  : "--"}
              </span>
            </div>
          </div>
          {/* Public Links */}
          {userData?.publicLinks?.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-white text-sm font-medium">Shared Links</h2>
              {userData.publicLinks.map((link) => (
                <div
                  key={link.cp_id}
                  className="bg-neutral-700/50 rounded-md p-3 border border-neutral-700/30 hover:border-neutral-600/50 transition-all flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-neutral-400 text-xs truncate max-w-[180px]">
                    {link.name}
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      to={`/home/questions/${link.cp_id}`}
                      onClick={onClose}
                      className="flex-1 sm:flex-none px-3 py-1 text-xs text-blue-500 bg-text-900/30 hover:bg-text-900/40 border border-blue-500/40 rounded-lg transition-all text-center"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => makePrivate(link.cp_id)}
                      className="flex-1 sm:flex-none px-3 py-1 text-xs text-red-500 hover:text-red-400 border border-red-500/40 rounded-lg transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preferences */}
          {userData?.userPreferences && (
            <div className="bg-neutral-700/50 p-3 rounded-md border border-neutral-700/30 hover:border-neutral-600/50 transition-all space-y-2">
              <h2 className="text-white text-sm font-medium">Preferences</h2>
              {Object.entries(userData.userPreferences).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-neutral-400">{key}</span>
                  <span className="text-white">{value.toString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-700/30">
          <button
            onClick={() => {
              onClose();
              logOut();
            }}
            className="w-full px-4 py-2 bg-red-900/30 hover:bg-red-900/40 text-red-500 border border-red-500/40 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// Profile.propTypes = {
//   userData: PropTypes.shape({
//     name: PropTypes.string,
//     email: PropTypes.string,
//     photo: PropTypes.string,
//     tier: PropTypes.string,
//     premium: PropTypes.shape({
//       startDate: PropTypes.number,
//       endDate: PropTypes.number,
//     }),
//     freeTier: PropTypes.shape({
//       endDate: PropTypes.shape({ _seconds: PropTypes.number }),
//     }),
//     generations: PropTypes.shape({
//       count: PropTypes.number,
//       lastGen: PropTypes.shape({ _seconds: PropTypes.number }),
//     }),
//     saves: PropTypes.shape({
//       quests: PropTypes.number,
//       lastSave: PropTypes.shape({ _seconds: PropTypes.number }),
//     }),
//     publicLinks: PropTypes.arrayOf(
//       PropTypes.shape({
//         cp_id: PropTypes.string.isRequired,
//         name: PropTypes.string.isRequired,
//       })
//     ),
//     userPreferences: PropTypes.object,
//   }),
//   onClose: PropTypes.func.isRequired,
// };
