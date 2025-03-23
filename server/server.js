const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Route to Download MP3
app.get("/download/mp3", async (req, res) => {
    const { url } = req.query;
    if (!ytdl.validateURL(url)) return res.status(400).json({ error: "Invalid URL" });

    try {
        res.setHeader("Content-Disposition", 'attachment; filename="audio.mp3"');
        res.setHeader("Content-Type", "audio/mpeg");

        const stream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });
        stream.pipe(res);
    } catch (error) {
        console.error("MP3 Download Error:", error);
        res.status(500).json({ error: "Failed to download MP3" });
    }
});

// ✅ Route to Download MP4
app.get("/download/mp4", async (req, res) => {
    const { url } = req.query;
    if (!ytdl.validateURL(url)) return res.status(400).json({ error: "Invalid URL" });

    try {
        res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
        res.setHeader("Content-Type", "video/mp4");

        const stream = ytdl(url, { quality: "highestvideo" });
        stream.pipe(res);
    } catch (error) {
        console.error("MP4 Download Error:", error);
        res.status(500).json({ error: "Failed to download MP4" });
    }
});

// ✅ Start Server
app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
