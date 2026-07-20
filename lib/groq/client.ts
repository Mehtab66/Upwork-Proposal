import OpenAI from "openai";

export function getGroqApiKey() {
  return process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
}

export function getGroqModel() {
  return (
    process.env.GROQ_MODEL ||
    process.env.GROK_MODEL ||
    "llama-3.3-70b-versatile"
  );
}

export function createGroqClient() {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Add your Groq key from https://console.groq.com/keys to .env.local."
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}
