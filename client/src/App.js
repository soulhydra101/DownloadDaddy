import { useState } from "react";
import "./App.css"; // Import the CSS file

function App() {
    const [url, setUrl] = useState("");
    const [loadingMp3, setLoadingMp3] = useState(false);
    const [loadingMp4, setLoadingMp4] = useState(false);

    const handleDownload = async (type) => {
        if (!url.trim()) {
            alert("Please enter a valid video URL!");
            return;
        }

        const endpoint = type === "mp3" ? "mp3" : "mp4";
        const setLoading = type === "mp3" ? setLoadingMp3 : setLoadingMp4;

        setLoading(true);
        try {
            const response = await fetch(`https://download-daddy1.vercel.app/download/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ${type.toUpperCase()} file`);
            }

            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `download.${type}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(`${type.toUpperCase()} Download Error:`, error);
            alert(`Error downloading ${type.toUpperCase()} file.`);
        }
        setLoading(false);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Audio / Video Downloader</h2>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter video URL"
                style={{ width: "60%", padding: "10px", marginBottom: "20px" }}
            />
            <br />
            <button
                onClick={() => handleDownload("mp3")}
                disabled={loadingMp3}
                style={{ marginRight: "10px", padding: "10px 20px" }}
            >
                {loadingMp3 ? "Downloading MP3..." : "Download MP3"}
            </button>
            <button
                onClick={() => handleDownload("mp4")}
                disabled={loadingMp4}
                style={{ padding: "10px 20px" }}
            >
                {loadingMp4 ? "Downloading MP4..." : "Download MP4"}
            </button>
        </div>
    );
}

export default App;

