const db = require("../config/db"); // Assuming you're using Firebase
// const { ChatGroq } = require("@langchain/groq");
const {ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { tier } = require("../helper/tierDeterminer");
const { userDataMasker } = require("../helper/dataMasker");

const model = new ChatGoogleGenerativeAI({
  modelName:"gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY
})
// const model = new ChatGroq({
//   model: "llama-3.3-70b-versatile",
//   groq_api_key: process.env.GROQ_API_KEY,
// });



const codeFlowAgent = async(question, code) => {
  const prompt = `You are an expert DSA tutor and Competitive Programmer. You are expert in tracing code and helping students understand how code works step by step. Explain the control flow of the following code in a clear, step-by-step manner.
  
  <Question>
  ${question}
  </Question>
  <Code>
  ${code}
  </Code>`;
  try{
  const response = await model.invoke(prompt);
  const content = response.content;
  return content
  }catch(error){
    console.log(error);
    return null;
  }
}

const conceptExplainerAgent = async(question,code) => {
  const prompt = `You are an expert DSA tutor and Competitive Programmer. You are expert in explaining how the DSA concepts used in the code are applied to solve the question. Explain the application of concepts for the following:
  
  <Question>
  ${question}
  </Question>
  <Code>
  ${code}
  </Code>`;
  try{
  const response = await model.invoke(prompt);
  const content = response.content;
  return content;
  }catch(error){
    console.log(error);
    return null;
  }
}




const notes_generator = async (req, res) => {
  const { code, question, personalisedNotes } = req.body;
  const { email } = req.user;
  const userRef = db.collection("users").doc(email);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    res.send({
      status: false,
      reason: "User does not exist",
      userData: null,
    });
  } else {
    let userData = userDoc.data();
    const output = tier(userData);
    userData = output.userData;
    let userPreferences = "";
    if (userData.userPreferences) {
      Object.entries(userData.userPreferences).forEach(([key, value]) => {
        userPreferences += value + ".\n";
      });
    }
    if (userData.generations.count > 0) {
      const prompt = `You are an expert code analyst. Analyze the given question and code, and return ONLY a valid JSON object with this exact structure:
      {
        "name": "Clear, informative title reflecting the problem",
        "language": "Programming language used in code",
        "description": "Detailed explanation of the question and chosen approach", 
        "subunits": [
          {
            "name": "Name of subunit",
            "content": "Code segment",
            "description": "Detailed explanation of how this subunit works"
          }
        ],
        "categories": ["Relevant DSA categories"],
        "hints": ["Observable hints about the code"]
      }

      <given_question>
      ${question}
      </given_question>
      
      <given_code>
      ${code}
      </given_code>`;
      
      const personalisedPrompt = `You are an expert code analyst adapting to individual learning needs. Return ONLY a valid JSON object with this exact structure:
      {
        "name": "Clear, informative title reflecting the problem",
        "language": "Programming language used in code",
        "description": "Detailed explanation of the question and chosen approach",
        "subunits": [
          {
            "name": "Name of subunit",
            "content": "Code segment", 
            "description": "Detailed explanation adapted to user preferences"
          }
        ],
        "categories": ["Relevant DSA categories"],
        "hints": ["Observable hints about the code"]
      }

      <given_question>
      ${question}
      </given_question>

      <user_preferences>
      ${userPreferences}
      </user_preferences>
      
      <given_code>
      ${code}
      </given_code>`;

      const finalPrompt = personalisedNotes ? personalisedPrompt : prompt;
      const response = await model.invoke(finalPrompt);
      const content = response.content.trim();
      const jsonStartIdx = content.indexOf('{');
      const jsonEndIdx = content.lastIndexOf('}') + 1;
      const jsonStr = content.slice(jsonStartIdx, jsonEndIdx);
      let result;
      try {
        result = JSON.parse(jsonStr);
      } catch (error) {
        console.error('Error parsing LLM response:', error);
        throw new Error('Failed to parse the LLM response');
      }
      const [flowExp, conceptExplainer] = await Promise.all([
        codeFlowAgent(question, code),
        conceptExplainerAgent(question, code)
      ]);
      result["flowExplanation"] = flowExp;
      result["conceptApplication"] = conceptExplainer;
      userData.generations.count -= 1;
      userData.generations.lastGen = Date.now();
      await userRef.update(userData);
      userData = userDataMasker(userData);
      res.send({ status: true, result: result, userDataStats: userData });
    } else {
      const currentTime = Date.now();
      const timeRemaining = 24 * 60 * 60 * 1000 - (currentTime - userData.generations.lastGen);
      res.send({
        status: false,
        reason: `try at this time: ${new Date(currentTime + timeRemaining).toLocaleString()}`,
        userData: userData,
      });
    }
  }
};

const generatePrepAnalysis = async (req,res) => {
  const { problemRestatement, approach, pseudoCode, timeSpent, question, actualAnswer } = req.body;

  const prompt = `You are an expert interview coach analyzing interview preparation. You must return ONLY a valid JSON object with this exact structure:
  {
    "overallAssessment": {
      "clarity": number from 1-10,
      "approach": number from 1-10,
      "implementation": number from 1-10, 
      "overallScore": number from 1-10,
      "summary": "brief summary"
    },
    "detailedFeedback": {
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "suggestions": "specific suggestions"
    },
    "timeManagement": {
      "analysis": "time analysis",
      "recommendations": "time recommendations"
    },
    "nextSteps": [
      {
        "action": "specific action",
        "reason": "why important",
        "howTo": "implementation steps"
      }
    ]
  }

  Analyze this preparation attempt:

  <actual_question>
  ${question}
  </actual_question>

  <actual_answer>
  ${actualAnswer}
  </actual_answer>

  <problem_restatement>
  ${problemRestatement}
  </problem_restatement>

  <planned_approach>
  ${approach}
  </planned_approach>

  <pseudo_code>
  ${pseudoCode}
  </pseudo_code>

  <time_data>
  Time spent: ${timeSpent} seconds
  </time_data>

  Consider:
  1. Clarity and completeness of problem understanding
  2. Effectiveness of planned approach 
  3. Quality of pseudo code
  4. Time management
  5. Communication clarity

  Provide detailed feedback in the exact JSON format specified above.
  Do not include any text before or after the JSON.`;

  try {
    const response = await model.invoke(prompt);
    const content = response.content.trim();
    const jsonStartIdx = content.indexOf('{');
    const jsonEndIdx = content.lastIndexOf('}') + 1;
    const jsonStr = content.slice(jsonStartIdx, jsonEndIdx);
    const analysis = JSON.parse(jsonStr);
    
    console.log("Preparation analysis generated successfully:", analysis);
    return res.send({
      status: true,
      analysis: analysis,
    });
  } catch (error) {
    console.error("Error generating preparation analysis:", error);
    return res.send({
      status: false,
      error: "Failed to generate preparation analysis"
    });
  }
};

module.exports = { notes_generator, generatePrepAnalysis };
