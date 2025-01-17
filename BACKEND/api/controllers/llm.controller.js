const db = require("../config/db"); // Assuming you're using Firebase
const { ChatGroq } = require("@langchain/groq");
const { tier } = require("../helper/tierDeterminer");
const { userDataMasker } = require("../helper/dataMasker");

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  groq_api_key: process.env.GROQ_API_KEY,
});

const structuredNotesLlm = model.withStructuredOutput({
  name: "code_analysis",
  description:
    "Analyze and explain the given code in relation to the provided question.",
  parameters: {
    title: "Code Analysis",
    type: "object",
    properties: {
      name: {
        type: "string",
        description:
          "Create a clear, informative title for the entire code solution that reflects the problem it solves.",
      },
      language: {
        type: "string",
        description:
          "Specify the programming language used, including version if relevant (e.g., 'Python', 'C++').",
      },
      description: {
        type: "string",
        description:
          "Provide a comprehensive overview of the entire code: 1) The problem it solves, 2) The overall approach or algorithm used, 3) Time and space complexity analysis, 4) Any assumptions made, and 5) Potential areas for improvement or alternative approaches.",
      },
      subunits: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Provide a concise, descriptive name for this code subunit that reflects its main function or purpose.",
            },
            content: {
              type: "string",
              description:
                "Insert the exact same code content of this subunit, preserving all formatting and comments. make sure that give output code has \n so that it can be displayed nicely",
            },
            description: {
              type: "string",
              description:
                "Explain in detail: 1) What this subunit does, 2) How it contributes to solving the overall problem, 3) Any key algorithms or data structures used, 4) Its inputs and outputs, and 5) Any potential optimizations or limitations.",
            },
          },
          required: ["name", "content", "description"],
        },
        description:
          "Break down the code into logical, self-contained subunits. Each subunit should represent a distinct step or function in the overall solution.",
      },
      categories: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "Arrays",
            "Two Pointers",
            "Sliding Windows",
            "Binary Search",
            "Strings",
            "Linked List",
            "Recursion & Backtracking",
            "Stacks & Queues",
            "Heaps",
            "Greedy Algorithms",
            "Binary Trees",
            "Binary Search Trees",
            "Dynamic Programming",
          ],
        },
        description:
          "The categories of algorithms or data structures that this problem focuses on. Take only from enum values, don't deviate from the list.",
      },
      hints: {
        type: "array",
        items: {
          type: "string",
          description:
            "Provide hints that help understand the question and the code solution. Start with general hints and progress to more specific ones if needed.",
        },
      },
    },
    required: [
      "name",
      "language",
      "description",
      "subunits",
      "hints",
      "categories",
    ],
  },
});

const notes_generator = async (req, res) => {
  const { code, question, personalisedNotes } = req.body;
  const { email, status } = req.user;
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
      const prompt = `You are an expert competitive programming analyst and educator. Your task is to analyze and explain the given code in relation to the provided question, creating clear and insightful notes. \n 
        The following is a question from a competitive programming platform: \n
        <given_question>
        ${question}
        </given_question> 
        Analyze the following code solution:
         <given_code>
          ${code} 
          </given_code> 
        <instructions> 
        1. Carefully read the question and the code. 
        2. Analyze how the code solves the given problem.
        3. For each subunit and the overall solution, provide detailed explanations as specified in the output structure.
        4. Focus on clarity, accuracy, and educational value in your explanations.
        5. Include insights on algorithm choice, time/space complexity, and any clever techniques used. 
        </instructions>
         Remember, your goal is to create clear, informative notes that help understand both the problem and its solution thoroughly.`;

      const personalisedPrompt = `You are an expert competitive programming analyst and educator. Your task is to analyze and explain the given code in relation to the provided question, creating clear and insightful notes tailored to the user's learning preferences. \n 

The following is a question from a competitive programming platform: \n
<given_question>
${question}
</given_question>

<user_preferences>
${userPreferences}
</user_preferences>

Analyze the following code solution:
<given_code>
${code}
</given_code>

<instructions>
1. Carefully read the question, code, and user preferences.
2. Adapt your explanation style based on the user's preferences (e.g., level of detail, preferred learning methods, areas of focus).
3. Analyze how the code solves the given problem.
4. For each subunit and the overall solution, provide detailed explanations as specified in the output structure.
5. Focus on clarity, accuracy, and educational value in your explanations.
6. Include insights on algorithm choice, time/space complexity, and any clever techniques used.
7. Highlight specific aspects that align with the user's interests and learning goals.
</instructions>

Remember, your goal is to create clear, informative notes that help understand both the problem and its solution thoroughly, while ensuring the explanations resonate with the user's learning style and preferences.`;

      const finalPrompt = personalisedNotes ? personalisedPrompt : prompt;
      const result = await structuredNotesLlm.invoke(finalPrompt);
      // Update the user's generations count and last generation time
      userData.generations.count -= 1;
      userData.generations.lastGen = Date.now();

      await userRef.update(userData);
      userData = userDataMasker(userData);
      res.send({ status: true, result: result, userDataStats: userData });
    } else {
      // Calculate the next available generation time
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

const prepAnalysisLLM = model.withStructuredOutput({
  name: "prep_analysis",
  description:
    "Analyze user's interview preparation approach and provide structured feedback",
  parameters: {
    type: "object",
    properties: {
      overallAssessment: {
        type: "object",
        properties: {
          clarity: {
            type: "number",
            description:
              "Score from 1-10 on how clearly the user understood and restated the problem",
          },
          approach: {
            type: "number",
            description:
              "Score from 1-10 on the effectiveness of the planned approach",
          },
          implementation: {
            type: "number",
            description:
              "Score from 1-10 on the quality of pseudo code implementation",
          },
          overallScore: {
            type: "number",
            description: "Overall preparation quality score from 1-10",
          },
          summary: {
            type: "string",
            description: "Brief summary of the overall preparation quality",
          },
        },
        required: [
          "clarity",
          "approach",
          "implementation",
          "overallScore",
          "summary",
        ],
      },
      detailedFeedback: {
        type: "object",
            properties: {
              strengths: {
                type: "array",
                items: { type: "string" },
                description: "What the user did well in problem restatement",
              },
              improvements: {
                type: "array",
                items: { type: "string" },
                description:
                  "Areas where problem restatement could be improved",
              },
              suggestions: {
                type: "string",
                description:
                  "Specific suggestions for improving problem clarification",
              },
            },
            required: ["strengths", "improvements", "suggestions"],
      },
      timeManagement: {
        type: "object",
        properties: {
          analysis: {
            type: "string",
            description: "Analysis of time spent on each preparation phase",
          },
          recommendations: {
            type: "string",
            description: "Recommendations for better time management",
          },
        },
        required: ["analysis", "recommendations"],
      },
      nextSteps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            action: {
              type: "string",
              description: "Specific action to improve",
            },
            reason: {
              type: "string",
              description: "Why this action is important",
            },
            howTo: {
              type: "string",
              description: "How to implement this improvement",
            },
          },
          required: ["action", "reason", "howTo"],
        },
        description: "Prioritized list of actions for improvement",
      },
    },
    required: [
      "overallAssessment",
      "detailedFeedback",
      "timeManagement",
      "nextSteps",
    ],
  },
});

const generatePrepAnalysis = async (req,res) => {
  const { problemRestatement, approach, pseudoCode, timeSpent, question, actualAnswer } = req.body;

const prompt = `As an expert interview coach, analyze the following interview preparation attempt:
The actual question is: 
<actual_question>
${question}
</actual_question>

The actual answer is:
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

Analyze the preparation attempt holistically, considering:
1. Clarity and completeness of problem understanding
2. Effectiveness of the planned approach
3. Quality of pseudo code implementation
4. Time management and efficiency
5. Communication patterns and clarity

Provide detailed feedback and actionable improvements following the specified output structure.
Focus on both strengths and areas for improvement, with specific, actionable suggestions.`;

  try {
    const analysis = await prepAnalysisLLM.invoke(prompt);
    console.log("Preparation analysis generated successfully:", analysis);
    return res.send({
      status: true,
      analysis: analysis,
    });
  } catch (error) {
    console.error("Error generating preparation analysis:", error);
    return res.send({
      status: false,
      error: "Failed to generate preparation analysis",
    });
  }
};

module.exports = { notes_generator, generatePrepAnalysis };
