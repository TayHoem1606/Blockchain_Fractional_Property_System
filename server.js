const express = require("express");
const path = require("path");
const app = express();

// Serve all files in current folder
app.use(express.static(__dirname));

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(5000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);