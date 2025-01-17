import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { GoCopy } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-neutral-800 p-6 rounded-lg border border-neutral-700/30 hover:border-neutral-600/50 w-full max-w-md shadow-xl transition-all duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Share Notes</h2>

        {isPublic ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-400">Share link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${FRONTEND_URL}/share/${cp_id}`}
                  className="flex-1 bg-neutral-700/50 text-white p-3 rounded-lg"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-blue-600/20 text-blue-500 hover:text-blue-400 border border-blue-500/50 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <GoCopy />
                </button>
              </div>
              <button
                onClick={makePrivate}
                className="w-full px-4 py-2 bg-blue-600/20 text-blue-500 hover:text-blue-400 border border-blue-500/50 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                Make Private <MdDeleteOutline className="inline w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-neutral-400 text-center">
              Share your notes with others by creating a public link.
            </p>
            <button
              onClick={makePublic}
              className="w-full px-4 py-2 bg-blue-600/20 text-blue-500 hover:text-blue-400 border border-blue-500/50 rounded-lg transition-all duration-200 flex items-center justify-center"
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
  const { setUserData, setDeleteActionState, deleteActionState, userDataCp } =
    useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();
  let {id} = useParams();
  const questionData = userDataCp.find((cp) => cp.id === id);
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
        },
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
        console.log(response.data)
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
        console.log(response.data);
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
    await api
      .put("/edit_cp", {
        cp_id: questionData.id,
        cp_data: formData,
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

  const { name, description, question, code, language, subunits, categories } =
    questionData;

  return (
    <div className="min-h-screen bg-neutral-900 pb-20 text-white">
      <button
        className="fixed bottom-16 right-6 px-4 py-2 bg-neutral-800 border border-neutral-700/30 hover:border-neutral-600/50 text-blue-500 hover:text-blue-400 transition-all duration-200 flex items-center gap-2 rounded"
        onClick={() => navigate("/home/questions")}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Questions</span>
      </button>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex justify-between flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-white p-3 rounded w-full"
              />
            ) : (
              name
            )}
          </h1>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="px-4 py-2 bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-purple-700 hover:text-purple-600 rounded transition-all duration-200"
              >
                Categories
              </button>
              {showCategories && (
                <div className="absolute right-0 mt-2 bg-neutral-800 border border-neutral-700/30 hover:border-neutral-600/50 rounded p-4 z-10 min-w-[200px]">
                  <div className="flex flex-col gap-2 text-neutral-400">
                    {categories?.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-neutral-700/50 border border-neutral-700/30 rounded"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="px-4 py-2 bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-blue-500 hover:text-blue-400 rounded transition-all duration-200"
              onClick={() => setShowShareModal(true)}
            >
              Share
            </button>

            <button
              className="px-4 py-2 bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-red-500 hover:text-red-400 rounded transition-all duration-200"
              onClick={deleteAction}
            >
              Delete
            </button>

            <button
              className="px-4 py-2 bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-yellow-500 hover:text-yellow-400 rounded transition-all duration-200"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>

            {isEditing && (
              <button
                className="px-4 py-2 bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-green-500 hover:text-green-400 rounded transition-all duration-200 disabled:opacity-50"
                onClick={saveCP}
                disabled={save}
              >
                {save ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>

        <p className="text-neutral-400 text-lg">{description}</p>

        <div className="space-y-8">
          <section className="bg-neutral-800 rounded border border-neutral-700/30 hover:border-neutral-600/50 p-6">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            {isEditing ? (
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className="w-full bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-white p-4 rounded min-h-[120px]"
              />
            ) : (
              <p className="text-neutral-400 whitespace-pre-wrap">{question}</p>
            )}
          </section>

          <section className="bg-neutral-800 rounded border border-neutral-700/30 hover:border-neutral-600/50 p-6">
            <h2 className="text-xl font-semibold mb-4">Code</h2>
            <pre className="bg-neutral-700/50 p-4 rounded border border-neutral-700/30 text-white overflow-x-auto">
              <code>{code}</code>
            </pre>
          </section>

          <div className="inline-flex items-center px-3 py-1 bg-neutral-700/50 rounded border border-neutral-700/30 text-sm text-neutral-400">
            Language: <span className="ml-1 text-blue-500">{language}</span>
          </div>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Subunits</h2>
            {(isEditing ? formData.subunits : subunits)?.map((subunit, index) => (
              <div
                key={index}
                className="bg-neutral-800 rounded border border-neutral-700/30 hover:border-neutral-600/50 p-6"
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={subunit.name}
                      onChange={(e) => handleInputChangeForSubunits(e, index, "name")}
                      className="w-full bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-white p-3 rounded mb-4"
                    />
                    <textarea
                      value={subunit.description}
                      onChange={(e) => handleInputChangeForSubunits(e, index, "description")}
                      className="w-full bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-white p-3 rounded mb-4 min-h-[100px]"
                    />
                    <textarea
                      value={subunit.content}
                      onChange={(e) => handleInputChangeForSubunits(e, index, "content")}
                      className="w-full bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 text-white p-3 rounded"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-4">{subunit.name}</h3>
                    <p className="text-neutral-400 mb-4">{subunit.description}</p>
                    <pre className="bg-neutral-700/50 p-4 rounded border border-neutral-700/30 text-white overflow-x-auto">
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
