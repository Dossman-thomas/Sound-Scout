import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Enable CORS so your front-end can call this from the browser
app.use(cors());

// Proxy route for Shazam API
app.get("/api/shazam", async (req, res) => {
  const { term } = req.query;
  const url = `https://shazam.p.rapidapi.com/v2/search?term=${encodeURIComponent(term)}&locale=en-US&offset=0&limit=5`;

  try {
    // console.log("RapidAPI Key: ", process.env.RAPIDAPI_KEY ? "Loaded" : "Not Loaded");
    // console.log("RapidAPI Key: ", process.env.RAPIDAPI_KEY);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      const text = await response.text();
      console.error("Shazam API error response:", text);
      return res.status(response.status).json({
        error: `Shazam API error: ${response.status}`,
        details: text,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from Shazam API" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
