import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const PublicMaking = ({
  isPublic,
  cp_id,
  makePublic,
  onClose,
  makePrivate,
}) => {
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

  const handleCopyLink = () => {
    toast.success("Link copied to clipboard");
    navigator.clipboard.writeText(`${FRONTEND_URL}/share/${cp_id}`);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

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
                className="w-full button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] px-4 py-2 rounded border border-[#247ce889]"
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
  );
};

PublicMaking.propTypes = {
  isPublic: PropTypes.bool.isRequired,
  cp_id: PropTypes.string.isRequired,
  makePublic: PropTypes.func.isRequired,
  makePrivate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Question = () => {
  const { userData, setUserData, setDeleteActionState, deleteActionState } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const questionData = location.state;
  const [isPublic, setIsPublic] = useState(questionData?.isPublic);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [save, setSave] = useState(false)
  const [showCategories, setShowCategories] = useState(false);

  const [formData, setFormData] = useState({
    name: questionData?.name,
    description: questionData?.description,
    question: questionData?.question,
    code: questionData?.code,
    subunits: questionData?.subunits || [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeForSubunits = (e, index, field) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedSubunits = [...prevData.subunits];
      updatedSubunits[index][field] = value;
      return {
        ...prevData,
        subunits: updatedSubunits,
      };
    });
  };

  const deleteAction = async () => {
    await axios
      .post(`${import.meta.env.VITE_SERVER_URL}/delete_cp`, {
        email: userData?.email,
        cp_id: questionData.id,
      })
      .then((response) => {
        if (response.data.status) {
          setDeleteActionState(!deleteActionState);
          toast.success("Question deleted successfully");
          navigate("/home/questions");
        } else {
          toast.error("Couldn't delete");
          console.log(response.data.reason);
        }
      });
  };

  const makePrivate = async () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/delete_public_cp`, {
        cp_id: questionData.id,
        email: userData?.email,
      })
      .then((response) => {
        if (response.data.status) {
          setIsPublic(false);
          setUserData(response.data.userDataStats);
          toast.success("Public link deleted successfully");
        } else {
          toast.error("Couldn't delete");
          console.log(response.data.reason);
        }
      })
      .catch(() => {
        toast.error("Couldn't delete");
      });
  };

  const makePublic = async () => {
    await axios
      .post(`${import.meta.env.VITE_SERVER_URL}/share_cp`, {
        email: userData?.email,
        cp_id: questionData.id,
      })
      .then((response) => {
        if (response.data.status) {
          setIsPublic(true);
          toast.success("Public link created successfully");
          setUserData(response.data.userDataStats);
        } else {
          toast.error("Couldn't share");
          console.log(response.data.reason);
        }
      });
  };  

  const saveCP = async()=>{
    setSave(true);
    setIsEditing(false)
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/edit_cp`, {
      email: userData?.email,
      cp_id: questionData.id,
      cp_data : formData
    })
    .then((response)=>{
      if(response.data.status){
        toast.success("edited successfully");
      }else{
        toast.error("aw! there's an error");
        console.log(response.data.reason)
      }
    })
    setSave(false)
  }
  
  const { name, description, question, code, language, subunits, categories } =
    questionData;

  return (
    <div>
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
          <h1 className="text-2xl font-bold text-white mb-2">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-[#151b23] text-white p-2 rounded border border-white/20 h-fit"
              />
            ) : (
              name
            )}
          </h1>
          
          
          <div>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-0 mr-2"
          >
            Categories
          </button>
          {showCategories && (
            <div className="absolute mt-2 bg-[#151b23] border border-white/20 rounded-lg p-2 z-10">
              <div className="flex flex-col flex-wrap gap-2">
                {categories?.map((cat, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#2240646d] text-[#247ce8] rounded block"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
            <button
              className="button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-0 mr-2"
              onClick={() => setShowShareModal(true)}
            >
              Share
            </button>
            <button
              className="button text-[#de2036] bg-[#a417274b] hover:bg-[#a4172769] border-0 mr-2"
              onClick={deleteAction}
            >
              Delete
            </button>
            <button
              className={`button text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-0 ${isEditing && "rounded-tr-none rounded-br-none mr-[2px]"}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing && <button className="button rounded-tl-none rounded-bl-none bg-[#113023b7] text-[#1c9f5b]  hover:bg-[#113023f3]"
            onClick={saveCP}
            >{save? "saving.." :"Save"}</button>}
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
          {isEditing
            ? formData?.subunits?.map((subunit, index) => (
                <div
                  key={index}
                  className="mb-4 bg-[#0d1117] p-4 rounded-lg border border-white/20"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    <input
                      type="text"
                      value={subunit.name}
                      onChange={(e) =>
                        handleInputChangeForSubunits(e, index, "name")
                      }
                      className="bg-[#151b23] text-white p-2 rounded border border-white/20 w-full"
                    />
                  </h3>
                  <textarea
                    value={subunit.description}
                    onChange={(e) =>
                      handleInputChangeForSubunits(e, index, "description")
                    }
                    className="bg-[#151b23] text-white p-2 rounded border border-white/20 w-full min-h-[100px] mb-2"
                  />

                  <textarea
                    value={subunit.content}
                    onChange={(e) =>
                      handleInputChangeForSubunits(e, index, "content")
                    }
                    className="bg-[#151b23] text-white p-2 rounded border border-white/20 w-full"
                  />
                </div>
              ))
            : subunits?.map((subunit, index) => (
                <div
                  key={index}
                  className="mb-4 bg-[#0d1117] p-4 rounded-lg border border-white/20"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {subunit.name}
                  </h3>
                  <p className="text-white mb-2">{subunit.description}</p>
                  <div className="bg-[#151b23] p-4 rounded-lg">
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
