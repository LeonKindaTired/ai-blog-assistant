import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export async function generateIntro(message: string) {
  try {
    return await groq.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that write engaging blog introductions",
          },
          {
            role: "user",
            content: `Generate an intro for this post: ${message}`,
          },
        ],
        model: "llama-3.3-70b-versatile",
      })
      .then((chatCompletion) => {
        const intro = chatCompletion.choices[0]?.message?.content || null;
        return intro;
      });
  } catch (error) {
    console.error("Error generating intro: " + error);
    return null;
  }
}

export async function generateSummary(message: string) {
  try {
    return await groq.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that writes blog summaries",
          },
          {
            role: "user",
            content: `Generate a summary for this post: ${message}`,
          },
        ],
        model: "llama-3.3-70b-versatile",
      })
      .then((chatCompletion) => {
        const summary = chatCompletion.choices[0]?.message?.content || null;
        return summary;
      });
  } catch (error) {
    console.error("Error generating intro: " + error);
    return null;
  }
}
