import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const PublicMaking = ({ isPublic, cp_id, makePublic, onClose, makePrivate }) => {
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

  const handleCopyLink = () => {
    toast.success("Link copied to clipboard");
    navigator.clipboard.writeText(`${FRONTEND_URL}/share/${cp_id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700/50 w-full max-w-md shadow-xl">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-200 mb-6">Share Notes</h2>

        {isPublic ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Share link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${FRONTEND_URL}/share/${cp_id}`}
                  className="flex-1 bg-gray-900/50 text-gray-200 p-3 rounded-lg border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={makePrivate}
                className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                Make Private
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">Share your notes with others by creating a public link.</p>
            <button
              onClick={makePublic}
              className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
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
  const { setUserData, setDeleteActionState, deleteActionState } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const questionData = location.state;
  const [isPublic, setIsPublic] = useState(questionData?.isPublic);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [save, setSave] = useState(false);
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
    await api
    .delete("/delete_cp", {
    data: {
    cp_id: questionData.id,
    }
    })
    .then((response) => {
    if (response.data.status) {
    setDeleteActionState(!deleteActionState);
    toast.success("Question deleted successfully");
    navigate("/home/questions");
    } else {
    toast.error("Couldn't delete");
    }
    });
    };
    
    const makePrivate = async () => {
    api
    .put("/delete_public_cp", {
    cp_id: questionData.id,
    })
    .then((response) => {
    if (response.data.status) {
    setIsPublic(false);
    setUserData(response.data.userDataStats);
    toast.success("Public link deleted successfully");
    } else {
    toast.error("Couldn't delete");
    }
    })
    .catch(() => {
    toast.error("Couldn't delete");
    });
    };
    
    const makePublic = async () => {
    await api
    .post("/share_cp", {
    cp_id: questionData.id,
    })
    .then((response) => {
    if (response.data.status) {
    setIsPublic(true);
    toast.success("Public link created successfully");
    setUserData(response.data.userDataStats);
    } else {
    toast.error("Couldn't share");
    }
    });
    };
    
    const saveCP = async () => {
    setSave(true);
    setIsEditing(false);
    await api.put("/edit_cp", {
    cp_id: questionData.id,
    cp_data: formData
    })
    .then((response) => {
    if (response.data.status) {
    Object.assign(questionData, formData);
    toast.success("Edited successfully");
    } else {
    toast.error("An error occurred");
    }
    });
    setSave(false);
    };
    
    

  const { name, description, question, code, language, subunits, categories } = questionData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-20">
      <button
        className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20"
        onClick={() => navigate("/home")}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Home</span>
      </button>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-200">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-900/50 text-gray-200 p-3 rounded-lg border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 w-full"
              />
            ) : name}
          </h1>

          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                Categories
              </button>
              {showCategories && (
                <div className="absolute right-0 mt-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-lg p-4 shadow-xl z-10 min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    {categories?.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/50"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
              onClick={() => setShowShareModal(true)}
            >
              Share
            </button>
            
            <button
              className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/50 rounded-lg transition-all duration-200 shadow-lg shadow-red-500/20"
              onClick={deleteAction}
            >
              Delete
            </button>

            <div className="flex">
              <button
                className={`px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/50 transition-all duration-200 shadow-lg shadow-blue-500/20 ${
                  isEditing ? "rounded-l-lg" : "rounded-lg"
                }`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              
              {isEditing && (
                <button
                  className="px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/50 rounded-r-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  onClick={saveCP}
                  disabled={save}
                >
                  {save ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-lg">{description}</p>

        <div className="space-y-8">
          <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/50 p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Question</h2>
            {isEditing ? (
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 text-gray-200 p-4 rounded-lg border border-gray-700/50 min-h-[120px] focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
              />
            ) : (
              <p className="text-gray-300 whitespace-pre-wrap">{question}</p>
            )}
          </section>

          <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/50 p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Code</h2>
            <pre className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 text-gray-200 overflow-x-auto">
              <code>{code}</code>
            </pre>
          </section>

          <div className="inline-flex items-center px-3 py-1 bg-gray-900/50 text-gray-200 rounded-lg border border-gray-700/50 text-sm">
            Language: <span className="ml-1 text-blue-400">{language}</span>
          </div>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-200">Subunits</h2>
            {(isEditing ? formData.subunits : subunits)?.map((subunit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/50 p-6 shadow-xl"
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={subunit.name}
                      onChange={(e) => handleInputChangeForSubunits(e, index, "name")}
                      className="w-full bg-gray-900/50 text-gray-200 p-3 rounded-lg border border-gray-700/50 mb-4 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    />
                    <textarea
                      value={subunit.description}
                      onChange={(e) => handleInputChangeForSubunits(e, index, "description")}
                      className="w-full bg-gray-900/50 text-gray-200 p-3 rounded-lg border border-gray-700/50 mb-4 min-h-[100px] focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    />
                    <textarea
                      value={subunit.content}
                      onChange={(e) => handleInputChangeForSubunits(e, index, "content")}
                      className="w-full bg-gray-900/50 text-gray-200 p-3 rounded-lg border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">{subunit.name}</h3>
                    <p className="text-gray-300 mb-4">{subunit.description}</p>
                    <pre className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 text-gray-200 overflow-x-auto">
                      <code>{subunit.content}</code>
                    </pre>
                  </>
                )}
              </div>
            ))}
          </section>
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