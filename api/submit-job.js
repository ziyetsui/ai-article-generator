import { getStore } from "@netlify/blobs";
import { v4 as uuidv4 } from "uuid";
import { invoke } from "@netlify/functions";

export default async (req, context) => {
  try {
    const { inspiration } = await req.json();

    if (!inspiration) {
      return new Response(JSON.stringify({ message: "请提供灵感内容" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const jobId = uuidv4();
    const store = getStore("article-jobs");

    // Store the initial job data
    await store.setJSON(jobId, {
      status: "pending",
      inspiration,
      timestamp: new Date().toISOString(),
    });

    // Invoke the background function to do the heavy lifting, but don't wait for it
    invoke("process-job-background", {
      body: JSON.stringify({ jobId }),
    });

    // Immediately return the job ID
    return new Response(JSON.stringify({ jobId }), {
      status: 202, // Accepted
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error submitting job:", error);
    return new Response(JSON.stringify({ message: "开启任务失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
};
