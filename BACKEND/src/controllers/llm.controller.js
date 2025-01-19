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
  description: "Perform thorough, self-questioning analysis of code while maintaining high reliability. Express uncertainty when needed and avoid making assumptions.",
  parameters: {
    title: "Code Analysis",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Create a clear, informative title that accurately reflects the problem. If uncertain about any aspect, use more general terms.",
      },
      language: {
        type: "string",
        description: "Specify only the programming language that is explicitly visible in the code. If version information is not clearly evident, omit it.",
      },
      description: {
        type: "string",
        description: `Provide a thorough analysis following these steps:
          1. Start with observable facts about the code
          2. Question each assumption before making it
          3. Explicitly state any uncertainties
          4. Analyze complexity only if the algorithm is clearly identifiable
          5. List improvements only for clearly suboptimal patterns
          6. Express any doubts about the analysis
          Format: Begin with clear observations, then progress to more complex analysis, marking uncertain elements with explicit notes.`,
      },
      subunits: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Provide a factual, observation-based name. Use functional descriptions rather than assuming intent.",
            },
            content: {
              type: "string",
              description: "Extract the exact code content, preserving all formatting and ensuring proper newline (\\n) characters for display. Do not modify or 'improve' the code.",
            },
            description: {
              type: "string",
              description: `Analyze each subunit through careful steps:
                1. List observable behaviors without interpretation
                2. Question each assumption about functionality
                3. Describe clear input-output relationships
                4. Note any ambiguities or uncertainties
                5. Only state optimizations for clear inefficiencies
                Format: Start with concrete observations, then progress to analysis, clearly marking any uncertainties.`,
            },
          },
          required: ["name", "content", "description"],
        },
      },
      categories: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "Arrays", "Two Pointers", "Sliding Windows", "Binary Search",
            "Strings", "Linked List", "Recursion & Backtracking",
            "Stacks & Queues", "Heaps", "Greedy Algorithms",
            "Binary Trees", "Binary Search Trees", "Dynamic Programming"
          ],
        },
        description: "Only include categories that are definitively present in the code. Return an empty array if uncertain about any classifications. Better to omit than to miscategorize.",
      },
      hints: {
        type: "array",
        items: {
          type: "string",
          description: "Provide only hints that are directly observable from the code structure. Start with fundamental observations and progress to more specific insights. Mark any speculative hints clearly.",
        },
      },
    },
    required: ["name", "language", "description", "subunits", "hints"],
  },
});


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
      const prompt = `You are an expert code analyst who employs extremely thorough, self-questioning reasoning. Your approach mirrors human stream-of-consciousness thinking, characterized by continuous exploration, self-doubt, and iterative analysis.

      <given_question>
      ${question}
      </given_question>
      
      <given_code>
      ${code}
      </given_code>
      
      <analysis_principles>
      1. EXPLORATION OVER CONCLUSION
      - Never rush to conclusions
      - Keep exploring until understanding emerges naturally
      - Question every assumption and inference
      - Express uncertainty freely when present
      
      2. DEPTH OF REASONING
      - Engage in extensive contemplation
      - Express thoughts in natural, conversational internal monologue
      - Break down complex thoughts into simple, atomic steps
      - Embrace uncertainty and revision of previous thoughts
      
      3. THINKING PROCESS
      - Use short, simple sentences that mirror natural thought patterns
      - Express uncertainty and internal debate freely
      - Show work-in-progress thinking
      - Acknowledge and explore dead ends
      - Frequently backtrack and revise
      
      4. RELIABILITY FOCUS
      - Express uncertainty rather than make assumptions
      - Return empty/null for any classifications you're not completely certain about
      - Clearly mark speculative interpretations
      - Prioritize accuracy over completeness
      </analysis_principles>
      
      <instructions>
      1. Begin with observable facts only
      2. Question each inference before making it
      3. Express uncertainty explicitly
      4. Build understanding iteratively
      5. Return to and revise earlier conclusions
      6. Mark any speculative interpretations clearly
      7. Omit any classifications you're not certain about
      </instructions>
      
      Remember: Your goal is thorough understanding through careful exploration, not quick answers. Express uncertainty freely and maintain high reliability in your analysis.`;
      
      const personalisedPrompt = `You are an expert code analyst who employs extremely thorough, self-questioning reasoning while adapting to individual learning needs. Your approach combines careful analysis with personalized explanation.
      
      <given_question>
      ${question}
      </given_question>
      
      <user_preferences>
      ${userPreferences}
      </user_preferences>
      
      <given_code>
      ${code}
      </given_code>
      
      <analysis_principles>
      1. EXPLORATION WITH ADAPTATION
      - Never rush to conclusions
      - Adapt explanation style to user preferences
      - Question every assumption while maintaining accessibility
      - Express uncertainty in a way that aligns with user's learning style
      
      2. DEPTH WITH RELEVANCE
      - Engage in extensive contemplation
      - Focus on aspects most relevant to user's interests
      - Break down concepts according to user's preferred learning pace
      - Balance thorough analysis with user's preferred level of detail
      
      3. THINKING PROCESS
      - Mirror natural thought patterns while considering user's background
      - Express uncertainty in a way that aids learning
      - Show work-in-progress thinking aligned with user's goals
      - Acknowledge and explore dead ends constructively
      
      4. RELIABILITY FOCUS
      - Express uncertainty rather than make assumptions
      - Adapt technical depth to user's level while maintaining accuracy
      - Clearly mark speculative interpretations
      - Prioritize accuracy over completeness
      </analysis_principles>
      
      <instructions>
      1. Begin with observations at user's technical level
      2. Question each inference while maintaining clarity
      3. Express uncertainty in an educational manner
      4. Build understanding at user's preferred pace
      5. Focus on aspects matching user's interests
      6. Mark speculative interpretations clearly
      7. Omit any unclear classifications
      </instructions>
      
      Remember: Your goal is to combine thorough analysis with personalized learning while maintaining high reliability. Never sacrifice accuracy for accessibility.`;
      

      const finalPrompt = personalisedNotes ? personalisedPrompt : prompt;
      const result = await structuredNotesLlm.invoke(finalPrompt);
      // Update the user's generations count and last generation time
      userData.generations.count -= 1;
      userData.generations.lastGen = Date.now();
      console.log(result)
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
