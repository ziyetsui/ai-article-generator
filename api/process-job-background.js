import { getStore } from "@netlify/blobs";
import "dotenv/config"; // To load environment variables

// --- DeepSeek API Helper ---
// This section is copied from the original api/index.js
// In a larger application, this would be in a shared utils folder.

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL_NAME = process.env.DEEPSEEK_MODEL_NAME || 'deepseek-chat';

async function generateWithDeepseek(prompt) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set in the environment variables.');
  }
  // ... (rest of the function is the same as before)
  const url = `${DEEPSEEK_BASE_URL}/v1/chat/completions`;
  const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        stream: false
      })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`DeepSeek API request failed with status ${response.status}: ${errorBody}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}

const ARTICLE_GENERATION_PROMPT = `# Role: 公众号爆款文章生成器 (刘润风格)
... (rest of the prompt is the same)
`;

// --- Netlify Background Function Handler ---

export default async (req) => {
  const { jobId } = await req.json();
  const store = getStore("article-jobs");

  try {
    const jobData = await store.get(jobId, { type: "json" });
    if (!jobData) {
      console.error(`Job ${jobId} not found in store.`);
      return;
    }

    console.log(`Processing job: ${jobId}`);
    
    // Perform the long-running task
    const prompt = ARTICLE_GENERATION_PROMPT + '\n\n' + jobData.inspiration;
    const article = await generateWithDeepseek(prompt);

    // Update the job status and store the result
    await store.setJSON(jobId, {
      ...jobData,
      status: "completed",
      article: article,
    });

    console.log(`Job ${jobId} completed successfully.`);
    return new Response(`Job ${jobId} processed.`);

  } catch (error) {
    console.error(`Error processing job ${jobId}:`, error);
    // Update the job status to 'failed'
    await store.setJSON(jobId, {
      status: "failed",
      error: error.message,
    });
    // This response is for Netlify's internal logging, not the user.
    return new Response(`Failed to process job ${jobId}.`, { status: 500 });
  }
};
