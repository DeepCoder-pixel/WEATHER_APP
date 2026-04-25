import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static(__dirname));


// API route
app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: process.env.API_KEY,
          units: "metric",
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch weather",
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "weather.html"));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
