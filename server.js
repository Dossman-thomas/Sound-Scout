import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.json());

// Enable CORS so your front-end can call this from the browser
app.use(cors());

// Proxy route for Shazam API
app.get("/api/shazam", async (req, res) => {
  const term = req.query.term;
  const url = `https://shazam.p.rapidapi.com/v2/search?term=${encodeURIComponent(term)}&locale=en-US&offset=0&limit=5`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "shazam.p.rapidapi.com"
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching from Shazam API" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
