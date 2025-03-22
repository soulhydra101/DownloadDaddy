const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const youtubedl = require("youtube-dl-exec");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FFmpegPath = "C:\\ffmpeg\\bin\\ffmpeg.exe"; // Ensure correct path for FFmpeg

// ✅ Route for downloading MP3
app.post("/download/mp3", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const options = {
            output: "-",
            format: "bestaudio",
            extractAudio: true,
            audioFormat: "mp3",
            ffmpegLocation: FFmpegPath,
        };

        res.setHeader("Content-Disposition", 'attachment; filename="audio.mp3"');
        res.setHeader("Content-Type", "audio/mpeg");

        const process = youtubedl.exec(url, options, { stdio: ["ignore", "pipe", "ignore"] });

        process.stdout.pipe(res);
    } catch (error) {
        console.error("MP3 Download failed:", error);
        res.status(500).json({ error: "MP3 Download failed", details: error.message });
    }
});

// ✅ Route for downloading MP4
app.post("/download/mp4", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const options = {
            output: "-",
            format: "best[ext=mp4]+bestaudio[ext=m4a]/best",
            ffmpegLocation: FFmpegPath,
        };

        res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
        res.setHeader("Content-Type", "video/mp4");

        const process = youtubedl.exec(url, options, { stdio: ["ignore", "pipe", "ignore"] });

        process.stdout.pipe(res);
    } catch (error) {
        console.error("MP4 Download failed:", error);
        res.status(500).json({ error: "MP4 Download failed", details: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
