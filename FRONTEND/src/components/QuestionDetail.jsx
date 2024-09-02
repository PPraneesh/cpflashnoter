import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

function QuestionDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [question, setQuestion] = useState(null);
    const server_url = import.meta.env.VITE_SERVER_URL;
    useEffect(() => {
        axios.get(`${server_url}/get_cp/${id}`, {
            params: { email: user.email }
        })
        .then((response) => {
            setQuestion(response.data);
        })
        .catch(() => {
            toast.error("couldn't get question details")
            console.error("Couldn't get question details");
        });
    }, [id, user.email]);

    if (!question) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{question.name}</h1>
            <p className="text-gray-600 mb-6">{question.description}</p>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2">Question</h2>
                <p className="text-gray-700">{question.question}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2">Code</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                    <code>{question.code}</code>
                </pre>
            </div>

            <h2 className="text-2xl font-bold mb-4">Subunits</h2>
            {question.subunits.map((subunit, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-2">{subunit.name}</h3>
                    <p className="text-gray-600 mb-4">{subunit.description}</p>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                        <code>{subunit.content}</code>
                    </pre>
                </div>
            ))}
        </div>
    );
}

export default QuestionDetail;