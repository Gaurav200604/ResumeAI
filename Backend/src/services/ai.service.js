const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
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

        // Try preferred model first, fall back to stable model on 503/overload
        const models = ["gemini-2.5-flash", "gemini-1.5-flash"];
        let response;
        let lastError;

        for (const model of models) {
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    response = await ai.models.generateContent({
                        model,
                        contents: prompt,
                        config: {
                            responseMimeType: "application/json",
                        },
                    });
                    // Success — break out of both loops
                    lastError = null;
                    break;
                } catch (err) {
                    lastError = err;
                    const isOverload =
                        err?.message?.includes("503") ||
                        err?.message?.includes("UNAVAILABLE") ||
                        err?.message?.includes("high demand");

                    if (isOverload && attempt < 3) {
                        // Exponential backoff: 2s, 4s
                        const delay = attempt * 2000;
                        console.warn(`[AI] ${model} overloaded (attempt ${attempt}). Retrying in ${delay}ms…`);
                        await new Promise((r) => setTimeout(r, delay));
                    } else {
                        // Non-retryable error or last attempt — try next model
                        console.warn(`[AI] ${model} failed after ${attempt} attempt(s): ${err.message}`);
                        break;
                    }
                }
            }
            if (response) break;
        }

        if (!response) throw lastError;

        // Strip markdown code fences if Gemini wraps the JSON (defensive)
        let rawText = response.text.trim();
        if (rawText.startsWith("```")) {
            rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
        }

        const parsed = JSON.parse(rawText);
        return parsed;
}

async function generatePDFfromHTML(htmlContent) {
  const browser= await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, {waitUntil: "networkidle0"});
  const pdfBuffer = await page.pdf({format: "A4" , margin: {top: "20px", bottom: "20px", left: "20px", right: "20px"}});
  await browser.close();

  return pdfBuffer;

}

async function generateResumePdf({resume, selfDescription, jobDescription}) {
  const prompt = `
You are a professional resume writer. Create a clean, modern, well-formatted HTML resume document.

Use the candidate's resume content, self-description, and job description below.
Tailor the resume to highlight relevant experience for the job.

Return ONLY a complete, valid HTML document with inline CSS styles (no external stylesheets).
The HTML must be self-contained and print-ready for A4 paper.

Resume Content:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

RULES:
1. Return ONLY the HTML document, nothing else.
2. Use clean, professional styling with inline CSS.
3. No markdown, no explanations.
4. Include sections: Contact (placeholder), Summary, Skills, Experience, Education.
5. Keep fonts system-safe (Arial, Helvetica, sans-serif).
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let html = response.text.trim();
  // Strip markdown fences if present
  if (html.startsWith("```")) {
    html = html.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/, "").trim();
  }

  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" } });
  await browser.close();

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };  



