import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: "2mb" }));

// Your real OpenRouter key (stored in Railway Variables)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Your personal password for accessing this proxy (stored in Railway Variables)
const CLIENT_KEY = process.env.CLIENT_KEY;

// Basic homepage
app.get("/", (req, res) => {
  res.send("Proxy is running");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Protected OpenAI-compatible chat completions endpoint
app.post("/v1/chat/completions", async (req, res) => {
  // Check if user's Authorization header matches your secret CLIENT_KEY
  if (req.headers.authorization !== `Bearer ${CLIENT_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-app.com",
        "X-Title": "iPhone Proxy"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.text();

    res.status(response.status);

    // Forward OpenRouter response directly
    res.send(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});

// Railway provides PORT automatically
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
