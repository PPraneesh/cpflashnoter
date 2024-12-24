const db = require("../config/db"); // Assuming you're using Firebase
const { ChatGroq } = require("@langchain/groq");

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  groq_api_key: process.env.GROQ_API_KEY,
});

const structuredLlm = model.withStructuredOutput({
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
          "Specify the programming language used, including version if relevant (e.g., 'Python 3.8', 'C++17').",
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
            "Dynamic Programming"
          ]
        },
        description: "The categories of algorithms or data structures that this problem focuses on. Take only from enum values, don't deviate from the list."
      }
    },
    required: ["name", "language", "description", "subunits"],
  },
});

const llm_controller = async (req, res) => {
  const { code, question } = req.body;
  const user_email = req.body.email; // User's email from response data
  const userRef = db.collection("users").doc(user_email);

  try {
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      let userData = userDoc.data();
      let currentTime = Date.now();
      let timeDiff = currentTime - userData.generations.last_gen;
      let timeRemaining = 24 * 60 * 60 * 1000 - timeDiff; // 24 hours in milliseconds

      // Reset generation count if more than 24 hours have passed since the last generation
      if (timeDiff >= 24 * 60 * 60 * 1000) {
        userData.generations.count = 5;
      }

      if (userData.generations.count > 0) {
        const prompt = ` You are an expert competitive programming analyst and educator. Your task is to analyze and explain the given code in relation to the provided question, creating clear and insightful notes. \n 
        The following is a question from a competitive programming platform: \n<given_question>\n ${question} \n</given_question> Analyze the following code solution: <given_code> ${code} </given_code> <instructions> 1. Carefully read the question and the code.\n 2. Analyze how the code solves the given problem. \n3. For each subunit and the overall solution, provide detailed explanations as specified in the output structure.\n 4. Focus on clarity, accuracy, and educational value in your explanations. \n5. Include insights on algorithm choice, time/space complexity, and any clever techniques used. </instructions> Remember, your goal is to create clear, informative notes that help understand both the problem and its solution thoroughly.`;

        const result = await structuredLlm.invoke(prompt);

        // Update the user's generations count and last generation time
        userData.generations.count -= 1;
        userData.generations.last_gen = currentTime;

        await userRef.update({
          generations: userData.generations,
        });

        res.send({ status: true, result: result, userDataStats: userData });
      } else {
        // Calculate the next available generation time
        let nextGenTime = new Date(currentTime + timeRemaining);
        res.send({
          status: false,
          reason: `try at this time: ${nextGenTime.toLocaleString()}`,
          userData: userData,
        });
      }
    } else {
      res.send({
        status: false,
        reason: "User does not exist",
        userData: null,
      }); // work on this thing
    }
  } catch (error) {
    console.error("Error in LLM processing:", error);
    res.send({
      status: false,
      reason: "An error occurred while processing the code",
      userData: null, // work on this thing
    });
  }
};

module.exports = { llm_controller };
