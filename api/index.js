const express = require("express");
const { addonBuilder, getRouter } = require("stremio-addon-sdk");

// 1. Addon Manifest
const manifest = {
  id: "org.moviebox.stremio",
  version: "1.0.0",
  name: "MovieBox Streams",
  description: "Direct MovieBox streams in 1080p, 720p, and 480p",
  resources: ["stream"],
  types: ["movie", "series"],
  idPrefixes: ["tt"],
  catalogs: []
};

const builder = new addonBuilder(manifest);

// 2. Stream Handler
builder.defineStreamHandler(async ({ type, id }) => {
  // id = IMDb ID (tt0111161) or episode format (tt0903747:1:1)
  console.log(`Requested streams for ${type}: ${id}`);

  try {
    // TODO: replace these static URLs with your MovieBox scraper / API call
    // e.g. const directLinks = await scrapeMovieBoxLinks(id);

    const base = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264";
    const streams = [
      {
        name: "MovieBox",
        title: "🎬 1080p | Full HD\n⚡ Direct Server 1",
        url: `${base}/1080/Big_Buck_Bunny_1080_10s_1MB.mp4`,
        behaviorHints: { notWebReady: true }
      },
      {
        name: "MovieBox",
        title: "🎬 720p | HD\n⚡ Direct Server 1",
        url: `${base}/720/Big_Buck_Bunny_720_10s_1MB.mp4`,
        behaviorHints: { notWebReady: true }
      },
      {
        name: "MovieBox",
        title: "🎬 480p | SD\n⚡ Direct Server 1",
        url: `${base}/360/Big_Buck_Bunny_360_10s_1MB.mp4`,
        behaviorHints: { notWebReady: true }
      }
    ];

    return { streams };
  } catch (error) {
    console.error("Error fetching streams:", error);
    return { streams: [] };
  }
});

// 3. Express app + Stremio router
const app = express();

// CORS for Stremio web & desktop clients
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const addonInterface = builder.getInterface();
// Redirect root to the manifest
app.get("/", (req, res) => res.redirect("/manifest.json"));

app.use("/", getRouter(addonInterface));

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`Addon running at http://localhost:${PORT}/manifest.json`);
  });
}

// Vercel serverless export
module.exports = app;
