import * as functions from "firebase-functions";

import * as express from "express";
import * as path from "path";
import fetch from "node-fetch";

// Create a new express app instance
const app: express.Application = express();

app.use(
  express.static(path.join(__dirname, "../", "../", "../", "client", "build"))
);

app.get("/", (req: any, res: any) => {
  res.sendFile(
    path.join(__dirname, "../", "../", "../", "client", "build", "index.html")
  );
});

app.get("/trees", async (req: any, res: any) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  await fetch(
    `https://bristoltrees.space/trees/ajax/trees-in-range.xq?latitude=${latitude}&longitude=${longitude}&range=${500}`,
    {
      method: "GET",
    }
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

exports.app = functions.https.onRequest(app);
