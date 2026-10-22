const express = require("express");
const { addonBuilder, getRouter } = require("stremio-addon-sdk");

// 1. Define Addon Manifest
const manifest = {
  id: "org.moviebox.stremio",
  version: "1.0.0",
  name: "MovieBox Streams",
  description: "Direct MovieBox streams in 1080p, 720p, and 480p",
  resources: ["stream"],
  types: ["movie", "series"],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

// 2. Stream Handler logic
builder.defineStreamHandler(async ({ type, id }) => {
  // `id` is the IMDb ID (e.g., tt0111161) or episode format (e.g., tt0903747:1:1)
  console.log(`Requested streams for ${type}: ${id}`);

  try {
    // TODO: Replace these static URLs with your MovieBox scraper logic / API call
    // e.g., const directLinks = await scrapeMovieBoxLinks(id);

    const streams = [
      {
        name: "MovieBox",
        title: "🎬 1080p | Full HD\n⚡ Direct Server 1",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        behaviorHints: {
          notSupported: false,
          requestHeaders: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
          }
        }
      },
      {
        name: "MovieBox",
        title: "🎬 720p | HD\n⚡ Direct Server 1",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      },
      {
        name: "MovieBox",
        title: "🎬 480p | SD\n⚡ Direct Server 1",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      }
    ];

    return { streams };
  } catch (error) {
    console.error("Error fetching streams:", error);
    return { streams: [] };
  }
});

// 3. Express Server Setup & Stremio Router Integration
const app = express();

// CORS Headers enabling Stremio web & desktop clients
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const addonInterface = builder.getInterface();
const sdkRouter = getRouter(addonInterface);

// Mount the Stremio SDK router
app.use("/", sdkRouter);

// Local development listener
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`Addon running locally at http://localhost:${PORT}/manifest.json`);
  });
}

// Export Express app for Vercel Serverless Function
module.exports = app;
