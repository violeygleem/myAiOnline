import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://www.dmxapi.cn/v1", // ⭐ 必须加
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-5.2-cdx", // ⭐ 跟你 Python 一致
      messages: [{ role: "user", content: message }],
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("API ERROR:", err); // ⭐ 很重要
    res.status(500).json({
      error: err.message,
    });
  }
}