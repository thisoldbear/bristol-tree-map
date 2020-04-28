import express from "express";
import path from "path";
import fetch from "node-fetch";

// Create a new express app instance
const app: express.Application = express();

app.use(express.static(path.join(__dirname, "../", "../", "client", "build")));

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../", "../", "client", "build", "index.html")
  );
});

app.get("/trees", async (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const range = req.query.range;

  await fetch(
    `https://bristoltrees.space/trees/ajax/trees-in-range.xq?latitude=${latitude}&longitude=${longitude}&range=${range}`
  )
    .then((response) => response.json())
    .then((results) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(results));
    });
});

app.listen(8080, () => {
  console.log("App is listening on port 8080!");
});
