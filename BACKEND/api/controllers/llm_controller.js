const db = require('../config/db');  // Assuming you're using Firebase
const { ChatGroq } = require("@langchain/groq");
const { z } = require("zod");

const model = new ChatGroq({
  model: "llama-3.1-70b-versatile",
  groq_api_key: process.env.GROQ_API_KEY,
});

const code_subunit = z.object({
  name: z.string().describe("Provide a concise, descriptive name for this code subunit that reflects its main function or purpose."),
  content: z.string().describe("Insert the exact code content of this subunit, preserving all formatting and comments."),
  description: z.string().describe("Explain in detail: 1) What this subunit does, 2) How it contributes to solving the overall problem, 3) Any key algorithms or data structures used, 4) Its inputs and outputs, and 5) Any potential optimizations or limitations."),
});

const code_unit = z.object({
  name: z.string().describe("Create a clear, informative title for the entire code solution that reflects the problem it solves."),
  language: z.string().describe("Specify the programming language used, including version if relevant (e.g., 'Python 3.8', 'C++17')."),
  description: z.string().describe("Provide a comprehensive overview of the entire code: 1) The problem it solves, 2) The overall approach or algorithm used, 3) Time and space complexity analysis, 4) Any assumptions made, and 5) Potential areas for improvement or alternative approaches."),
  subunits: z.array(code_subunit).describe("Break down the code into logical, self-contained subunits. Each subunit should represent a distinct step or function in the overall solution."),
});

const structuredLlm = model.withStructuredOutput(code_unit);

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
        const prompt = `
          You are an expert competitive programming analyst and educator. Your task is to analyze and explain the given code in relation to the provided question, creating clear and insightful notes.

          <given_question>  
          The following is a question from a competitive programming platform:
          ${question}
          </given_question>

          <given_code>
          Analyze the following code solution:
          ${code}
          </given_code>

          <instructions>
          1. Carefully read the question and the code.
          2. Analyze how the code solves the given problem.
          3. Break down the code into logical subunits.
          4. For each subunit and the overall solution, provide detailed explanations as specified in the output structure.
          5. Focus on clarity, accuracy, and educational value in your explanations.
          6. Include insights on algorithm choice, time/space complexity, and any clever techniques used.
          7. If applicable, mention potential optimizations or alternative approaches.
          </instructions>

          <output_format>
          Strictly adhere to the following output structure:
          {
            "name": "Overall solution title",
            "language": "Programming language used",
            "description": "Comprehensive description of the entire solution",
            "subunits": [
              {
                "name": "Subunit name",
                "content": "Exact code of the subunit",
                "description": "Detailed explanation of the subunit"
              },
              // ... more subunits as needed
            ]
          }
          </output_format>

          Remember, your goal is to create clear, informative notes that help understand both the problem and its solution thoroughly.
        `;

        const result = await structuredLlm.invoke(prompt);

        // Update the user's generations count and last generation time
        userData.generations.count -= 1;
        userData.generations.last_gen = currentTime;

        await userRef.update({
          generations: userData.generations
        });

        res.send({ status: true, result: result });
      } else {
        // Calculate the next available generation time
        let nextGenTime = new Date(currentTime + timeRemaining);
        res.send({ status: false, reason: `try at this time: ${nextGenTime.toLocaleString()}` });
      }
    } else {
      res.send({ status: false, reason: "User does not exist" });
    }
  } catch (error) {
    console.error("Error in LLM processing:", error);
    res.send({
      status: false,
      reason: "An error occurred while processing the code",
    });
  }
};

module.exports = { llm_controller };