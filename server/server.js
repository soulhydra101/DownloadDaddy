const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const youtubedl = require("youtube-dl-exec");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Detect FFmpeg (Windows & Linux)
const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg"; // On Windows, set it via env

const downloadFile = async (req, res, type, format) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        res.setHeader("Content-Disposition", `attachment; filename="download.${type}"`);
        res.setHeader("Content-Type", type === "mp3" ? "audio/mpeg" : "video/mp4");

        const options = {
            output: "-",
            format: format,
            ffmpegLocation: ffmpegPath,
        };

        const process = youtubedl.exec(url, options, { stdio: ["ignore", "pipe", "ignore"] });

        process.stdout.pipe(res);
    } catch (error) {
        console.error(`${type.toUpperCase()} Download failed:`, error);
        res.status(500).json({ error: `${type.toUpperCase()} Download failed` });
    }
};

app.post("/download/mp3", (req, res) => downloadFile(req, res, "mp3", "bestaudio"));
app.post("/download/mp4", (req, res) => downloadFile(req, res, "mp4", "best[ext=mp4]/best"));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
