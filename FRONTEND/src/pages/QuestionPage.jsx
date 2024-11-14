import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';

const PublicMaking = ({ isPublic, cp_id, makePublic, onClose, makePrivate }) => {
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
  
  const handleCopyLink = () => {
    toast.success("Link copied to clipboard");
    navigator.clipboard.writeText(`${FRONTEND_URL}/share/${cp_id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-[#151b23] p-6 rounded-lg border border-white/20 w-full max-w-md">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <IoCloseSharp />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Share Notes</h2>
        
        {isPublic ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/60">Share link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${FRONTEND_URL}/share/${cp_id}`}
                  className="flex-1 bg-[#0d1117] text-white p-2 rounded border border-white/20 text-sm"
                />
              
                <button
                  onClick={handleCopyLink}
                  className="button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] px-4 py-2 rounded border border-[#247ce889]"
                >
                  Copy
                </button>
              </div>
              <button 
                onClick={makePrivate}
              >
                Make Private
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white/80">
              Share your notes with others by creating a public link.
            </p>
            <button
              onClick={() => {
                makePublic();
              }}
              className="w-full button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] px-4 py-2 rounded border border-[#247ce889]"
            >
              Create Share Link
            </button>
          </div>
        )}
      </div>
    </div>
  )
};

PublicMaking.propTypes = {
  isPublic: PropTypes.bool.isRequired,
  cp_id: PropTypes.string.isRequired,
  makePublic: PropTypes.func.isRequired,
  makePrivate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Question = () => {
  const { userData } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const questionData = location.state
  const [isPublic, setIsPublic] = useState(questionData?.isPublic)
  const [showShareModal, setShowShareModal] = useState(false);
  const deleteAction = async ()=>{
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/delete_cp`,{
      email: userData?.email,
      cp_id: questionData.id
    })
    .then((response)=>{
      if(response.data.status){
        toast.success("Question deleted successfully")
        navigate("/home/questions")
      }
      else{
        toast.error("couldn't delete")
        console.log(response.data.reason)
      }
    })
  }
  const makePrivate = async ()=>{
    axios.post(`${import.meta.env.VITE_SERVER_URL}/delete_public_cp`,{
      cp_id: questionData.id,
      email: userData?.email
    })
    .then((response)=>{
      if(response.data.status){
        setIsPublic(false)
        toast.success("Public link deleted successfully")
      }
      else{
        toast.error("couldn't delete")
        console.log(response.data.reason)
      }
    })
    .catch(()=>{
      toast.error("couldn't delete")
    })
  }
  const makePublic = async ()=>{
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/share_cp`,{
      email: userData?.email,
      cp_id: questionData.id
    })
    .then((response)=>{
      if(response.data.status){
        setIsPublic(true)
        toast.success("Public link created successfully")
      }
      else{
        toast.error("couldn't share")
        console.log(response.data.reason)
      }
    }
    )
  }

  const { name, description, question, code, language, subunits } =
    questionData;

  return (
    <div >
        <button
          className="button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] flex items-center m-4 fixed bottom-0 right-0 border border-[#247ce889]"
          onClick={() => {
            navigate("/home");
          }}
        >
          <FaChevronLeft />
          <span className="whitespace-pre">{`  home`}</span>
        </button>

      <div className="p-6">
        <div className="flex justify-between pb-2">
          <h1 className="text-2xl font-bold text-white mb-2">{name}</h1>
          <div>
          <button 
        className="button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-0 mr-2" 
        onClick={() => setShowShareModal(true)}
      >
        Share
      </button>
            <button className="button text-[#de2036] bg-[#a417274b] hover:bg-[#a4172769] border-0" onClick={deleteAction}>Delete</button>
          </div>
        </div>
        <p className="text-white mb-4">{description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Question</h2>
          <p className="text-white bg-[#151b23] p-4 rounded-lg border border-white/20">
            {question}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Code</h2>
          <div className="bg-[#151b23] p-4 rounded-lg border border-white/20">
            <pre className="text-sm text-white overflow-x-auto ">{code}</pre>
          </div>
        </div>

        <div className="mb-6">
          <span className="px-2 py-1 bg-[#151b23] border border-white/20 text-white font-medium rounded">
            Language: {language}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Subunits</h2>
          {subunits.map((subunit, index) => (
            <div
              key={index}
              className="mb-4 bg-[#0d1117] p-4 rounded-lg border border-white/20"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {subunit.name}
              </h3>
              <p className="text-white mb-2">{subunit.description}</p>
              <div className="bg-[#151b23] p-4 rounded-lg ">
                <pre className="text-sm text-white overflow-x-auto">
                  {subunit.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showShareModal && (
        <PublicMaking
          isPublic={isPublic}
          cp_id={questionData.id}
          makePublic={makePublic}
          makePrivate={makePrivate}
          onClose={() => setShowShareModal(false)}
        />
      )}

    </div>
  );
};

export default Question;
