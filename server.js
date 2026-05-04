import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: "2mb" }));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.get("/", (req, res) => {
  res.send("Proxy is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/v1/chat/completions", async (req, res) => {
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
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});