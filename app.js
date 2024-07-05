const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index"); // Render 'index.ejs' from the 'views' directory
});
io.on("connection", (socket) => {
   socket.on("send coordinates", (data) => {
       io.emit("recieve coordinates", {id: socket.id, ...data});
   })
   socket.on("disconnect", () => {
       io.emit("user-dissconected", socket.id);
   })
})
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
