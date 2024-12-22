import { RxCrossCircled } from "react-icons/rx";
import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function Profile({ userData, onClose }) {
  const { logOut } = useContext(AuthContext);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex justify-end">
      <div className="w-72 h-full bg-[#151b23] p-2 rounded-l-lg border border-white/20 transition-transform transform translate-x-0">
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-xl text-center bg-blue-500/10 rounded-md px-1 my-1 text-[#247ce8]">
            Profile
          </h1>
          <button onClick={onClose} className="text-sm font-bold text-red-500">
            <RxCrossCircled size={24} />
          </button>
        </div>
        <h1 className="font-medium pt-1">{userData?.name}</h1>
        <h1 className="pb-1">{userData?.userData?.email}</h1>
        <h1 className="border-t border-white/20 pt-1">
          Generations left: {userData?.generations?.count}
        </h1>
        <h1 className="pb-1">
          Revives at{" "}
          {new Date(userData?.generations?.last_gen).toLocaleString()}
        </h1>
        <h1 className="border-t border-white/20 pt-1">
          Saves left: {userData?.saves?.quests}
        </h1>
        <h1 className="pb-1">
          Revives at {new Date(userData?.saves?.last_save).toLocaleString()}
        </h1>
        <button
          onClick={() => {
            onClose();
            logOut();
          }}
          className="button text-[#de2036] bg-[#a417274b] hover:bg-[#a4172769] border-0"
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
    userData: PropTypes.shape({
      email: PropTypes.string,
      photo: PropTypes.string,
    }),
    generations: PropTypes.shape({
      count: PropTypes.number,
      last_gen: PropTypes.string,
    }),
    saves: PropTypes.shape({
      quests: PropTypes.number,
      last_save: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
};
