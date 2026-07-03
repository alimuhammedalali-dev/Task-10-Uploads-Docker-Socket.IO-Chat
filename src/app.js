require("dotenv").config();
const express = require("express");
const app = express();
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const path = require("path");


app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json()); // json data 
app.use(express.urlencoded({ extended: true })); // files
app.use(require("morgan")("dev"));
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))
app.get("/api/health", (req, res) => res.status(200).json("API is Healthy"))
app.use("/api/v1/uploads", require("./routes/uploads.routes"))

const PORT = process.env.PORT || 3000;
//web socket implementation
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

// 🔥 استدعاء ملف السوكيت المنفصل وتمرير سيرفر الـ io له
require("./socket")(io);

 mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to database successfully") 
        app.listen(PORT, () => {
            console.log("Server is running successfully");
        })
     })
    .catch(err => {
        console.log("Mongodb Error:", err.message);
    }) 

