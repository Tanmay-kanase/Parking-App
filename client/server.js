import path from "path";
import express from "express";
const __dirname = path.resolve();

const app = express();

app.listen(8888, () => {
  console.log("server is running on port 8888!!!!!");
});

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
