const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema");



const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});



const interviewReportSchema = z.object({

    matchScore: z.number().describe("The match score between the candidate's resume and the job description."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question asked during the interview."),
        intension: z.string().describe("The intention behind the technical question."),
        answer: z.string().describe("The answer provided during the interview."),

    })).describe("A list of technical questions asked during the interview, along with their intentions and answers."),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question asked during the interview."),
        intension: z.string().describe("The intention behind the behavioral question."),
        answer: z.string().describe("The answer provided during the interview."),

    })).describe("A list of behavioral questions asked during the interview, along with their intentions and answers."),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that has a gap."),
        severity: z.enum(['low', 'medium', 'high']).describe("The severity of the skill gap."),
    })).describe("A list of skill gaps identified during the interview, along with their severity levels."),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day of the preparation plan."),
        focus: z.string().describe("The focus area for the preparation plan."),
        task: z.array(z.string()).describe("A list of tasks to be completed for the preparation plan."),
    })).describe("A preparation plan for the interview, including the day, focus area, and tasks to be completed."),

});


async function generateInterviewReport({resume , selfDescription, jobDescription}) {

  const prompt = `
You are a Senior Technical Interviewer and Hiring Manager.

Analyze the candidate's resume, self-description, and job description.

Return ONLY valid JSON.

The response MUST exactly match the following structure.

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "task": [
        string
      ]
    }
  ]
}

VERY IMPORTANT RULES

1. Return ONLY JSON.
2. Do NOT return markdown.
3. Do NOT return explanations.
4. Do NOT return additional fields.
5. Every technicalQuestions item MUST be an OBJECT.
6. Every behavioralQuestions item MUST be an OBJECT.
7. Every skillGaps item MUST be an OBJECT.
8. Every preparationPlan item MUST be an OBJECT.
9. Never flatten arrays.
10. Never output key/value pairs like:
   [
      "question",
      "...",
      "intention",
      "...",
      "answer",
      "..."
   ]

Instead output:

"technicalQuestions":[
  {
    "question":"...",
    "intention":"...",
    "answer":"..."
  }
]

Generate:

• matchScore (0-100)

• 10 technical interview questions.

Each technical question should:
- be relevant to the resume
- be relevant to the job description
- include an ideal answer
- include the interviewer's intention

• 5 behavioral interview questions.

Each behavioral question should:
- include question
- include intention
- include an ideal STAR answer

• Skill gaps.

Mention only skills missing from the resume.

Example:

[
  {
    "skill":"Docker",
    "severity":"medium"
  }
]

• 7-day preparation plan.

Example:

[
  {
    "day":1,
    "focus":"React",
    "task":[
      "Study Hooks",
      "Practice Context API",
      "Build one mini project"
    ]
  }
]

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config:{
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        });

        console.log(response.text);

} 

module.exports = generateInterviewReport;
