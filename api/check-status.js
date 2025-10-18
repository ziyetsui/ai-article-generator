import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  // Get jobId from the query string parameters
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");

  if (!jobId) {
    return new Response(JSON.stringify({ message: "请提供任务ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const store = getStore("article-jobs");
    const job = await store.get(jobId, { type: "json" });

    if (!job) {
      return new Response(JSON.stringify({ message: "任务未找到" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If the job is completed or has failed, it can be deleted from the store
    // after being retrieved to save space.
    if (job.status === "completed" || job.satus === "failed") {
        await store.delete(jobId);
    }
    
    return new Response(JSON.stringify(job), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(`Error checking status for job ${jobId}:`, error);
    return new Response(JSON.stringify({ message: "查询任务状态失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
