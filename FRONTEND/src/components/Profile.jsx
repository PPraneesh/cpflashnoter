import { XCircle } from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Profile({ userData, onClose }) {
  const { logOut } = useContext(AuthContext);
  const { setUserData } = useContext(UserContext);

  const makePrivate = async (questionId) => {
    api.put("/delete_public_cp", {
      cp_id: questionId,
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setUserData(response.data.userDataStats);
          toast.success("Public link deleted successfully");
        } else {
          toast.error("Couldn't delete");
          console.log(response.data.reason);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Couldn't delete", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#151b23] p-4 rounded-lg w-full max-w-md mx-4 sm:mx-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500">
          <XCircle size={24} />
        </button>
        <div className="flex flex-col items-center">
          <img
            src={userData?.photo}
            alt={userData?.name}
            className="w-16 h-16 rounded-full mb-2"
          />
          <h1 className="font-medium pt-1">{userData?.name}</h1>
          <h1 className="pb-1">{userData?.email}</h1>
        </div>
        <h1 className="border-t border-white/20 pt-1">
          Generations left: {userData?.generations?.count}
        </h1>
        <h1 className="pb-1">
          Revives at{" "}
          {new Date(userData?.generations?.last_gen).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </h1>
        <h1 className="border-t border-white/20 pt-1">
          Saves left: {userData?.saves?.quests}
        </h1>
        <h1 className="pb-1">
          Revives at {new Date(userData?.saves?.last_save).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </h1>
        <div className="border-t border-white/20 pt-1"></div>
        {userData?.publicLinks?.length === 0 ? (
          <h1 className="mb-2">No Shared Links</h1>
        ) : (
          userData?.publicLinks && (
            <>
              <h1 className="mb-2">Manage Shared Links:</h1>
              {userData?.publicLinks.map((link) => (
                <div key={link.cp_id} className="flex justify-between items-center mb-2">
                  <span className="text-sm truncate text-white">{link.name}</span>
                  <div className="flex gap-2">
                    <Link
                      to={`#`}
                      className="text-xs text-blue-500 hover:text-blue-400 bg-blue-500/10 px-2 py-1 rounded"
                      onClick={()=> toast("it'll work very soon", { icon: <FaInfoCircle /> })}
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => makePrivate(link.cp_id)}
                      className="text-xs text-red-500 hover:text-red-400 bg-red-500/10 px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )
        )}
        {userData?.userPreferences && (
          <div className="border-t border-white/20 pt-1 mb-2">
            <h1 className="my-2">Your Preferences:</h1>
            {Object.entries(userData?.userPreferences).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">{value.toString()}</span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            onClose();
            logOut();
          }}
          className="button text-[#de2036] bg-[#a417274b] hover:bg-[#a4172769] border-0 w-full mt-2"
        >
          Logout
        </button>
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
