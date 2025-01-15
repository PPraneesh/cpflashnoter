import { useState, useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";
import Code from "../components/Code";
import { Timer } from 'lucide-react';

export default function Preparation() {
    const { userData, userDataCp, category, setCategory, } = useContext(UserContext);
    const [questionData, setQuestionData] = useState(null);
    const [firstCode, setFirstCode] = useState('');
    const [secondCode, setSecondCode] = useState('');
    const [showButtons, setShowButtons] = useState(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [showSecondApproach, setShowSecondApproach] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

  // Timer logic
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setQuestionData(null);
    setShowButtons(false);
  };

  const handleStart = () => {
    const index = Math.floor(Math.random() * userDataCp.length);
    const question = userDataCp[index];
    console.log(userDataCp)
    setQuestionData(question);
    setIsRunning(true);
  };

  const handleDone = () => {
    setShowButtons(true);
    setIsRunning(false);
  };

  const handleShowNotes = () => {
    setShowNotes(!showNotes);
};
  return (
//     <div className="min-h-screen p-8">
//       <h1 className="text-3xl font-bold text-center mb-8">Get Prepped</h1>
      
//       {/* Timer */}
//       <div className="flex items-center justify-center mb-8">
//         <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3">
//           <Timer className="w-6 h-6 text-blue-600" />
//           <span className="text-2xl font-mono">{formatTime(time)}</span>
//         </div>
//       </div>

//       {/* Category Selection */}
//       {
//         !isRunning &&(<div className="max-w-2xl mx-auto mb-8">
//         <label className="block text-sm font-medium text-white mb-2">
//           Which topic do you want to prepare?
//         </label>
//         <select
//           value={category}
//           onChange={handleCategoryChange}
//           className="w-full p-2 border rounded-md shadow-sm bg-[#151b23] text-white  border-white/20"
//         >
//           <option value="all">All categories</option>
//           {Array.isArray(userData.categories) &&
//             userData?.categories?.map((cat, index) => (
//               <option key={index} value={cat.categoryName}>
//                 {cat.categoryName}
//               </option>
//             ))}
//         </select>
//       </div>)
// }
//       {/* Start Button */}
//       {category && !questionData && (
//         <div className="text-center mb-8">
//           <button
//             onClick={handleStart}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Start
//           </button>
//         </div>
//       )}

//       {/* Question Display */}
//       {questionData && (
//         <div className="max-w-4xl mx-auto mb-8 bg-[]">
//           <div className="rounded-lg shadow-md p-6 mb-6 bg-[#0d1117]">
//             <h2 className="text-xl font-semibold mb-2">{questionData.name}</h2>
//             <div className="p-4 rounded-md">
//               <p className="font-medium">Question:</p>
//               <p className="mt-2 whitespace-pre-wrap">{questionData.question}</p>
//             </div>
//           </div>

//         <div className="mb-6">
//             <div className="flex items-center justify-center mb-4">
//                 <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                         type="checkbox"
//                         className="sr-only peer"
//                         onChange={(e) => setShowSecondApproach(e.target.checked)}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//                     <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
//                         {showSecondApproach ? '2nd approach' : '1st approach'}
//                     </span>
//                 </label>
//             </div>
//             {!showSecondApproach ? (
//                 <Code code={firstCode} setCode={setFirstCode} title='1st approach'/>
//             ) : (
//                 <Code code={secondCode} setCode={setSecondCode} title='2nd approach'/>
//             )}
//         </div>

//         {/* Done Button */}
//           {!showButtons && (
//             <div className="text-center">
//               <button
//                 onClick={handleDone}
//                 className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
//               >
//                 Done
//               </button>
//             </div>
//           )}

//           {/* Action Buttons */}
//           {showButtons && (
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleShowNotes}
//                 className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
//               >
//                 Show My Notes
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//       {showNotes && (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-[#0d1117] rounded-lg w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-4 border-b border-white/20">
//                 <h1 className="text-2xl font-bold text-white">Notes</h1>
//                 <button 
//                     onClick={() => setShowNotes(false)}
//                     className="text-white hover:text-gray-300"
//                 >
//                     ✕
//                 </button>
//             </div>
//             <div className="p-6">
//                 <div className="flex justify-between pb-2">
//                     <h1 className="text-2xl font-bold text-white mb-2">
//                         {questionData.name}
//                     </h1>
//                 </div>
//                 <p className="text-white mb-4 whitespace-pre-wrap">{questionData.description}</p>

//                 <div className="mb-6">
//                     <h2 className="text-xl font-semibold text-white mb-2">Question</h2>
//                     <p className="text-white bg-[#151b23] p-4 rounded-lg border border-white/20 whitespace-pre-wrap">
//                         {questionData.question}
//                     </p>
//                 </div>

//                 <div className="mb-6">
//                     <h2 className="text-xl font-semibold text-white mb-2">Code</h2>
//                     <div className="bg-[#151b23] p-4 rounded-lg border border-white/20">
//                         <pre className="text-sm text-white overflow-x-auto">{questionData.code}</pre>
//                     </div>
//                 </div>

//                 <div className="mb-6">
//                     <span className="px-2 py-1 bg-[#151b23] border border-white/20 text-white font-medium rounded">
//                         Language: {questionData.language}
//                     </span>
//                 </div>

//                 <div>
//                     <h2 className="text-xl font-semibold text-white mb-2">Subunits</h2>
//                     {questionData.subunits?.map((subunit, index) => (
//                         <div
//                             key={index}
//                             className="mb-4 bg-[#0d1117] p-4 rounded-lg border border-white/20"
//                         >
//                             <h3 className="text-lg font-semibold text-white mb-2">
//                                 {subunit.name}
//                             </h3>
//                             <p className="text-white mb-2">{subunit.description}</p>
//                             <div className="bg-[#151b23] p-4 rounded-lg">
//                                 <pre className="text-sm text-white overflow-x-auto">
//                                     {subunit.content}
//                                 </pre>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     </div>
// )}
//     </div>
<div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl text-center'>CURRENTLY UNAVAILABLE</h1>
</div>
  );
}


